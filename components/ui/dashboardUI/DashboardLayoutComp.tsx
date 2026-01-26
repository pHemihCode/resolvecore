"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SessionProvider from "@/components/SessionProvider";

export default function DashboardLayoutComp({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <SessionProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        <Sidebar
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar onMenuClick={() => setIsMobileOpen(true)} />
          <main className="flex-1 overflow-y-auto px-2 py-6 md:p-6 scroll-smooth">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
