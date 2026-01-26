"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LifeBuoy,
  Settings,
  MessageSquare,
  ChevronsLeft,
  ChevronsRight,
  Ticket,
  X
} from "lucide-react";
import LogoutButton from "./ui/LogoutButton";
import LogoFull from "@/assets/Light-Mode-small.png";
import LogoIcon from "@/assets/Logo3.png";
import Image from "next/image";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/tickets", icon: MessageSquare },
  { label: "View Ticket", href: "/view-ticket", icon: Ticket },
  { label: "Settings", href: "/settings", icon: Settings },
];

type SidebarProps = {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ 
  isExpanded, 
  setIsExpanded, 
  isMobileOpen, 
  setIsMobileOpen 
}: SidebarProps) {
  const pathname = usePathname();

   useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  return (
       <>
      {/* --- MOBILE OVERLAY (Backdrop) --- */}
      {/* Visible only on small screens when menu is open */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white shadow-md border-r border-gray-400 
          flex flex-col h-screen shrink-0 transition-all duration-300 ease-in-out
          w-64 transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:transform-none 
          ${isExpanded ? "lg:w-64" : "lg:w-20"}
        `}
      >
        {/* Logo Header */}
        <div className={`flex items-center justify-between p-4 ${!isExpanded ? "lg:justify-center" : ""}`}>
          {/* Logic: Show Full logo on Mobile OR Desktop Expanded. Show Icon on Desktop Collapsed */}
          <div className="flex items-center justify-center">
            {isExpanded || isMobileOpen ? (
              <Image src={LogoFull} alt="Logo" width={130} height={50} priority />
            ) : (
              <Image src={LogoIcon} alt="Logo" width={30} height={30} priority />
            )}
          </div>
          
          {/* Close Button (Mobile Only) */}
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            // On mobile, always show full labels. On desktop, check isExpanded
            const showLabel = isMobileOpen || isExpanded;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive ? "bg-blue-500 text-white shadow-sm" : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"}
                  ${showLabel ? "justify-start" : "justify-center"}
                `}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-colors ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                  }`}
                />
                
                {showLabel && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button (Desktop Only) */}
        <div className={`p-2 flex ${isExpanded ? "justify-start" : "justify-center"} shrink-0`}>
    <button
      onClick={() => setIsExpanded(!isExpanded)}
      className="p-2 rounded hover:bg-blue-100 transition-colors shrink-0"
      aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
    >
      {isExpanded ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
    </button>
  </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <LogoutButton showLabel={isExpanded || isMobileOpen} />
        </div>
      </aside>
    </>
  );
}