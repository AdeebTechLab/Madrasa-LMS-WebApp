'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PublicHeader from '@/components/PublicHeader';
import { api, saveSession } from '@/lib/api';

const demoAccounts = [
  ['Student', 'student@sakinah.test'],
  ['Teacher', 'teacher@sakinah.test'],
  ['Admin', 'admin@sakinah.test']
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@sakinah.test');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      saveSession(data.token, data.user);
      const rolePath = data.user.role === 'ADMIN' ? '/app/admin' : data.user.role === 'TEACHER' ? '/app/teacher' : '/app/student';
      router.push(rolePath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return <><PublicHeader /><main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-cream px-6 py-12"><div className="islamic-pattern absolute inset-0 opacity-40" /><div className="relative mx-auto grid max-w-6xl items-stretch overflow-hidden rounded-[2rem] border border-emeraldDeep/10 bg-white shadow-soft lg:grid-cols-[0.92fr_1.08fr]">
    <section className="bg-emeraldDeep p-8 text-white sm:p-12"><p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">Sakinah Portal</p><h1 className="mt-4 text-4xl font-black leading-tight">Enter with purpose.<br />Learn with peace.</h1><p className="mt-5 max-w-md leading-7 text-emerald-50">Your personal Quran learning space brings Sabaq, Sabqi, Manzil, teacher feedback, and Juz progress together.</p><div className="mt-10 rounded-3xl bg-white/10 p-6"><p className="arabic-text text-3xl">رَبِّ اشْرَحْ لِي صَدْرِي</p><p className="mt-3 text-sm leading-6 text-emerald-100">“My Lord, expand for me my chest.” Begin every lesson with sincere intention.</p></div><div className="mt-10 grid grid-cols-3 gap-3 text-center text-xs font-bold"><div className="rounded-2xl bg-white/10 p-3">Sabaq</div><div className="rounded-2xl bg-white/10 p-3">Sabqi</div><div className="rounded-2xl bg-white/10 p-3">Manzil</div></div></section>
    <section className="p-8 sm:p-12"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Portal Login</p><h2 className="mt-3 text-3xl font-black text-slate-950">Welcome back.</h2><p className="mt-2 text-sm text-slate-600">Sign in to continue your madrasa journey.</p><form onSubmit={submit} className="mt-7 space-y-4"><div><label className="label">Email</label><input className="input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div><div><label className="label">Password</label><input className="input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div><button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Opening portal…' : 'Login to Portal'}</button></form>{error ? <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p> : null}<div className="mt-7 rounded-3xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Review demo accounts</p><div className="mt-3 flex flex-wrap gap-2">{demoAccounts.map(([role, account]) => <button key={role} type="button" className="rounded-full bg-white px-3 py-2 text-xs font-bold text-emeraldDeep shadow-sm hover:bg-cream" onClick={() => setEmail(account)}>{role}</button>)}</div><p className="mt-3 text-xs text-slate-500">Password for all demo accounts: <strong>password123</strong></p></div></section>
  </div></main></>;
}
