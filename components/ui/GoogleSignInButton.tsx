"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

interface GoogleButtonProps {
  label?: string;
}

export default function GoogleButton({
  label = "Continue with Google",
}: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);

    await signIn("google", {
      callbackUrl: "/auth/callback",
    });
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 py-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
      ) : (
        <FcGoogle className="text-2xl" />
      )}
      {isLoading ? "Signing in..." : label}
    </button>
  );
}
