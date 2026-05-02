import AdminDashboard from "@/components/AdminDashboard";
import { getSiteContent } from "@/lib/bookingStore";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const siteContent = await getSiteContent();

  return (
    <AdminDashboard
      initialAuthenticated={false}
      initialAccessCodes={[]}
      initialBookings={[]}
      initialSiteContent={siteContent}
    />
  );
}
