"use client";

import { useSession } from "next-auth/react";
import Avatar from "@/assets/avatar.png"
import Image from "next/image";
export default function Topbar() {
  const { data } = useSession();

  return (
    <header className="h-16 border-gray-300 shadow bg-white flex items-center justify-between px-6">
      <p className="text-sm text-gray-600">
        Welcome, {data?.user?.name}
      </p>

      <Image
        src={data?.user?.image || Avatar}
        alt="avatar"
        className="h-8 w-8 rounded-full"
        width={32}
        height={32}
      />
    </header>
  );
}
