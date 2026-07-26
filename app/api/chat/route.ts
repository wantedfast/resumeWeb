import { PROFILE, type Locale } from "../../profile";

type InputMessage = { role: "user" | "assistant"; content: string };

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: { messages?: InputMessage[]; locale?: Locale };
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const locale: Locale = body.locale === "en" ? "en" : "zh";
  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
        .slice(-10)
        .map((item) => ({ role: item.role, content: item.content.trim().slice(0, 500) }))
        .filter((item) => item.content)
    : [];

  if (!messages.length) return jsonError("A message is required", 400);

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    const preview = locale === "zh"
      ? "DeepSeek Key 尚未配置。当前界面的交互已经可用；添加正式简历和服务端密钥后，我会只依据已核实的个人资料回答。"
      : "The DeepSeek key is not configured yet. The interface is ready; after verified résumé data and a server-side key are added, I’ll answer only from that source.";
    return new Response(preview, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const profileContext = JSON.stringify(PROFILE);
  const systemPrompt = locale === "zh"
    ? `你是 ${PROFILE.displayName} 的个人简历智能体。只依据下方资料回答与本人职业背景、技能、经历和项目有关的问题。资料没有写到的内容必须明确说“不知道”或“资料尚未提供”，绝不猜测。回答简洁、坦诚、专业，通常不超过 120 字。无关问题请礼貌引导至职业话题。资料：${profileContext}`
    : `You are the résumé agent for ${PROFILE.displayName}. Answer only career, skill, experience, and project questions using the verified profile below. If a fact is absent, say you do not know or that it has not been provided. Never invent. Be concise, candid, and professional, normally under 140 words. Redirect unrelated questions to career topics. Profile: ${profileContext}`;

  let upstream: Response;
  try {
    upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "deepseek-chat",
        stream: true,
        max_tokens: 500,
        temperature: 0.2,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    return jsonError("DeepSeek is temporarily unreachable", 502);
  }

  if (!upstream.ok || !upstream.body) {
    return jsonError(upstream.status === 402 ? "DeepSeek balance is insufficient" : "DeepSeek request failed", 502);
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const data = line.startsWith("data:") ? line.slice(5).trim() : "";
            if (!data || data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const text = parsed.choices?.[0]?.delta?.content;
              if (typeof text === "string") controller.enqueue(encoder.encode(text));
            } catch {
              // Ignore malformed upstream heartbeat chunks.
            }
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
