import React from 'react';

// Stat Card Component
const StatCard = ({ label, value, change, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    mint: 'from-teal-500 to-teal-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <article className="bg-white rounded-2xl p-6 border border-borderline shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-secondary mb-1">{value}</p>
          {change && <p className="text-sm text-emerald-600 font-semibold">{change}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white shadow-lg`}>
          <Icon />
        </div>
      </div>
    </article>
  );
};

// Investment Table Component
const InvestmentTable = ({ investments }) => (
  <div className="bg-white rounded-2xl border border-borderline overflow-hidden shadow-sm">
    <div className="p-6 border-b border-borderline">
      <h3 className="text-lg font-bold text-secondary">Recent Investments</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-borderline">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Investment Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Current Value</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Profit/Loss</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-borderline">
          {investments.map((inv, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-secondary">{inv.name}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${inv.typeBg}`}>
                  {inv.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-slate-700">₹{inv.amount.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm text-slate-700">₹{inv.currentValue.toLocaleString()}</td>
              <td className="px-6 py-4 text-sm font-semibold text-emerald-600">+₹{inv.profit.toLocaleString()} ({inv.profitPercent}%)</td>
              <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function Dashboard() {
  // Icons for stats
  const WalletIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <rect x="3" y="6" width="18" height="12" rx="2"></rect>
      <path d="M3 10h18"></path>
    </svg>
  );

  const TrendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M18 6h-5"></path>
      <path d="M18 6v5"></path>
      <path d="M18 6L7 17"></path>
    </svg>
  );

  const ProfitIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M12 1v22"></path>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"></path>
    </svg>
  );

  const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path d="M3 12h4l2-8 4 16 2-8h6"></path>
    </svg>
  );

  const stats = [
    { label: 'Total Investment', value: '₹145,000', change: null, icon: WalletIcon, color: 'blue' },
    { label: 'Current Value', value: '₹151,000', change: null, icon: TrendIcon, color: 'green' },
    { label: 'Profit/Loss', value: '₹6,000', change: '↑ 4.14%', icon: ProfitIcon, color: 'mint' },
    { label: 'Total Investments', value: '4', change: null, icon: ChartIcon, color: 'purple' },
  ];

  const investments = [
    { name: 'HDFC Equity Fund', type: 'Mutual Fund', typeBg: 'bg-blue-100 text-blue-700', amount: 50000, currentValue: 52500, profit: 2500, profitPercent: 5.0, date: '2/28/2026' },
    { name: 'Reliance Industries', type: 'Stock', typeBg: 'bg-emerald-100 text-emerald-700', amount: 30000, currentValue: 31200, profit: 1200, profitPercent: 4.0, date: '2/25/2026' },
    { name: 'SBI Blue Chip Fund', type: 'Mutual Fund', typeBg: 'bg-blue-100 text-blue-700', amount: 40000, currentValue: 41500, profit: 1500, profitPercent: 3.75, date: '2/20/2026' },
    { name: 'TCS', type: 'Stock', typeBg: 'bg-emerald-100 text-emerald-700', amount: 25000, currentValue: 26800, profit: 1800, profitPercent: 7.2, date: '2/15/2026' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's an overview of your portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Recent Investments Table */}
      <InvestmentTable investments={investments} />
    </div>
  );
}
