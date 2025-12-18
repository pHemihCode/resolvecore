"use client";

import GoogleSignInButton from "@/components/ui/GoogleSignInButton";
import Image from "next/image";
import LogoFull from "@/assets/Light-Mode-small.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-md border border-gray-200 px-6 py-10">
        <div className="flex justify-center mb-6">
          <Image src={LogoFull} alt="ResolveCore Logo" width={150} height={60} />
        </div>
        <div className="text-center space-y-2 my-5 mb-8">
         <p className="text-gray-500 text-center text-[14px] md:text-base">
          Access ResolveCore portal
        </p>
        </div>
        <div className="w-full">
          <GoogleSignInButton label="Continue with Google" />
        </div>
        <div className="my-6 flex items-center gap-3">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">Secure sign-in</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Footer / Trust */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}