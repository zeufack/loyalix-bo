import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { Poppins, Crimson_Text, Fira_Code } from 'next/font/google';
import { QueryProvider } from './providers';
import { Toaster } from 'sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap'
});

const crimsonText = Crimson_Text({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap'
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap'
});

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
      <body
        className={`${poppins.variable} ${crimsonText.variable} ${firaCode.variable} flex min-h-screen w-full flex-col font-sans antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
      <Analytics />
    </html>
  );
}
