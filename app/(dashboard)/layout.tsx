import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SessionProvider from "@/components/SessionProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen flex bg-gray-50 w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col fixed top-0 left-64 right-0 z-40">
          <Topbar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
