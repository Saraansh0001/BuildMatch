// src/components/StatCard.jsx
export default function StatCard({ icon: Icon, label, value, sub, color = 'indigo', trend }) {
  const colorMap = {
    indigo:  'from-indigo-500 to-violet-600 shadow-indigo-500/20',
    emerald: 'from-emerald-500 to-teal-600 shadow-emerald-500/20',
    rose:    'from-rose-500 to-pink-600 shadow-rose-500/20',
    amber:   'from-amber-500 to-orange-500 shadow-amber-500/20',
  };

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
            {trend >= 0 ? '+' : ''}{trend.toFixed(2)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-[var(--color-muted)]">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-xs text-[var(--color-muted)] mt-1">{sub}</p>}
      </div>
    </div>
  );
}
