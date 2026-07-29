import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createAssistantProxy } from "./server/assistant-proxy.mjs";
import { createAssistantSpeechProxy } from "./server/assistant-speech-proxy.mjs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      createAssistantProxy({ apiKey: env.DEEPSEEK_API_KEY }),
      createAssistantSpeechProxy({
        apiKey: env.ELEVENLABS_API_KEY,
        voiceId: env.ELEVENLABS_VOICE_ID,
        modelId: env.ELEVENLABS_MODEL_ID,
      }),
    ],
  };
});
