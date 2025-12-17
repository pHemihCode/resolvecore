"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RequireCompany({
  hasCompany,
  children,
}: {
  hasCompany: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!hasCompany) {
      router.replace("/onboarding/company");
    }
  }, [hasCompany, router]);

  if (!hasCompany) return null;

  return <>{children}</>;
}
