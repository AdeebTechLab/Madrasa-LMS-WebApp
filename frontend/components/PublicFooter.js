import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="border-t border-emeraldDeep/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div><p className="font-black text-emeraldDeep">Sakinah Quranic LMS</p><p className="mt-2 max-w-md text-sm leading-6 text-slate-600">A calm digital companion for traditional Quran learning, respectful teacher guidance, and consistent revision.</p><p className="ornament mt-5 text-xs font-bold text-gold">✦ ✦ ✦</p></div>
        <div className="md:text-right"><p className="arabic-text text-2xl text-emeraldDeep">وَقُل رَّبِّ زِدْنِي عِلْمًا</p><p className="mt-1 text-xs text-slate-500">“My Lord, increase me in knowledge.” · Quran 20:114</p><div className="mt-4 flex gap-4 text-sm font-bold text-emeraldDeep md:justify-end"><Link href="/courses">Courses</Link><Link href="/admission">Admission</Link><Link href="/login">Portal</Link></div></div>
      </div>
    </footer>
  );
}
