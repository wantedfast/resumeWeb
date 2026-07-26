import { getAdminUser } from "../../../admin-auth";
import { isSiteProfile } from "../../../profile";
import { getSiteProfile, saveSiteProfile } from "../../../../db/content";

export async function GET() {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ profile: await getSiteProfile(), user: { email: user.email } });
}

export async function PUT(request: Request) {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const raw = await request.text();
  if (raw.length > 220_000) return Response.json({ error: "Content is too large" }, { status: 413 });

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const profile = (value as { profile?: unknown })?.profile;
  if (!isSiteProfile(profile)) return Response.json({ error: "Invalid profile structure" }, { status: 400 });

  const result = await saveSiteProfile(profile, user.email);
  return Response.json({ ok: true, ...result });
}
