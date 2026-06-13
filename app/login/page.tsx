import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/ui/login-form';

export const metadata = {
  title: 'Sign in — Loyalix Back Office'
};

function LoginFormFallback() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src="/loyalix.png"
              alt="Loyalix"
              width={64}
              height={64}
              className="size-6 object-contain"
            />
            Loyalix Back Office
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
      <div className="hidden flex-col items-center justify-center gap-6 bg-sidebar lg:flex">
        <div className="flex size-24 items-center justify-center rounded-2xl bg-white shadow-lg">
          <Image
            src="/loyalix.png"
            alt=""
            width={64}
            height={64}
            className="size-16 object-contain"
          />
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-sidebar-accent-foreground">
            Loyalix
          </p>
          <p className="text-sm text-sidebar-foreground">
            Loyalty platform administration
          </p>
        </div>
      </div>
    </div>
  );
}
