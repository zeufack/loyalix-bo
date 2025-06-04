import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { QueryProvider } from './providers';

export const metadata = {
    title: 'Loyalix Back Office',
    description: 'Admin dashboard.'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="flex min-h-screen w-full flex-col">
                <QueryProvider> {children}</QueryProvider>
            </body>
            <Analytics />
        </html>
    );
}
