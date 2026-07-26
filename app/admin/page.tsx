import { requireAdminUser } from "../admin-auth";
import { getSiteProfile } from "../../db/content";
import AdminClient from "./admin-client";

export const dynamic = "force-dynamic";

async function AdminGate() {
  const user = await requireAdminUser("/admin");
  if (!user) {
    return (
      <main className="admin-denied">
        <p>ADMIN ACCESS</p>
        <h1>当前 ChatGPT 账户没有管理权限。</h1>
        <a href="/">返回网站</a>
      </main>
    );
  }

  const profile = await getSiteProfile();
  return <AdminClient initialProfile={profile} userEmail={user.email} />;
}

export default function AdminPage() {
  return <AdminGate />;
}
