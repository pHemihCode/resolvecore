'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Google sign-up initiated');
            // router.push('/dashboard');
        } catch (error) {
            console.error('Sign up failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Top branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm mb-4">
                        <div className="text-white font-bold text-xl">RC</div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-600">
                        Get started with our support platform
                    </p>
                </div>

                {/* Authentication card */}
                <Card shadow="lg" className="relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-16 translate-x-16"></div>

                    <div className="relative">
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                Join ResolveCore
                            </h2>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                <p className="text-gray-700 text-sm">
                                    Create an account to start creating and tracking support tickets,
                                    manage your requests, and get timely updates.
                                </p>
                            </div>
                        </div>

                        {/* Google Sign-up Button */}
                        <div className="space-y-4">
                            <GoogleSignInButton
                                text="Create Account with Google"
                                onClick={handleGoogleSignUp}
                                loading={isLoading}
                            />
                        </div>

                        {/* Login link */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <p className="text-center text-gray-600 text-sm">
                                Already have an account?{' '}
                                <Link
                                    href="/sign-in"
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}