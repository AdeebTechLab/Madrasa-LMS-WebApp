export default function StatCard({ label, value, hint }) {
  return <div className="card p-5"><p className="text-sm font-bold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-emeraldDeep">{value}</p><p className="mt-2 text-xs font-semibold text-gold">{hint}</p></div>;
}
