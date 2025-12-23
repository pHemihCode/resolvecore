import DashboardProvider from "@/components/ui/dashboardUI/DashboardProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <DashboardProvider>{children}</DashboardProvider>
  );
}