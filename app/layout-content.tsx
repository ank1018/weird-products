'use client';

import { Toaster } from "react-hot-toast";
import { Providers } from './providers';

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
        </Providers>
    );
} 