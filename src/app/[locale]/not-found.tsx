import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 pt-24">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-gold-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-2 text-ink-500">The page you’re looking for doesn’t exist or has moved.</p>
        <Link href="/en" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </section>
  );
}
