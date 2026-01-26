"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ShieldAlert, ArrowLeft, RotateCw, Home, MailWarning } from "lucide-react";

// Map NextAuth error codes to user-friendly messages
const ERROR_MAP: Record<string, { title: string; message: string; icon: any }> = {
  Configuration: {
    title: "Server Configuration Error",
    message: "There is a problem with the server configuration. Please contact the site administrator.",
    icon: ShieldAlert,
  },
  AccessDenied: {
    title: "Access Denied",
    message: "You do not have permission to sign in. This account might be restricted.",
    icon: ShieldAlert,
  },
  Verification: {
    title: "Link Expired",
    message: "The sign-in link is no longer valid. It may have been used already or it expired.",
    icon: MailWarning,
  },
  OAuthSignin: {
    title: "Login Failed",
    message: "Error in constructing an authorization URL. Please try again later.",
    icon: ShieldAlert,
  },
  OAuthCallback: {
    title: "Provider Error",
    message: "Could not receive the response from the authentication provider (Google/GitHub).",
    icon: RotateCw,
  },
  OAuthAccountNotLinked: {
    title: "Account Email Exists",
    message: "To confirm your identity, sign in with the same account you used originally (e.g., if you used Google, use Google again).",
    icon: UserExistsIcon,
  },
  Default: {
    title: "Authentication Error",
    message: "An unexpected error occurred while trying to sign you in.",
    icon: ShieldAlert,
  },
};

function UserExistsIcon(props: any) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
}

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  
  // Select the specific error config or fallback to default
  const { title, message, icon: Icon } = ERROR_MAP[error as string] || ERROR_MAP.Default;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Visual Header */}
      <div className="bg-red-50 p-8 flex justify-center border-b border-red-100">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm ring-8 ring-red-50/50">
          <Icon className="w-10 h-10 text-red-500" />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-gray-500 leading-relaxed text-sm">
          {message}
        </p>

        {/* Error Code Tag */}
        {error && (
            <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-medium bg-gray-100 text-gray-500 uppercase tracking-wider">
                    Code: {error}
                </span>
            </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50 border-t border-gray-100 grid gap-3">
        <Link 
          href="/auth/sign-in" 
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
        >
          <RotateCw className="w-4 h-4" />
          Try signing in again
        </Link>
        
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold text-sm transition-all"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      <Suspense fallback={<div className="w-full max-w-md h-96 bg-white rounded-2xl animate-pulse shadow-xl" />}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}