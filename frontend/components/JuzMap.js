export default function JuzMap({ progress = [] }) {
  const items = progress.length ? progress : Array.from({ length: 30 }, (_, index) => ({ juzNumber: index + 1, completionPercentage: 0 }));
  return <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">{items.map((juz) => {
    const complete = juz.completionPercentage >= 100 || juz.masteryStatus === 'MASTERED';
    const active = juz.completionPercentage > 0 && !complete;
    return <div key={juz.juzNumber} className={`rounded-2xl border p-3 text-center ${complete ? 'border-emeraldDeep bg-emeraldDeep text-white' : active ? 'border-gold bg-amber-50 text-gold' : 'border-slate-200 bg-white text-slate-500'}`}><p className="text-xs font-bold">Juz</p><p className="text-lg font-black">{juz.juzNumber}</p><p className="text-[11px]">{juz.completionPercentage}%</p></div>;
  })}</div>;
}
