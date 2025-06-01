import './globals.css';

import { Analytics } from '@vercel/analytics/react';

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
            <body className="flex min-h-screen w-full flex-col">{children}</body>
            <Analytics />
        </html>
    );
}
