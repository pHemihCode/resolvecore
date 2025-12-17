"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LifeBuoy,
  Settings,
  MessageSquare,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react";
import LogoutButton from "./ui/LogoutButton";
import LogoFull from "@/assets/Light-Mode-small.png";
import LogoIcon from "@/assets/Logo3.png";
import Image from "next/image";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Tickets", href: "/tickets", icon: MessageSquare },
  { label: "Widget", href: "/widget", icon: LifeBuoy },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col bg-white shadow-md border-gray-400 transition-all duration-300 z-50 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className={`${!isExpanded && "justify-center"} flex items-center  p-4`}>
        {isExpanded ? (
          <Image src={LogoFull} alt="Logo" width={130} height={50} />
        ) : (
          <Image src={LogoIcon} alt="Logo" width={30} height={30} />
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        {nav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 p-3 mx-2 rounded-lg text-sm font-medium transition-all duration-300
                ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100"}
                ${isExpanded ? "justify-start" : "justify-center"}
              `}
            >
              <item.icon
                className={`h-5 w-5 transition-colors duration-300 ${
                  isActive ? "text-white" : "text-gray-700 group-hover:text-gray-900"
                }`}
              />
              {isExpanded && <span>{item.label}</span>}
              {!isExpanded && (
                <span className="absolute left-16 bg-black text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className={`${isExpanded ? "flex p-2" :"flex justify-center"}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded hover:bg-blue-100 transition"
        >
          {isExpanded ? <ChevronsLeft className="h-5 w-5" /> : <ChevronsRight className="h-5 w-5" />}
        </button>
      </div>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <LogoutButton showLabel={isExpanded} />
      </div>
    </aside>
  );
}
