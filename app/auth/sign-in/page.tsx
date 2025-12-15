"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 sm:py-12  rounded-md">
      <div className="w-full flex flex-col justify-center items-center shadow bg-white px-5 py-5 rounded-lg">
        <h1 className="text-xl md:text-2xl mt-3 font-bold py-3 text-blue-950">
          Welcome back!
        </h1>
        <p className="text-gray-500 text-center text-[14px] md:text-base">
          Access ResolveCore portal
        </p>
        <div className="w-full py-5">
          <GoogleSignInButton label="Sign in with Google"/>
        </div>
        <div className="flex items-center gap-3 w-full">
          <hr className="flex-1 border-t border-gray-300" />
          <span className="text-gray-500">Or</span>
          <hr className="flex-1 border-t border-gray-300" />
        </div>
        <div>
          <p className="text-blue-950 py-6 text-sm md:text-base">
            Don't have an account?{" "}
            <Link href={`/auth/sign-up`} className="text-blue-700">
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
