"use client";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
interface GoogleButtonProps {
  label?: string;
  adminOnly?: boolean;
}

export default function GoogleButton({ label = "Sign in with Google", adminOnly = false }: GoogleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine the redirection URL based on the adminOnly prop
  const callbackUrl = adminOnly ? "/admin" : "/dashboard";

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", {
        callbackUrl: callbackUrl,
      });
    } catch (error) {
      console.error("Sign-in failed:", error);
    } finally {
      // Note: In a successful signIn flow, the component unmounts/reloads 
      // before this line is hit, but we keep it for safety/error handling.
      setIsLoading(false);
    }
  };

  return (
   <button
  onClick={handleSignIn}
  disabled={isLoading}
  className="w-full flex items-center gap-3 justify-center py-3 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
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