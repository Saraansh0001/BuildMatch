// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, BarChart3, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getPortfolio } from '../services/api';
import StatCard from '../components/StatCard';
import Skeleton from '../components/Skeleton';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    getPortfolio()
      .then(p => setPortfolio(p.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="card p-5"><Skeleton /></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="card p-6 lg:col-span-2"><Skeleton count={5} /></div>
        <div className="card p-6 lg:col-span-3"><Skeleton count={5} /></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-rose-400 text-sm">{error}</div>
  );

  const breakdown    = portfolio?.breakdown || [];
  const totalVal     = portfolio?.total_value || 0;
  const recent       = portfolio?.recent_activity || [];
  const totalInvested = portfolio?.total_invested || 0;
  const totalSold     = portfolio?.total_sold || 0;
  const pnl           = totalVal - (totalInvested - totalSold);
  const pnlPct        = (totalInvested - totalSold) > 0 ? (pnl / (totalInvested - totalSold)) * 100 : 0;

  const chartData = {
    labels: breakdown.map(b => b.asset_type),
    datasets: [{
      data: breakdown.map(b => parseFloat(b.total_value)),
      backgroundColor: COLORS,
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const chartOptions = {
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmt(ctx.parsed)}` } },
    },
  };

  return (
    <div className="space-y-6">
      {/* 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Wallet}     label="Total Portfolio Value" value={fmt(totalVal)}      color="indigo" />
        <StatCard icon={TrendingUp} label="Net Invested"          value={fmt(totalInvested - totalSold)} color="emerald" />
        <StatCard
          icon={TrendingUp}
          label="P&amp;L"
          value="Coming Soon"
          color="indigo"
        />
        <StatCard
          icon={BarChart3}
          label="P&amp;L %"
          value="Coming Soon"
          color="indigo"
        />
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Doughnut */}
        <div className="card p-6 md:col-span-2 flex flex-col items-center gap-4">
          <h2 className="text-sm font-semibold self-start">Portfolio Breakdown</h2>
          {breakdown.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)] py-12">No holdings yet.</p>
          ) : (
            <>
              <div className="w-44 h-44 relative">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-[var(--color-muted)]">Total</span>
                  <span className="text-sm font-bold">{fmt(totalVal)}</span>
                </div>
              </div>
              <div className="w-full space-y-2">
                {breakdown.map((b, i) => (
                  <div key={b.asset_type} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[var(--color-muted)]">{b.asset_type}</span>
                    </div>
                    <span className="font-semibold">{fmt(b.total_value)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Recent activity */}
        <div className="card p-6 md:col-span-3">
          <h2 className="text-sm font-semibold mb-4">Recent Activity</h2>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--color-muted)] text-sm gap-2">
              <BarChart3 size={28} className="opacity-30" />
              No transactions yet
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-[var(--color-border)] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.transaction_type === 'BUY' ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                      {tx.transaction_type === 'BUY'
                        ? <ArrowUpRight size={14} className="text-emerald-400" />
                        : <ArrowDownRight size={14} className="text-rose-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{tx.symbol}</p>
                      <p className="text-xs text-[var(--color-muted)] truncate">{tx.asset_name}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <p className={`text-sm font-bold ${tx.transaction_type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.transaction_type === 'BUY' ? '+' : '-'}{tx.quantity} units
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
