"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/ui/LogoutButton"
function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
        <div className="text-center">
          <p className="text-sm md:text-base font-medium text-slate-700">
            Loading admin dashboard…
          </p>
          <p className="py-2 text-xs md:text-sm text-slate-500">
            Please wait while we verify your access.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();

  if (status === "loading") return <AdminLoading />;

  if (!session || session.user?.role !== "admin") {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:w-6/12 bg-blue-950 text-white text-2xl md:flex md:justify-center md:items-center">
        <LogoutButton />
      
      </div>

      <main className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}