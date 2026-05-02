import CasaMimosaApp from "@/components/CasaMimosaApp";
import { getSiteContent } from "@/lib/bookingStore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const siteContent = await getSiteContent();
  const today = new Date().toISOString().slice(0, 10);
  return <CasaMimosaApp siteContent={siteContent} today={today} />;
}
