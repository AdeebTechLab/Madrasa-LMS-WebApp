import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

const features = [
  ['Sabaq Tracking', 'Daily new lesson assignment with teacher notes.', '۞'],
  ['Sabqi Revision', 'Recent revision to keep memorization firm.', '◌'],
  ['Manzil Planner', 'Older revision path with a visual Juz map.', '✦'],
  ['Teacher Feedback', 'Text and voice feedback for steady growth.', '✎']
];

export default function HomePage() {
  return <><PublicHeader /><main>
    <section className="relative overflow-hidden bg-cream"><div className="islamic-pattern absolute inset-0 opacity-40" /><div className="absolute right-[-10rem] top-[-10rem] h-96 w-96 rounded-full bg-emeraldDeep/10" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 lg:grid-cols-2"><div><p className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-emeraldDeep shadow-sm">AI-enhanced Quran Madrasa LMS</p><h1 className="text-5xl font-black leading-tight text-slate-950 md:text-6xl">A serene digital space for Quran learning.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Sakinah LMS helps madrasas manage Qaida, Tajweed, Nazra, and Hifz with calm dashboards, teacher feedback, attendance, and Juz progress tracking.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/admission" className="btn-primary">Apply for Admission</Link><Link href="/login" className="btn-secondary">Login to Portal</Link></div><div className="mt-8 flex items-center gap-3 text-sm"><span className="arabic-text text-2xl text-emeraldDeep">رَبِّ زِدْنِي عِلْمًا</span><span className="font-semibold text-slate-500">Learning with intention</span></div></div>
        <div className="card relative bg-white/85"><div className="rounded-3xl bg-emeraldDeep p-7 text-white"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-emerald-100">Today’s Lesson</p><p className="arabic-text mt-5 text-4xl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">Hifz Circle</span></div><div className="mt-6 grid gap-3 sm:grid-cols-3">{['Sabaq', 'Sabqi', 'Manzil'].map((item) => <div key={item} className="rounded-2xl bg-white/10 p-4"><p className="text-xs text-emerald-100">Task</p><p className="font-black">{item}</p></div>)}</div></div><div className="mt-5 grid grid-cols-3 gap-3">{['Juz 1', 'Adab', 'Dua'].map((item, index) => <div key={item} className="rounded-2xl bg-slate-100 p-4"><p className="text-xs font-bold text-slate-500">{index === 0 ? 'Progress' : 'Daily practice'}</p><p className="mt-1 font-black text-emeraldDeep">{item}</p></div>)}</div></div></div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16"><div className="mb-8 max-w-2xl"><p className="text-sm font-black uppercase tracking-[0.2em] text-gold">Core LMS Features</p><h2 className="mt-3 text-3xl font-black text-slate-950">Built around traditional Quran learning flow.</h2></div><div className="grid gap-5 md:grid-cols-4">{features.map(([title, text, mark]) => <div className="card" key={title}><div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emeraldDeep/10 text-lg font-black text-emeraldDeep">{mark}</div><h3 className="text-lg font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></section>
    <section className="bg-emeraldDeep"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 lg:grid-cols-[1fr_1fr]"><div className="text-white"><p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-100">A respectful digital madrasa</p><h2 className="mt-3 text-3xl font-black">Teacher guidance remains at the heart of every lesson.</h2></div><div className="rounded-3xl bg-white/10 p-6 text-emerald-50"><p className="arabic-text text-3xl">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</p><p className="mt-3 text-sm leading-6 text-emerald-100">A structured space for sincere study, revision, and knowledgeable teacher feedback.</p></div></div></section>
  </main><PublicFooter /></>;
}
