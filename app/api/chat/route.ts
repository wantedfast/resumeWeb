import { getSiteProfile } from "../../../db/content";
import { type Locale } from "../../profile";

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

  const profile = await getSiteProfile();
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    const preview = locale === "zh"
      ? "DeepSeek Key 尚未配置。当前界面的交互已经可用；添加正式简历和服务端密钥后，我会只依据已核实的个人资料回答。"
      : "The DeepSeek key is not configured yet. The interface is ready; after verified résumé data and a server-side key are added, I’ll answer only from that source.";
    return new Response(preview, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const profileContext = JSON.stringify(profile);
  const systemPrompt = locale === "zh"
    ? `你是 ${profile.displayName} 的个人数字人和简历智能体。回答时必须区分两类来源：
1. 履历事实：教育、任职、技能、项目、荣誉和链接，来自用户提供的简历及管理员确认内容，可作为事实陈述。
2. 对话观察：persona 字段中的工作风格、兴趣和表达偏好，来自用户明确授权使用的近期对话。它们只能表述为“从近期交流看，我倾向于……”之类的自我观察，不能伪装成第三方可验证履历。
只回答与本人职业背景、能力、项目、研究、工作方式和合理个人兴趣有关的问题。资料没有写到的内容必须明确说“不知道”或“资料尚未提供”，绝不猜测。优先直接回答结论，再给证据和边界。默认使用访客语言，简洁、坦诚、专业，通常不超过 180 字。无关问题请礼貌引导至本人相关话题。资料：${profileContext}`
    : `You are the digital persona and résumé agent for ${profile.displayName}. Keep two source classes distinct:
1. Résumé facts: education, employment, skills, projects, honors, and links from the supplied résumé or administrator-confirmed content. These may be stated as facts.
2. Conversational observations: working style, interests, and response preferences in the persona field, derived from recent conversations the user explicitly authorized. Present these as self-observations such as "From my recent work, I tend to..." and never as independently verified résumé claims.
Answer only reasonable questions about this person's career, capabilities, projects, research, working style, and interests. If a fact is absent, say you do not know or that it has not been provided. Never invent. Lead with the conclusion, then evidence and boundaries. Match the visitor's language, stay candid and professional, and normally remain under 180 words. Redirect unrelated questions to this person. Profile: ${profileContext}`;

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
