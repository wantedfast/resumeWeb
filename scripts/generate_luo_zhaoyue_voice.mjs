import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { assistantVoiceContent } from "../src/assistant-locales.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadLocalEnv() {
  const raw = await fs.readFile(path.join(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

await loadLocalEnv();

const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId =
  process.env.ELEVENLABS_VOICE_ID ||
  process.env.VITE_ELEVENLABS_VOICE_ID;

if (!apiKey || !voiceId) {
  throw new Error(
    "ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID are required in .env.local.",
  );
}

const force = process.argv.includes("--force");
const targets = Object.entries(assistantVoiceContent).flatMap(
  ([language, content]) => {
    const directory = language === "en" ? [] : [language];
    const greetingName =
      language === "en"
        ? "luo-zhaoyue-greeting-v3.mp3"
        : `luo-zhaoyue-greeting-${language}-v3.mp3`;
    return [
      {
        text: content.greeting,
        output: path.join(root, "public", "assets", greetingName),
      },
      ...Object.entries(content.intros).map(([id, text]) => {
        const [kind, slug] = id.split(":");
        return {
          text,
          output: path.join(
            root,
            "public",
            "assets",
            "assistant-voice",
            ...directory,
            `${kind}-${slug}-v3.mp3`,
          ),
        };
      }),
    ];
  },
);

async function generate(target, index) {
  await fs.mkdir(path.dirname(target.output), { recursive: true });
  if (!force) {
    try {
      const existing = await fs.stat(target.output);
      if (existing.size > 1024) {
        console.log(`[${index + 1}/${targets.length}] exists: ${target.output}`);
        return;
      }
    } catch {
      // Generate missing output.
    }
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: target.text,
        model_id: "eleven_v3",
        output_format: "mp3_44100_128",
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      `ElevenLabs ${response.status}: ${await response.text()}`,
    );
  }

  await fs.writeFile(target.output, Buffer.from(await response.arrayBuffer()));
  console.log(`[${index + 1}/${targets.length}] wrote: ${target.output}`);
}

for (let index = 0; index < targets.length; index += 1) {
  await generate(targets[index], index);
}
