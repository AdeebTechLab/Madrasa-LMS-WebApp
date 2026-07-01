import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-cream px-6 text-center">
      <div>
        <p className="text-7xl font-black text-emeraldDeep">404</p>
        <h1 className="mt-4 text-3xl font-black text-slate-950">Page not found</h1>
        <Link href="/" className="btn-primary mt-6">Back Home</Link>
      </div>
    </main>
  );
}
