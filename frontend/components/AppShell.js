'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearSession, getUser } from '@/lib/api';
import { useEffect, useState } from 'react';

const navByRole = {
  STUDENT: [{ href: '/app/student', label: 'My Learning' }, { href: '/courses', label: 'Courses' }],
  TEACHER: [{ href: '/app/teacher', label: 'Teaching Portal' }, { href: '/courses', label: 'Courses' }],
  ADMIN: [{ href: '/app/admin', label: 'Madrasa Overview' }, { href: '/courses', label: 'Course Catalog' }]
};

export default function AppShell({ title, allowedRoles = [], children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedUser = getUser();
    if (!savedUser || (allowedRoles.length && !allowedRoles.includes(savedUser.role))) {
      clearSession();
      router.replace('/login');
      return;
    }
    setUser(savedUser);
    setReady(true);
  }, [allowedRoles, router]);

  function logout() {
    clearSession();
    router.push('/login');
  }

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-cream"><div className="rounded-3xl bg-white px-6 py-5 text-sm font-bold text-emeraldDeep shadow-soft">Opening your serene learning space…</div></div>;
  }

  const nav = navByRole[user?.role] || [];
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-6 lg:block">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emeraldDeep text-lg font-black text-white">س</div>
          <div><p className="font-black text-emeraldDeep">Sakinah LMS</p><p className="text-xs text-slate-500">Serene Madrasa App</p></div>
        </Link>
        <div className="mt-8 rounded-3xl bg-cream p-4"><p className="arabic-text text-center text-xl text-emeraldDeep">بِسْمِ اللَّهِ</p><p className="mt-1 text-center text-xs font-bold text-slate-500">Begin with sincere intention</p></div>
        <nav className="mt-7 space-y-2">
          {nav.map((item) => <Link key={item.href} href={item.href} className={`block rounded-2xl px-4 py-3 text-sm font-bold ${pathname === item.href ? 'bg-emeraldDeep text-white' : 'text-slate-600 hover:bg-cream hover:text-emeraldDeep'}`}>{item.label}</Link>)}
        </nav>
        <button onClick={logout} className="absolute bottom-6 left-6 right-6 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">Logout</button>
      </aside>
      <main className="lg:pl-72">
        <div className="border-b border-slate-200 bg-white px-6 py-5"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">Assalamu Alaikum</p><h1 className="text-2xl font-black text-slate-950">{title}</h1></div><div className="text-right"><p className="text-sm font-bold text-slate-900">{user?.fullName}</p><p className="text-xs text-slate-500">{user?.role?.toLowerCase()}</p></div></div></div>
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
