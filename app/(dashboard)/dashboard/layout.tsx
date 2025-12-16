import { Suspense } from "react";
import DashboardContent from "./DashboardContent"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading dashboard...</p>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
