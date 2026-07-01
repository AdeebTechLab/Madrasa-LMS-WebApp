'use client';

import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';
import JuzMap from '@/components/JuzMap';
import { api } from '@/lib/api';
import { sampleJuzProgress } from '@/lib/fallbackData';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [note, setNote] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try { setData(await api('/api/student/dashboard')); }
    catch (error) { setMessage(error.message); setData({ progress: sampleJuzProgress }); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadDashboard(); }, []);
  const assignment = data?.assignment;

  async function submitRecitation() {
    if (!assignment?.id) { setMessage('Your teacher has not assigned a lesson yet.'); return; }
    setMessage('');
    try {
      const result = await api('/api/student/submit-recitation', { method: 'POST', body: JSON.stringify({ assignmentId: assignment.id, note, audioUrl }) });
      setMessage(result.message); setNote(''); setAudioUrl(''); await loadDashboard();
    } catch (error) { setMessage(error.message); }
  }

  const reflection = data?.islamicReflection || { arabic: 'رَبِّ زِدْنِي عِلْمًا', translation: 'My Lord, increase me in knowledge.', reference: 'Quran 20:114', adab: 'Begin each revision session with Bismillah and sincere intention.' };
  const prayers = data?.prayerSchedule || [['Fajr', '05:05'], ['Dhuhr', '12:30'], ['Asr', '16:45'], ['Maghrib', '19:20'], ['Isha', '20:45']];

  return <AppShell title="Student Dashboard" allowedRoles={['STUDENT']}>
    {loading ? <div className="rounded-3xl bg-white p-5 text-sm font-bold text-emeraldDeep shadow-soft">Loading your learning plan…</div> : null}
    <div className="grid gap-5 md:grid-cols-4"><StatCard label="Current Juz" value={data?.student?.currentJuz || '1'} hint="Active memorization" /><StatCard label="Today’s Status" value={assignment?.status || 'Awaiting lesson'} hint="Sabaq workflow" /><StatCard label="Revision Rhythm" value="Daily" hint="Sabqi and Manzil" /><StatCard label="Teacher Score" value={data?.feedback?.[0]?.score ?? '—'} hint="Latest review" /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"><section className="card"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Daily Tasks</p><h2 className="text-2xl font-black text-slate-950">Sabaq, Sabqi, and Manzil</h2></div><span className="rounded-full bg-cream px-4 py-2 text-xs font-bold text-emeraldDeep">Focus Mode</span></div><div className="grid gap-4 md:grid-cols-3">{[['Sabaq', assignment?.sabaqLesson?.title || 'Awaiting teacher assignment'], ['Sabqi', assignment?.sabqiLesson?.title || 'Recent revision will appear here'], ['Manzil', assignment?.manzilLesson?.title || 'Older revision will appear here']].map(([label, title]) => <div className="rounded-3xl border border-slate-200 p-5" key={label}><p className="text-sm font-bold text-gold">{label}</p><p className="mt-2 font-black text-slate-950">{title}</p></div>)}</div><div className="mt-6 rounded-3xl bg-emeraldDeep p-6 text-white"><p className="text-xs font-bold text-emerald-100">{assignment?.sabaqLesson?.reference || 'Quran recitation'}</p><p className="arabic-text mt-2 text-4xl">{assignment?.sabaqLesson?.content || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}</p>{assignment?.teacherNote ? <p className="mt-5 rounded-2xl bg-white/10 p-4 text-sm text-emerald-50"><strong>Teacher note:</strong> {assignment.teacherNote}</p> : null}{assignment?.sabaqLesson?.audioUrl ? <a className="mt-4 inline-flex rounded-xl bg-white/15 px-4 py-2 text-sm font-bold hover:bg-white/25" href={assignment.sabaqLesson.audioUrl} target="_blank" rel="noreferrer">Open recitation audio</a> : null}</div><div className="mt-5 grid gap-4"><div><label className="label">Student practice note</label><textarea className="input min-h-28" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Share where you practised well or where you need help…" /></div><div><label className="label">Optional audio recording link</label><input className="input" value={audioUrl} onChange={(event) => setAudioUrl(event.target.value)} placeholder="https://…" /></div><button onClick={submitRecitation} className="btn-primary w-fit">Submit Recitation</button>{message ? <p className="text-sm font-bold text-emeraldDeep">{message}</p> : null}</div></section>
      <section className="space-y-6"><div className="card"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Daily Reflection</p><p className="arabic-text mt-3 text-3xl text-emeraldDeep">{reflection.arabic}</p><p className="mt-2 font-bold text-slate-800">{reflection.translation}</p><p className="mt-1 text-xs font-bold text-gold">{reflection.reference}</p><p className="mt-4 rounded-2xl bg-cream p-4 text-sm leading-6 text-slate-700"><strong>Adab of learning:</strong> {reflection.adab}</p></div><div className="card"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Madrasa Prayer Schedule</p><div className="mt-4 grid grid-cols-2 gap-3 text-sm">{prayers.map(([name, time]) => <div key={name} className="rounded-2xl bg-slate-50 p-3"><p className="font-bold text-slate-700">{name}</p><p className="mt-1 text-xs text-slate-500">{time}</p></div>)}</div></div><div className="card"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Teacher Feedback</p><div className="mt-4 space-y-3">{(data?.feedback?.length ? data.feedback : [{ textFeedback: 'Your teacher feedback will appear here after a recitation review.', tajweedNotes: 'Keep revising with calm attention.' }]).map((item, index) => <div className="rounded-2xl bg-slate-50 p-4" key={item.id || index}>{item.score !== undefined ? <p className="font-bold text-slate-900">Score: {item.score}</p> : null}<p className="mt-1 text-sm text-slate-600">{item.textFeedback}</p>{item.tajweedNotes ? <p className="mt-2 text-xs font-bold text-gold">{item.tajweedNotes}</p> : null}{item.teacher?.fullName ? <p className="mt-2 text-xs text-slate-500">From {item.teacher.fullName}</p> : null}</div>)}</div></div></section></div>
    <section className="card mt-8"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Juz Progress</p><h2 className="mt-2 text-2xl font-black text-slate-950">Visual completion map</h2><div className="mt-6"><JuzMap progress={data?.progress || sampleJuzProgress} /></div></section>
  </AppShell>;
}
