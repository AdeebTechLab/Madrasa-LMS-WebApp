import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-emeraldDeep/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emeraldDeep text-lg font-black text-white">س</div>
          <div><p className="text-lg font-black text-emeraldDeep">Sakinah LMS</p><p className="text-xs text-slate-500">Quran Madrasa Learning Portal</p></div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/courses" className="hover:text-emeraldDeep">Courses</Link>
          <Link href="/admission" className="hover:text-emeraldDeep">Admission</Link>
          <Link href="/login" className="hover:text-emeraldDeep">Login</Link>
        </nav>
        <Link href="/admission" className="btn-primary hidden sm:inline-flex">Apply Now</Link>
      </div>
    </header>
  );
}
