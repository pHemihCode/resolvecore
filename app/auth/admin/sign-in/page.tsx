'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import GoogleSignInButton from '@/components/ui/GoogleSignInButton';
import Logo from '@/components/ui/logo';
import { FcGoogle } from "react-icons/fc";
import { CiLock } from "react-icons/ci";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { BsShieldLock } from "react-icons/bs";
import Link from 'next/link'
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
         <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 sm:py-12  rounded-md">
                      <div className="w-full flex flex-col justify-center items-center shadow bg-white px-5 py-10 rounded-lg">
                        <span className="rounded-full h-12 md:h-14 w-12 md:w-14 bg-blue-100 flex flex-col justify-center items-center">
                          <BsShieldLock className="text-blue-500 text-xl md:text-2xl" />
                        </span>
                        <h1 className="text-xl md:text-2xl mt-3 font-bold py-3 text-blue-950">
                          Login as Admin
                        </h1>
                        <p className="text-gray-500 text-center text-[14px] md:text-base">
                          Secure access for system administrators. <br />Please verify your identy to continue
                        </p>
                       <div className="w-full py-5">
                          <GoogleSignInButton adminOnly={true} label="Sign in with Google"/>
                        </div>
                        <div className='flex flex-row items-center gap-1 text-gray-400 md:text-[12px] text-[10px] text-center'>
                            <span className=""><MdOutlineAdminPanelSettings className='text-lg'/></span>
                            <span className="">Admin access only</span>
                        </div>
                      </div>
                    </div>
    );
}