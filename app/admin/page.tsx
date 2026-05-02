import AdminDashboard from "@/components/AdminDashboard";
import { listAccessCodes, toAccessCodeListItem } from "@/lib/accessCodeStore";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getSiteContent, listBookings } from "@/lib/bookingStore";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();
  const [bookings, siteContent, accessCodes] = authenticated
    ? await Promise.all([listBookings(), getSiteContent(), listAccessCodes()])
    : [[], await getSiteContent(), []];

  return (
    <AdminDashboard
      initialAuthenticated={authenticated}
      initialAccessCodes={accessCodes.map(toAccessCodeListItem)}
      initialBookings={bookings}
      initialSiteContent={siteContent}
    />
  );
}
