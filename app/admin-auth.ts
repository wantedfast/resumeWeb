import { getChatGPTUser, requireChatGPTUser, type ChatGPTUser } from "./chatgpt-auth";

function allowedEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminUser(user: ChatGPTUser | null): user is ChatGPTUser {
  return Boolean(user && allowedEmails().has(user.email.toLowerCase()));
}

export async function getAdminUser() {
  const user = await getChatGPTUser();
  return isAdminUser(user) ? user : null;
}

export async function requireAdminUser(returnTo = "/admin") {
  const user = await requireChatGPTUser(returnTo);
  return isAdminUser(user) ? user : null;
}
