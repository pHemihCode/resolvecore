// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    // Log the error for debugging
    if (error) {
      console.error('Auth error:', decodeURIComponent(error));
    }
  }, [error]);

  const getErrorMessage = (error: string | null) => {
    if (!error) return 'An unknown error occurred';
    
    const decodedError = decodeURIComponent(error);
    
    if (decodedError.includes('ETIMEOUT')) {
      return 'Connection timeout. Please check your internet connection and try again.';
    }
    
    if (decodedError.includes('mongodb')) {
      return 'Database connection error. Please try again in a few moments.';
    }
    
    switch (decodedError) {
      case 'AccessDenied':
        return 'Access denied. Please check your permissions.';
      case 'OAuthSignin':
        return 'Error signing in with OAuth provider.';
      case 'OAuthCallback':
        return 'Error during OAuth callback.';
      case 'OAuthCreateAccount':
        return 'Error creating account.';
      case 'EmailCreateAccount':
        return 'Error creating account with email.';
      case 'Callback':
        return 'Error during authentication callback.';
      case 'OAuthAccountNotLinked':
        return 'Email already associated with another account.';
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      default:
        return 'Authentication error. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">
            {getErrorMessage(error)}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
            <a
              href="/auth/sign-in"
              className="block w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              Try Sign In Again
            </a>
          </div>
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500">
                Debug Info
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {decodeURIComponent(error)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}