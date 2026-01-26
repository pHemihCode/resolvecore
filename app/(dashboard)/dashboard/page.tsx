import DashboardUiComponent from "@/components/ui/dashboardUI/DashboardUiComponent";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function DashboardPage() {
   const session = await getServerSession(authOptions);


  return (
    <DashboardUiComponent session={session} />
  );
}