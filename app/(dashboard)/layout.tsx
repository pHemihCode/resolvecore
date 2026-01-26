import DashboardLayoutComp from "@/components/ui/dashboardUI/DashboardLayoutComp";
import Loading from "@/components/ui/Loading";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
   <Suspense fallback={<Loading />}>
     <DashboardLayoutComp>{children}</DashboardLayoutComp>
   </Suspense>
  );
}