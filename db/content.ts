import { env } from "cloudflare:workers";
import { DEFAULT_PROFILE, isSiteProfile, type SiteProfile } from "../app/profile";

type D1ResultRow = { body: string };

function getBinding(): D1Database | null {
  return env.DB ?? null;
}

async function ensureContentTables(db: D1Database) {
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS content_documents (
        key TEXT PRIMARY KEY NOT NULL,
        body TEXT NOT NULL,
        updated_at INTEGER NOT NULL,
        updated_by TEXT NOT NULL
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS content_revisions (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        key TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        created_by TEXT NOT NULL
      )
    `),
    db.prepare("CREATE INDEX IF NOT EXISTS content_revisions_key_idx ON content_revisions (key, created_at)"),
  ]);
}

export async function getSiteProfile(): Promise<SiteProfile> {
  const db = getBinding();
  if (!db) return DEFAULT_PROFILE;

  try {
    await ensureContentTables(db);
    const row = await db
      .prepare("SELECT body FROM content_documents WHERE key = ? LIMIT 1")
      .bind("profile")
      .first<D1ResultRow>();
    if (!row) return DEFAULT_PROFILE;
    const parsed: unknown = JSON.parse(row.body);
    return isSiteProfile(parsed) ? parsed : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function saveSiteProfile(profile: SiteProfile, updatedBy: string) {
  const db = getBinding();
  if (!db) throw new Error("Persistent storage is unavailable");
  await ensureContentTables(db);

  const body = JSON.stringify(profile);
  if (body.length > 200_000) throw new Error("Profile content is too large");

  const now = Date.now();
  await db.batch([
    db
      .prepare("INSERT INTO content_revisions (key, body, created_at, created_by) VALUES (?, ?, ?, ?)")
      .bind("profile", body, now, updatedBy),
    db
      .prepare(`
        INSERT INTO content_documents (key, body, updated_at, updated_by)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          body = excluded.body,
          updated_at = excluded.updated_at,
          updated_by = excluded.updated_by
      `)
      .bind("profile", body, now, updatedBy),
  ]);

  return { updatedAt: now };
}
