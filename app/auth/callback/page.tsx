"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState("Checking your account...");
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkSession() {
      try {
        // Step 1: Get user session
        const session = await getSession();
        if (!session?.user?.email) {
          setError("You are not logged in.");
          setTimeout(() => router.push("/auth/sign-in"), 2000);
          return;
        }

        setLoadingMessage("Verifying workspace...");

        // Step 2: Check if company exists
        const res = await fetch("/api/company/check");
        if (!res.ok) throw new Error("Failed to check company");

        const data = await res.json();

        // Step 3: Redirect accordingly
        if (data.hasCompany) {
          router.push("/dashboard");
        } else {
          router.push("/onboarding/company");
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    }

    checkSession();
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
