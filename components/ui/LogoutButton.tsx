"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton({
  label = "Log out",
}: {
  label?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut({
        callbackUrl: "/auth/sign-in",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <span className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-red-500 animate-spin" />
      ) : null}
      <span>{isLoading ? "Logging out..." : label}</span>
    </button>
  );
}