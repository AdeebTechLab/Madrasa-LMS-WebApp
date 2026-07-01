'use client';

import { useState } from 'react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { api } from '@/lib/api';

const initialForm = { studentName: '', parentName: '', email: '', phone: '', courseInterest: 'Noorani Qaida', currentLevel: '', message: '' };

export default function AdmissionPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const update = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  async function submit(event) {
    event.preventDefault(); setStatus(''); setSubmitting(true);
    try { await api('/api/public/admissions', { method: 'POST', body: JSON.stringify(form) }); setStatus('Admission request submitted successfully. Our madrasa team will review it with care.'); setForm(initialForm); }
    catch (error) { setStatus(error.message); }
    finally { setSubmitting(false); }
  }

  return <><PublicHeader /><main className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[0.8fr_1.2fr]"><section><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Admission</p><h1 className="mt-3 text-4xl font-black text-slate-950">Start Quran learning with calm structure.</h1><p className="mt-4 text-lg leading-8 text-slate-600">Submit the form. The madrasa administrator can review your request directly from the LMS.</p><div className="card mt-8 bg-cream"><p className="font-black text-emeraldDeep">What happens next?</p><ul className="mt-4 space-y-3 text-sm text-slate-700"><li>• Admin reviews the admission request</li><li>• Student is assigned to a course and class</li><li>• Teacher begins Sabaq, Sabqi, and Manzil tracking</li></ul></div><div className="mt-6 rounded-3xl bg-emeraldDeep p-6 text-white"><p className="arabic-text text-3xl">يَسِّرْ وَلَا تُعَسِّرْ</p><p className="mt-2 text-sm text-emerald-100">A gentle beginning, a clear learning path, and teacher care throughout.</p></div></section><form onSubmit={submit} className="card grid gap-4"><div className="grid gap-4 md:grid-cols-2"><div><label className="label">Student Name</label><input className="input" value={form.studentName} onChange={(event) => update('studentName', event.target.value)} required /></div><div><label className="label">Parent / Guardian Name</label><input className="input" value={form.parentName} onChange={(event) => update('parentName', event.target.value)} required /></div><div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /></div><div><label className="label">Phone / WhatsApp</label><input className="input" value={form.phone} onChange={(event) => update('phone', event.target.value)} required /></div><div><label className="label">Course</label><select className="input" value={form.courseInterest} onChange={(event) => update('courseInterest', event.target.value)}><option>Noorani Qaida</option><option>Tajweed Essentials</option><option>Complete Hifz Program</option><option>Nazra Quran Reading</option></select></div><div><label className="label">Current Level</label><input className="input" value={form.currentLevel} onChange={(event) => update('currentLevel', event.target.value)} placeholder="For example: can read Qaida" /></div></div><div><label className="label">Message</label><textarea className="input min-h-32" value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us any learning goals or support needed." /></div><button className="btn-primary" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Admission'}</button>{status ? <p className="text-sm font-bold text-emeraldDeep">{status}</p> : null}</form></main><PublicFooter /></>;
}
