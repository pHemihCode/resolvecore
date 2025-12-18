"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  // FIX: Explicitly type state as string
  const [loadingMessage, setLoadingMessage] = useState<string>("Checking your account...");
  const [error, setError] = useState<string>("");

  // FIX: Use useRef with the most robust type for setTimeout
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function checkUserAndRedirect() {
      try {
        // Clear any existing timer when the effect runs
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        const session = await getSession();
        if (!session?.user?.email) {
          setError("You are not logged in.");
          timerRef.current = setTimeout(() => router.push("/auth/sign-in"), 2000);
          return;
        }

        setLoadingMessage("Verifying workspace...");

        const res = await fetch("/api/company/check");

        if (!res.ok) {
          throw new Error("Failed to verify your account.");
        }

        const data = await res.json();

        if (data.hasCompany) {
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding/company");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong. Please try again.");
        timerRef.current = setTimeout(() => router.push("/auth/sign-in"), 3000);
      }
    }

    checkUserAndRedirect();

    // CRITICAL: Add a cleanup function to prevent memory leaks
    // This runs when the component is unmounted.
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-transparent p-8 flex flex-col items-center gap-6 max-w-md w-full">
        <Loader2 className="animate-spin h-12 w-12 text-blue-950" />
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <p className="text-gray-700 text-center text-lg">{loadingMessage}</p>
        )}
      </div>
    </div>
  );
}