import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { createAssistantProxy } from "./server/assistant-proxy.mjs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [
      react(),
      createAssistantProxy({ apiKey: env.DEEPSEEK_API_KEY }),
    ],
  };
});
