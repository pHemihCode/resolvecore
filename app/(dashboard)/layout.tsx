"use client";

import SessionProvider from "@/components/SessionProvider";

export default function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}