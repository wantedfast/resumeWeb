import { buildSystemPrompt } from "./assistant-knowledge.mjs";

const MAX_MESSAGES = 12;
const MAX_CONTENT_LENGTH = 800;
const MAX_BODY_BYTES = 64 * 1024;
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("Request body is too large."), { statusCode: 413 }));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { statusCode: 400 }));
      }
    });

    request.on("error", reject);
  });
}

function validateMessages(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    throw Object.assign(new Error(`Messages must contain between 1 and ${MAX_MESSAGES} items.`), {
      statusCode: 400,
    });
  }

  return value.map((message) => {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      message.content.trim().length === 0 ||
      message.content.length > MAX_CONTENT_LENGTH
    ) {
      throw Object.assign(
        new Error(`Every message must have a valid role and 1–${MAX_CONTENT_LENGTH} characters.`),
        { statusCode: 400 },
      );
    }
    return { role: message.role, content: message.content.trim() };
  });
}

function validatePageContext(value) {
  const allowedKinds = new Set(["home", "project", "experience"]);
  if (!value || typeof value !== "object") return { kind: "home", slug: null };
  const kind = allowedKinds.has(value.kind) ? value.kind : "home";
  const slug =
    typeof value.slug === "string" && /^[a-z0-9-]{1,80}$/.test(value.slug)
      ? value.slug
      : null;
  return { kind, slug };
}

function writeEvent(response, event, payload) {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

async function streamDeepSeek({ apiKey, messages, pageContext, response }) {
  const upstreamController = new AbortController();
  const timeout = setTimeout(() => upstreamController.abort(), 30_000);

  response.on("close", () => upstreamController.abort());

  try {
    const upstream = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        messages: [
          { role: "system", content: buildSystemPrompt(pageContext) },
          ...messages,
        ],
        thinking: { type: "disabled" },
        temperature: 0.3,
        max_tokens: 600,
        stream: true,
      }),
      signal: upstreamController.signal,
    });

    if (!upstream.ok || !upstream.body) {
      throw new Error(`DeepSeek returned ${upstream.status}.`);
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders?.();

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n");
      buffer = blocks.pop() ?? "";

      for (const block of blocks) {
        for (const line of block.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (typeof token === "string" && token) {
              writeEvent(response, "token", { text: token });
            }
          } catch {
            // Ignore upstream keep-alive or malformed non-content chunks.
          }
        }
      }
    }

    writeEvent(response, "done", {});
    response.end();
  } catch (error) {
    if (!response.headersSent) {
      sendJson(response, error.name === "AbortError" ? 504 : 502, {
        error:
          error.name === "AbortError"
            ? "The assistant request timed out."
            : "The assistant could not reach DeepSeek.",
      });
    } else if (!response.writableEnded) {
      writeEvent(response, "error", {
        message:
          error.name === "AbortError"
            ? "The assistant request timed out."
            : "The assistant connection was interrupted.",
      });
      response.end();
    }
  } finally {
    clearTimeout(timeout);
  }
}

function createAssistantProxy({ apiKey }) {
  return {
    name: "local-assistant-proxy",
    configureServer(server) {
      server.middlewares.use("/api/assistant/chat", async (request, response) => {
        if (request.method !== "POST") {
          sendJson(response, 405, { error: "Method not allowed." });
          return;
        }
        if (!apiKey) {
          sendJson(response, 503, {
            error:
              "The local assistant is not configured. Add DEEPSEEK_API_KEY to .env.local and restart the dev server.",
          });
          return;
        }

        try {
          const body = await readJsonBody(request);
          const messages = validateMessages(body.messages);
          const pageContext = validatePageContext(body.pageContext);
          await streamDeepSeek({ apiKey, messages, pageContext, response });
        } catch (error) {
          if (!response.writableEnded) {
            sendJson(response, error.statusCode ?? 500, {
              error: error.statusCode ? error.message : "The assistant request failed.",
            });
          }
        }
      });
    },
  };
}

export { createAssistantProxy };
