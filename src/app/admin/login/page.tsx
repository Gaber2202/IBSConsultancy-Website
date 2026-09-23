import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifySessionToken, authCookie } from '@/lib/auth';
import { LogoMark } from '@/components/Logo';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const token = cookies().get(authCookie.name)?.value;
  if (verifySessionToken(token)) redirect('/admin');

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-5 text-2xl font-bold">IBS Admin</h1>
          <p className="mt-1 text-sm text-ink-500">Sign in to manage your leads</p>
        </div>
        <div className="mt-8 rounded-2xl border border-ink-200 bg-white p-6 shadow-card">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-xs text-ink-400">
          IBS Consultancy — Lead Management
        </p>
      </div>
    </main>
  );
}
