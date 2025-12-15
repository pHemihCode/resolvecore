import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";
import Layout from "@/components/Layout";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "ResolveCore – Technical Support Platform",
        template: "%s | ReolveCore",
    },
    description: "AI-powered technical support and ticketing platform",
};

export default function AuthLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
       <div className="min-h-screen flex">
      <div className="hidden md:w-1/2 bg-blue-950 text-white text-2xl  md:flex md:justify-center md:items-center">
        <Layout />
      </div>

      <main className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
    );
}
