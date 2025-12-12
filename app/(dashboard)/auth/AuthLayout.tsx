import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../globals.css';
import Layout from '@/components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ResolveCore - Secure Authentication',
    description: 'Modern ticketing system with Google authentication',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
            <Layout />
            <main className="flex-1">{children}</main>
        </div>
        </body>
        </html>
    );
}