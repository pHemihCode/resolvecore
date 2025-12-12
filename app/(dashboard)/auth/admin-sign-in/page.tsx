'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';
import Logo from '@/components/ui/logo';

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleAdminSignIn = async () => {
        setIsLoading(true);
        try {
            // Simulate admin authentication
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Admin Google sign-in initiated');
            // router.push('/admin/dashboard');
        } catch (error) {
            console.error('Admin sign in failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="w-full max-w-md">
                {/* Admin branding */}
                <div className="text-center mb-8">
                    <div className="flex flex-col items-center gap-3">
                        <Logo size="lg" showAdminLabel={true} />
                        <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mt-4">
                        Admin Portal
                    </h1>
                    <p className="text-gray-600 text-sm mt-2">
                        Restricted access to authorized personnel only
                    </p>
                </div>

                {/* Authentication card */}
                <Card shadow="lg" className="relative border-2 border-blue-100">
                    {/* Security badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Secure Access
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="text-center mb-8">
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">
                                Administrator Authentication
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Use your authorized Google account
                            </p>
                        </div>

                        {/* Admin Google Sign-in Button */}
                        <div className="space-y-4">
                            <GoogleSignInButton
                                text="Sign in with Google (Admin Access Only)"
                                onClick={handleAdminSignIn}
                                loading={isLoading}
                            />
                        </div>

                        {/* Security notice */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-gray-700 text-sm">
                                        <span className="font-medium">Note:</span> This portal is restricted to authorized administrators only. Unauthorized access is prohibited.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Back to user login */}
                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                            <a
                                href="/login"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to user login
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}