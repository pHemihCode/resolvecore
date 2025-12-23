import DashboardProvider from "@/components/ui/dashboardUI/DashboardProvider";
import Loading from "@/components/ui/Loading";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
   <Suspense fallback={<Loading />}>
     <DashboardProvider>{children}</DashboardProvider>
   </Suspense>
  );
}