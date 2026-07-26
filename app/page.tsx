import { getSiteProfile } from "../db/content";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await getSiteProfile();
  return <HomeClient initialProfile={profile} />;
}
