'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';
import { api } from '@/lib/api';

const statuses = ['PENDING', 'CONTACTED', 'APPROVED', 'DECLINED'];
const statusClass = { PENDING: 'bg-amber-50 text-gold', CONTACTED: 'bg-sky-50 text-sky-700', APPROVED: 'bg-emerald-50 text-emerald-700', DECLINED: 'bg-red-50 text-red-600' };

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  async function loadDashboard() { try { setData(await api('/api/admin/dashboard')); } catch (error) { setMessage(error.message); } finally { setLoading(false); } }
  useEffect(() => { loadDashboard(); }, []);
  const stats = data?.stats || { students: 0, teachers: 0, activeCourses: 0, pendingAdmissions: 0 };
  const admissions = data?.admissions || [];

  async function updateAdmission(id, status) {
    setMessage('');
    try { const result = await api(`/api/admin/admissions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setMessage(result.message); await loadDashboard(); }
    catch (error) { setMessage(error.message); }
  }

  return <AppShell title="Admin Dashboard" allowedRoles={['ADMIN']}>
    {loading ? <div className="rounded-3xl bg-white p-5 text-sm font-bold text-emeraldDeep shadow-soft">Loading madrasa overview…</div> : null}
    <div className="grid gap-5 md:grid-cols-4"><StatCard label="Students" value={stats.students} hint="Enrolled learners" /><StatCard label="Teachers" value={stats.teachers} hint="Active instructors" /><StatCard label="Courses" value={stats.activeCourses} hint="Published programs" /><StatCard label="Admissions" value={stats.pendingAdmissions} hint="Pending review" /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><section className="card"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Admissions</p><h2 className="mt-2 text-2xl font-black text-slate-950">Recent admission requests</h2><div className="mt-5 overflow-x-auto rounded-3xl border border-slate-200"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-cream text-emeraldDeep"><tr><th className="p-4">Student</th><th className="p-4">Parent</th><th className="p-4">Course</th><th className="p-4">Status</th></tr></thead><tbody>{admissions.length ? admissions.map((item) => <tr className="border-t border-slate-200" key={item.id}><td className="p-4"><p className="font-bold text-slate-900">{item.studentName}</p><p className="text-xs text-slate-500">{item.email}</p></td><td className="p-4 text-slate-600">{item.parentName}</td><td className="p-4 text-slate-600">{item.courseInterest}</td><td className="p-4"><select className={`rounded-full border-0 px-3 py-2 text-xs font-bold ${statusClass[item.status] || statusClass.PENDING}`} value={item.status} onChange={(event) => updateAdmission(item.id, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>) : <tr><td colSpan="4" className="p-5 text-slate-500">No admissions submitted yet.</td></tr>}</tbody></table></div></section>
      <section className="space-y-6"><div className="card"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Madrasa Management</p><h2 className="mt-2 text-2xl font-black text-slate-950">A clear operational overview</h2><div className="mt-5 space-y-3">{['Review admission requests', 'Create student and teacher accounts', 'Assign teachers to class groups', 'Publish Quran learning courses', 'Review progress and feedback'].map((item) => <div key={item} className="rounded-2xl border border-slate-200 p-4 font-bold text-slate-700">{item}</div>)}</div></div><div className="rounded-3xl bg-emeraldDeep p-6 text-white"><p className="arabic-text text-3xl">وَشَاوِرْهُمْ فِي الْأَمْرِ</p><p className="mt-3 text-sm leading-6 text-emerald-100">Keep student growth, teacher insight, and family communication at the centre of madrasa administration.</p></div></section></div>
    <section className="card mt-8"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Class Snapshot</p><h2 className="mt-2 text-2xl font-black text-slate-950">Active learning circles</h2><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data?.classes?.length ? data.classes.map((item) => <div className="rounded-3xl border border-slate-200 p-5" key={item.id}><p className="font-black text-slate-950">{item.title}</p><p className="mt-2 text-sm text-slate-600">{item.course?.title || 'Quran course'}</p><p className="mt-2 text-sm font-bold text-gold">Teacher: {item.teacher?.fullName || 'Unassigned'}</p><p className="mt-1 text-xs text-slate-500">{item.scheduleDays} · {item.startTime}–{item.endTime}</p></div>) : <p className="text-sm text-slate-600">No active classes yet.</p>}</div>{message ? <p className="mt-5 text-sm font-bold text-emeraldDeep">{message}</p> : null}</section>
  </AppShell>;
}
