'use client';

import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';
import { api } from '@/lib/api';

const blankAssignment = { studentId: '', classRoomId: '', sabaqTitle: '', sabaqReference: '', sabaqContent: '', sabqiTitle: '', manzilTitle: '', teacherNote: '' };
const blankFeedback = { recitationId: '', studentId: '', score: '85', textFeedback: '', tajweedNotes: '', voiceFeedbackUrl: '' };

function idOf(value) { return value?.id || value?._id || value || ''; }

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState(blankAssignment);
  const [feedbackForm, setFeedbackForm] = useState(blankFeedback);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try { setData(await api('/api/teacher/dashboard')); }
    catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadDashboard(); }, []);
  const classes = data?.classes || [];
  const pending = data?.pendingSubmissions || [];
  const students = data?.students || [];
  const selectedClass = useMemo(() => classes.find((item) => idOf(item) === assignmentForm.classRoomId), [classes, assignmentForm.classRoomId]);
  const availableStudents = selectedClass?.students || students;

  function selectSubmission(recitation) {
    setFeedbackForm((previous) => ({ ...previous, recitationId: idOf(recitation), studentId: idOf(recitation.student), textFeedback: previous.textFeedback || `MashaAllah, thank you for submitting your recitation.`, tajweedNotes: previous.tajweedNotes || 'Please revise the stopping points and repeat with a calm pace.' }));
  }

  async function submitAssignment(event) {
    event.preventDefault(); setMessage('');
    try { const result = await api('/api/teacher/assignments', { method: 'POST', body: JSON.stringify(assignmentForm) }); setMessage(result.message); setAssignmentForm(blankAssignment); await loadDashboard(); }
    catch (error) { setMessage(error.message); }
  }

  async function submitFeedback(event) {
    event.preventDefault(); setMessage('');
    try { const result = await api('/api/teacher/feedback', { method: 'POST', body: JSON.stringify(feedbackForm) }); setMessage(result.message); setFeedbackForm(blankFeedback); await loadDashboard(); }
    catch (error) { setMessage(error.message); }
  }

  return <AppShell title="Teacher Dashboard" allowedRoles={['TEACHER']}>
    {loading ? <div className="rounded-3xl bg-white p-5 text-sm font-bold text-emeraldDeep shadow-soft">Loading your teaching portal…</div> : null}
    <div className="grid gap-5 md:grid-cols-4"><StatCard label="My Classes" value={classes.length} hint="Active class groups" /><StatCard label="Pending Reviews" value={pending.length} hint="Recitations waiting" /><StatCard label="Attendance" value={`${data?.attendanceRate || 94}%`} hint="This week" /><StatCard label="Feedback Sent" value={data?.recentFeedback?.length || 0} hint="Recent notes" /></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><section className="card"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Classes</p><h2 className="mt-2 text-2xl font-black text-slate-950">Assigned class groups</h2><div className="mt-5 space-y-4">{classes.length ? classes.map((item) => <div className="rounded-3xl border border-slate-200 p-5" key={idOf(item)}><p className="font-black text-slate-950">{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.course?.title} · {item.scheduleDays}</p><p className="mt-2 text-sm font-bold text-gold">{item.startTime} – {item.endTime}</p><p className="mt-2 text-sm text-slate-600">Students: {item.students?.length || 0}</p><div className="mt-3 flex flex-wrap gap-2">{item.students?.map((student) => <span key={idOf(student)} className="rounded-full bg-cream px-3 py-1 text-xs font-bold text-emeraldDeep">{student.fullName}</span>)}</div></div>) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No classes are assigned yet.</p>}</div></section>
      <section className="card"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Pending Reviews</p><h2 className="mt-2 text-2xl font-black text-slate-950">Recitation submissions</h2><div className="mt-5 overflow-hidden rounded-3xl border border-slate-200"><table className="w-full text-left text-sm"><thead className="bg-cream text-emeraldDeep"><tr><th className="p-4">Student</th><th className="p-4">Lesson</th><th className="p-4">Review</th></tr></thead><tbody>{pending.length ? pending.map((item) => <tr className="border-t border-slate-200" key={idOf(item)}><td className="p-4 font-bold text-slate-900">{item.student?.fullName}</td><td className="p-4 text-slate-600">{item.assignment?.sabaqLesson?.title || 'Daily Sabaq'}</td><td className="p-4"><button className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-gold" onClick={() => selectSubmission(item)}>Review</button></td></tr>) : <tr><td className="p-4 text-slate-500" colSpan="3">No pending recitations. Alhamdulillah.</td></tr>}</tbody></table></div><div className="mt-5 rounded-2xl bg-cream p-4"><p className="arabic-text text-2xl text-emeraldDeep">وَقُولُوا لِلنَّاسِ حُسْنًا</p><p className="mt-1 text-xs text-slate-600">Offer feedback with clarity, encouragement, and respectful correction.</p></div></section></div>
    <section className="card mt-8"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Assignment Planner</p><h2 className="mt-2 text-2xl font-black text-slate-950">Set today’s Sabaq, Sabqi, and Manzil</h2><form onSubmit={submitAssignment} className="mt-5 grid gap-4"><div className="grid gap-4 md:grid-cols-2"><div><label className="label">Class group</label><select className="input" value={assignmentForm.classRoomId} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, classRoomId: event.target.value, studentId: '' }))}><option value="">Choose a class (optional)</option>{classes.map((item) => <option value={idOf(item)} key={idOf(item)}>{item.title}</option>)}</select></div><div><label className="label">Student</label><select className="input" required value={assignmentForm.studentId} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, studentId: event.target.value }))}><option value="">Choose a student</option>{availableStudents.map((student) => <option value={idOf(student)} key={idOf(student)}>{student.fullName}</option>)}</select></div></div><div className="grid gap-4 md:grid-cols-3"><div><label className="label">Sabaq</label><input className="input" required value={assignmentForm.sabaqTitle} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, sabaqTitle: event.target.value }))} placeholder="Surah / ayat" /></div><div><label className="label">Sabqi</label><input className="input" required value={assignmentForm.sabqiTitle} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, sabqiTitle: event.target.value }))} placeholder="Revision lesson" /></div><div><label className="label">Manzil</label><input className="input" required value={assignmentForm.manzilTitle} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, manzilTitle: event.target.value }))} placeholder="Older revision" /></div></div><div className="grid gap-4 md:grid-cols-2"><input className="input" value={assignmentForm.sabaqReference} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, sabaqReference: event.target.value }))} placeholder="Sabaq reference, e.g. 2:1–5" /><textarea className="input min-h-24" value={assignmentForm.sabaqContent} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, sabaqContent: event.target.value }))} placeholder="Arabic Quran text for the focus panel (optional)" /></div><textarea className="input min-h-24" value={assignmentForm.teacherNote} onChange={(event) => setAssignmentForm((previous) => ({ ...previous, teacherNote: event.target.value }))} placeholder="Teacher note: Tajweed focus, repetition target, or encouragement" /><button className="btn-primary w-fit">Create Daily Assignment</button></form></section>
    <section className="card mt-8"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Feedback Tool</p><h2 className="mt-2 text-2xl font-black text-slate-950">Teacher feedback composer</h2><form onSubmit={submitFeedback} className="mt-5 grid gap-4"><div className="grid gap-4 md:grid-cols-3"><div><label className="label">Recitation</label><select className="input" required value={feedbackForm.recitationId} onChange={(event) => { const submission = pending.find((item) => idOf(item) === event.target.value); if (submission) selectSubmission(submission); }}><option value="">Choose pending recitation</option>{pending.map((item) => <option key={idOf(item)} value={idOf(item)}>{item.student?.fullName} · {item.assignment?.sabaqLesson?.title}</option>)}</select></div><div><label className="label">Score / 100</label><input className="input" type="number" min="0" max="100" value={feedbackForm.score} onChange={(event) => setFeedbackForm((previous) => ({ ...previous, score: event.target.value }))} /></div><div><label className="label">Voice feedback URL</label><input className="input" value={feedbackForm.voiceFeedbackUrl} onChange={(event) => setFeedbackForm((previous) => ({ ...previous, voiceFeedbackUrl: event.target.value }))} placeholder="https://…" /></div></div><textarea className="input min-h-28" required value={feedbackForm.textFeedback} onChange={(event) => setFeedbackForm((previous) => ({ ...previous, textFeedback: event.target.value }))} placeholder="Write clear, encouraging feedback…" /><textarea className="input min-h-24" value={feedbackForm.tajweedNotes} onChange={(event) => setFeedbackForm((previous) => ({ ...previous, tajweedNotes: event.target.value }))} placeholder="Tajweed notes: madd, qalqalah, ghunnah, makharij…" /><button className="btn-primary w-fit">Send Feedback</button></form>{message ? <p className="mt-4 text-sm font-bold text-emeraldDeep">{message}</p> : null}</section>
  </AppShell>;
}
