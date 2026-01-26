// app/(dashboard)/tickets/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import TicketsList from "@/components/dashboard/TicketList";

export default async function TicketsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (!session.user.companyId) {
    redirect("/onboarding");
  }

  return <TicketsList />;
}