import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const GREETING =
  "Welcome. I’m Luo Zhaoyue, Xinlong’s personal assistant. I can introduce his research, work, and projects.";
const MODEL_ID = "eleven_v3";
const OUTPUT_PATH = path.resolve(
  "public/assets/luo-zhaoyue-greeting-v3.mp3",
);

function parseEnv(source) {
  const values = {};
  for (const rawLine of source.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

async function loadLocalEnv() {
  try {
    return parseEnv(await readFile(path.resolve(".env.local"), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

const localEnv = await loadLocalEnv();
const apiKey = process.env.ELEVENLABS_API_KEY || localEnv.ELEVENLABS_API_KEY;
const voiceId =
  process.env.ELEVENLABS_VOICE_ID || localEnv.ELEVENLABS_VOICE_ID;

if (!apiKey || !voiceId) {
  throw new Error(
    "ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID are required in the environment or .env.local.",
  );
}

const endpoint =
  `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}` +
  "?output_format=mp3_44100_128&enable_logging=false";
const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "xi-api-key": apiKey,
    "Content-Type": "application/json",
    Accept: "audio/mpeg",
  },
  body: JSON.stringify({
    text: GREETING,
    model_id: MODEL_ID,
  }),
});

if (!response.ok) {
  const detail = await response.text();
  throw new Error(
    `ElevenLabs greeting generation failed (${response.status}): ${detail.slice(0, 300)}`,
  );
}

const audio = Buffer.from(await response.arrayBuffer());
await writeFile(OUTPUT_PATH, audio);
console.log(
  `Generated ${path.relative(process.cwd(), OUTPUT_PATH)} with ${MODEL_ID} (${audio.length} bytes).`,
);
