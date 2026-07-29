const MAX_TEXT_LENGTH = 4000;
const MAX_BODY_BYTES = 32 * 1024;
const ELEVENLABS_ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech";

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(
          Object.assign(new Error("Speech request is too large."), {
            statusCode: 413,
          }),
        );
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(
          Object.assign(new Error("Speech request must be valid JSON."), {
            statusCode: 400,
          }),
        );
      }
    });

    request.on("error", reject);
  });
}

function validateText(value) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.trim().length > MAX_TEXT_LENGTH
  ) {
    throw Object.assign(
      new Error(`Speech text must contain 1-${MAX_TEXT_LENGTH} characters.`),
      { statusCode: 400 },
    );
  }
  return value.trim();
}

function upstreamError(status) {
  if (status === 401) {
    return {
      statusCode: 503,
      message:
        "The voice service rejected the local API key. Replace ELEVENLABS_API_KEY and restart the dev server.",
    };
  }
  if (status === 402) {
    return {
      statusCode: 402,
      message:
        "The ElevenLabs workspace does not have enough credits for this voice response.",
    };
  }
  if (status === 403) {
    return {
      statusCode: 503,
      message:
        "This ElevenLabs API key does not have Text to Speech access.",
    };
  }
  if (status === 404) {
    return {
      statusCode: 404,
      message:
        "The configured ElevenLabs voice could not be found in this workspace.",
    };
  }
  if (status === 429) {
    return {
      statusCode: 429,
      message:
        "The ElevenLabs usage or concurrency limit has been reached. Try again shortly.",
    };
  }
  return {
    statusCode: 502,
    message: "The voice service could not generate this response.",
  };
}

async function streamSpeech({
  apiKey,
  voiceId,
  modelId,
  text,
  request,
  response,
}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  request.on("aborted", () => controller.abort());
  response.on("close", () => {
    if (!response.writableEnded) controller.abort();
  });

  try {
    const endpoint =
      `${ELEVENLABS_ENDPOINT}/${encodeURIComponent(voiceId)}/stream` +
      "?output_format=mp3_44100_128&enable_logging=false";
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.52,
          similarity_boost: 0.78,
          style: 0.18,
          use_speaker_boost: true,
          speed: 1,
        },
      }),
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      const mapped = upstreamError(upstream.status);
      sendJson(response, mapped.statusCode, { error: mapped.message });
      return;
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "audio/mpeg");
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const characterCost = upstream.headers.get("character-cost");
    if (characterCost) response.setHeader("X-Character-Cost", characterCost);
    response.flushHeaders?.();

    const reader = upstream.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!response.write(Buffer.from(value))) {
        await new Promise((resolve) => response.once("drain", resolve));
      }
    }
    response.end();
  } catch (error) {
    if (response.writableEnded) return;
    const timedOut = error.name === "AbortError";
    if (!response.headersSent) {
      sendJson(response, timedOut ? 504 : 502, {
        error: timedOut
          ? "The voice request timed out."
          : "The assistant could not reach ElevenLabs.",
      });
    } else {
      response.destroy();
    }
  } finally {
    clearTimeout(timeout);
  }
}

function createAssistantSpeechProxy({ apiKey, voiceId, modelId }) {
  return {
    name: "local-assistant-speech-proxy",
    configureServer(server) {
      server.middlewares.use(
        "/api/assistant/speech",
        async (request, response) => {
          if (request.method !== "POST") {
            sendJson(response, 405, { error: "Method not allowed." });
            return;
          }
          if (!apiKey || !voiceId) {
            sendJson(response, 503, {
              error:
                "Voice is not configured. Add ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID to .env.local, then restart the dev server.",
            });
            return;
          }

          try {
            const body = await readJsonBody(request);
            const text = validateText(body.text);
            await streamSpeech({
              apiKey,
              voiceId,
              modelId: modelId || "eleven_flash_v2_5",
              text,
              request,
              response,
            });
          } catch (error) {
            if (!response.writableEnded) {
              sendJson(response, error.statusCode ?? 500, {
                error: error.statusCode
                  ? error.message
                  : "The speech request failed.",
              });
            }
          }
        },
      );
    },
  };
}

export { createAssistantSpeechProxy };
