"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  label?: string;
  showLabel?: boolean;
};

export default function LogoutButton({
  label = "Log out",
  showLabel = true,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    if (isLoading) return;

    setIsLoading(true);

    signOut({
      callbackUrl: "/auth/sign-in",
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      aria-busy={isLoading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-blue-900" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}

      {showLabel && (
        <span>{isLoading ? "Signing out..." : label}</span>
      )}
    </button>
  );
}
