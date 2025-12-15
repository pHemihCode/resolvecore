import type { Metadata } from "next";


export const metadata: Metadata = {
    title: {
        default: "ResolveCore – Technical Support Platform",
        template: "%s | ReolveCore",
    },
    description: "AI-powered technical support and ticketing platform",
};

export default function Layout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
       <div className="min-h-screen flex">
      <div className="hidden md:w-1/2 bg-blue-950 text-white text-2xl  md:flex md:justify-center md:items-center">
      </div>

      <main className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
    );
}
