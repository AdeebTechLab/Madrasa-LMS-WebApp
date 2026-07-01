import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import { fallbackCourses } from '@/lib/fallbackData';

export const dynamic = 'force-dynamic';

async function getCourses() {
  try {
    const base = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');
    const response = await fetch(`${base}/api/public/courses`, { cache: 'no-store' });
    if (!response.ok) return fallbackCourses;
    const data = await response.json();
    return data.courses?.length ? data.courses : fallbackCourses;
  } catch { return fallbackCourses; }
}

export default async function CoursesPage() {
  const courses = await getCourses();
  return <><PublicHeader /><main className="mx-auto max-w-7xl px-6 py-16"><div className="mb-10 max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Course Catalog</p><h1 className="mt-3 text-4xl font-black text-slate-950">Choose a Quran learning path.</h1><p className="mt-4 text-lg leading-8 text-slate-600">Each course is built for teacher-led learning, daily practice, and visible progress.</p></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{courses.map((course) => <article key={course.slug} className="card flex flex-col"><div className="mb-5 rounded-3xl bg-gradient-to-br from-emeraldDeep to-emeraldSoft p-5 text-white"><p className="arabic-text text-3xl">القرآن الكريم</p><p className="mt-10 text-sm font-bold text-emerald-100">{course.level}</p></div><h2 className="text-xl font-black text-slate-950">{course.title}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{course.description}</p><p className="mt-5 text-sm font-bold text-gold">Duration: {course.duration}</p>{course.learningPath?.length ? <p className="mt-3 text-xs font-semibold text-slate-500">{course.learningPath.join(' · ')}</p> : null}<Link href="/admission" className="btn-primary mt-6">Apply for this course</Link></article>)}</div></main><PublicFooter /></>;
}
