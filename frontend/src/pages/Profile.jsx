// src/pages/Profile.jsx
import { useEffect, useState, useContext } from 'react';
import { User, Mail, Calendar, TrendingUp, BarChart3, Activity, DollarSign, LogOut } from 'lucide-react';
import { getProfile } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

const fmt     = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

function StatRow({ label, value, sub }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-[var(--color-muted)] mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {sub && <p className="text-xs text-[var(--color-muted)] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Profile() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');
  const { logout }          = useContext(AuthContext);
  const navigate            = useNavigate();

  useEffect(() => {
    getProfile()
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  if (loading) return <div className="space-y-4"><div className="card p-6"><Skeleton /></div><div className="card p-6"><Skeleton count={4} /></div></div>;
  if (error)   return <div className="text-rose-400 text-sm p-4">{error}</div>;

  const { user, stats } = data;
  const netInvested = stats.total_invested - stats.total_sold;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 2-column layout at md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left — user info */}
        <div className="card p-6 flex flex-col gap-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/25 shrink-0">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold truncate">{user.name}</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-semibold">
                <Activity size={10} /> Active Investor
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm border-t border-[var(--color-border)] pt-4">
            {[
              { icon: User,     label: 'Name',    value: user.name },
              { icon: Mail,     label: 'Email',   value: user.email },
              { icon: Calendar, label: 'Joined',  value: fmtDate(user.created_at) },
              { icon: Activity, label: 'User ID', value: `#${user.user_id}` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[var(--color-muted)] shrink-0">
                  <Icon size={13} /> {label}
                </span>
                <span className="font-medium truncate text-right text-xs">{value}</span>
              </div>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-[var(--color-border)] pt-4 mt-auto">
            <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">Account</p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-colors duration-150"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>
        </div>

        {/* Right — stats grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <StatRow
            label="Total Invested"
            value={fmt(stats.total_invested)}
            sub={`${stats.total_transactions} transactions`}
          />
          <StatRow
            label="Total Proceeds (Sold)"
            value={fmt(stats.total_sold)}
          />
          <StatRow
            label="Unique Assets Held"
            value={stats.unique_assets}
          />
          <StatRow
            label="Net Invested"
            value={fmt(netInvested)}
            sub="Invested minus sold"
          />
          <div className="sm:col-span-2 card p-4">
            <p className="text-xs text-[var(--color-muted)] mb-2 font-semibold uppercase tracking-wide">Quick Stats</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="text-[var(--color-muted)]">Avg. transaction size: <span className="font-semibold text-[var(--color-text)]">{stats.total_transactions > 0 ? fmt(stats.total_invested / stats.total_transactions) : '—'}</span></span>
              <span className="text-[var(--color-muted)]">Sell / Buy ratio: <span className="font-semibold text-[var(--color-text)]">{stats.total_invested > 0 ? ((stats.total_sold / stats.total_invested) * 100).toFixed(1) + '%' : '—'}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
