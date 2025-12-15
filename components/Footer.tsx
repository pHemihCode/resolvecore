import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} ResolveCore. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/terms"
                            className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}