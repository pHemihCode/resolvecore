// app/(dashboard)/tickets/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import TicketDetail from "@/components/dashboard/TicketDetail";

interface TicketDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  if (!session.user.companyId) {
    redirect("/onboarding");
  }

  const { id } = await params;

  return <TicketDetail ticketId={id} />;
}