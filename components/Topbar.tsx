"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import Avatar from "@/assets/avatar.png";
import Image from "next/image";
import LogoutButton from "@/components/ui/LogoutButton"; // Adjust path if needed (based on your Sidebar import)

export default function Topbar() {
  const { data } = useSession();
  const user = data?.user;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleItemClick = () => {
    setIsOpen(false); // Close after selection
  };

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
      {/* Left: Welcome message */}
      <p className="text-sm text-gray-600">
        Welcome, <span className="font-medium text-gray-900">{user?.name}</span>
      </p>

      {/* Right: Avatar Dropdown Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors relative"
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="User menu"
        >
          <Image
            src={user?.image || Avatar}
            alt="User avatar"
            className="h-8 w-8 rounded-full ring-2 ring-gray-200"
            width={32}
            height={32}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Profile Info */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="font-medium text-gray-900 text-sm">{user?.name}</div>
              {user?.email && (
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              )}
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full"
                onClick={handleItemClick}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}