"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LifeBuoy,
  Settings,
  MessageSquare,
  ChevronsLeft,
  ChevronsRight,
  Ticket
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
};

export default function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col bg-white shadow-md border-r border-gray-400 transition-all duration-300 h-screen shrink-0 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className={`${!isExpanded && "justify-center"} flex items-center p-4`}>
        {isExpanded ? (
          <Image src={LogoFull} alt="Logo" width={130} height={50} />
        ) : (
          <Image src={LogoIcon} alt="Logo" width={30} height={30} />
        )}
      </div>

      <nav className="flex-1 mt-4 px-1">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 p-3 mx-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"}
                ${isExpanded ? "justify-start" : "justify-center"}
              `}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-gray-700 group-hover:text-gray-900"
                }`}
              />
              {isExpanded && <span>{item.label}</span>}
              {!isExpanded && (
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-black/90 text-white px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-50 shadow-lg pointer-events-none">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
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
      <div className="p-4 mt-auto border-t border-gray-100">
        <LogoutButton showLabel={isExpanded} />
      </div>
    </aside>
  );
}