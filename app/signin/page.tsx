'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignIn() {
    const router = useRouter();

    useEffect(() => {
        signIn('google', { callbackUrl: '/' });
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Signing in...</h1>
                <p>Please wait while we redirect you to Google for authentication.</p>
            </div>
        </div>
    );
} 