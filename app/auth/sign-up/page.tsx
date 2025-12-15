'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';
import Link from 'next/link';
import { HiOutlineUserAdd } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";

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
        <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 sm:py-12  rounded-md">
              <div className="w-full flex flex-col justify-center items-center shadow bg-white px-5 py-10 rounded-lg">
                <span className="rounded-full h-12 md:h-14 w-12 md:w-14 bg-blue-100 flex flex-col justify-center items-center">
                  <HiOutlineUserAdd className="stroke-blue-500 text-xl md:text-2xl" />
                </span>
                <h1 className="text-xl md:text-2xl mt-3 font-bold py-3 text-blue-950">
                  Create an account
                </h1>
                <p className="text-gray-500 text-center text-[14px] md:text-base">
                  Join ResolveCore to create and track your support tickets efficiently
                </p>
                <div className="w-full py-5">
                          <GoogleSignInButton label="Sign up with Google"/>
                        </div>
                <div className="flex items-center gap-3 w-full">
                  <hr className="flex-1 border-t border-gray-300" />
                  <span className="text-gray-500">Or</span>
                  <hr className="flex-1 border-t border-gray-300" />
                </div>
                <div>
                  <p className="text-blue-950 py-6 text-sm md:text-base">
                    Already have an account?{" "}
                    <Link href={`/auth/sign-in`} className="text-blue-700">
                      Log in
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 md:text-sm text-[12px] text-center">
                    By clicking on CreateAccount with Google, you agree with our{" "}
                    <span className="underline">Terms of service</span> and{" "}
                    <span className="underline">Privacy Policy</span>
                  </p>
                </div>
              </div>
            </div>
    );
}