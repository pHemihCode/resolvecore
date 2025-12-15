import Link from 'next/link';
import { FC } from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showAdminLabel?: boolean;
}

const Logo: FC<LogoProps> = ({ size = 'md', showAdminLabel = false }) => {
    const sizeClasses = {
        sm: 'text-xl',
        md: 'text-2xl',
        lg: 'text-3xl',
    };

    return (
        <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold px-3 py-1.5 rounded-lg">
                        RC
                    </div>
                </div>
                <span className={`font-bold ${sizeClasses[size]} text-gray-800`}>
          Resolve<span className="text-blue-600">Core</span>
        </span>
            </div>
            {showAdminLabel && (
                <span className="text-xs text-blue-600 font-medium mt-1 bg-blue-50 px-2 py-0.5 rounded-full">
          Admin Panel
        </span>
            )}
        </Link>
    );
};

export default Logo;