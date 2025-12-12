'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In real implementation, this would call your auth provider
            console.log('Google sign-in initiated');
            // router.push('/dashboard');
        } catch (error) {
            console.error('Sign in failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Top branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-2 bg-white rounded-lg shadow-sm mb-4">
                        <div className="text-blue-600 font-bold text-xl">RC</div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        Sign in to access your support tickets
                    </p>
                </div>

                {/* Authentication card */}
                <Card shadow="lg" className="relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-400 rounded-l-xl"></div>

                    <div className="pl-6">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Sign in to ResolveCore
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Use your Google account to continue
                            </p>
                        </div>

                        {/* Google Sign-in Button */}
                        <div className="space-y-4">
                            <GoogleSignInButton
                                text="Continue with Google"
                                onClick={handleGoogleSignIn}
                                loading={isLoading}
                            />

                            <p className="text-center text-gray-500 text-sm mt-4">
                                Secure login powered by Google OAuth
                            </p>
                        </div>

                        {/* Links */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-gray-600 text-sm">
                                Don&apos;t have an account?{' '}
                                <Link
                                    href="/sign-up"
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Mobile-optimized layout */}
                <div className="mt-8 block sm:hidden">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center gap-4">
                            <Link
                                href="/terms"
                                className="text-gray-600 hover:text-blue-600 text-sm"
                            >
                                Terms
                            </Link>
                            <span className="text-gray-300">•</span>
                            <Link
                                href="/privacy"
                                className="text-gray-600 hover:text-blue-600 text-sm"
                            >
                                Privacy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}