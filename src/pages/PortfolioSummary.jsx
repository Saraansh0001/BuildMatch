import React from 'react';

export default function PortfolioSummary() {
  // Portfolio data
  const portfolioStats = {
    totalInvested: 145000,
    currentValue: 151000,
    totalProfit: 6000,
    profitPercent: 4.14,
  };

  const investmentBreakdown = [
    { type: 'Mutual Funds', amount: 90000, percentage: 62, color: 'from-blue-500 to-blue-600' },
    { type: 'Stocks', amount: 55000, percentage: 38, color: 'from-emerald-500 to-emerald-600' },
  ];

  const performanceData = [
    { category: 'Strong', investments: ['HDFC Equity Fund', 'TCS'], count: 2 },
    { category: 'Good', investments: ['Reliance Industries'], count: 1 },
    { category: 'Average', investments: ['SBI Blue Chip Fund'], count: 1 },
  ];

  const riskProfile = [
    { level: 'High Risk', percentage: 38, investments: 2, color: 'bg-red-100 text-red-700' },
    { level: 'Medium Risk', percentage: 62, investments: 2, color: 'bg-yellow-100 text-yellow-700' },
    { level: 'Low Risk', percentage: 0, investments: 0, color: 'bg-emerald-100 text-emerald-700' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-2">Portfolio Summary</h1>
        <p className="text-slate-600">Get insights into your investment portfolio</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-medium mb-2 opacity-90">Total Invested</p>
          <p className="text-3xl font-bold">₹{portfolioStats.totalInvested.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-medium mb-2 opacity-90">Current Value</p>
          <p className="text-3xl font-bold">₹{portfolioStats.currentValue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-medium mb-2 opacity-90">Total Profit</p>
          <p className="text-3xl font-bold">₹{portfolioStats.totalProfit.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <p className="text-sm font-medium mb-2 opacity-90">Profit %</p>
          <p className="text-3xl font-bold">↑ {portfolioStats.profitPercent}%</p>
        </div>
      </div>

      {/* Investment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Breakdown Chart */}
        <div className="bg-white rounded-2xl border border-borderline p-6 shadow-sm">
          <h2 className="text-lg font-bold text-secondary mb-6">Investment Breakdown</h2>
          <div className="space-y-4">
            {investmentBreakdown.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-slate-700">{item.type}</p>
                  <p className="font-bold text-primary">₹{item.amount.toLocaleString()} ({item.percentage}%)</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Categories */}
        <div className="bg-white rounded-2xl border border-borderline p-6 shadow-sm">
          <h2 className="text-lg font-bold text-secondary mb-6">Performance Categories</h2>
          <div className="space-y-4">
            {performanceData.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-borderline">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  item.category === 'Strong' ? 'bg-emerald-100 text-emerald-700' :
                  item.category === 'Good' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.category}
                </div>
                <div>
                  <p className="font-semibold text-slate-700">{item.count} Investment{item.count !== 1 ? 's' : ''}</p>
                  <p className="text-sm text-slate-600">{item.investments.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Profile */}
      <div className="bg-white rounded-2xl border border-borderline p-6 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-secondary mb-6">Portfolio Risk Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {riskProfile.map((risk, idx) => (
            <div key={idx} className={`p-4 rounded-lg border border-borderline ${risk.color}`}>
              <p className="font-semibold mb-2">{risk.level}</p>
              <p className="text-2xl font-bold mb-1">{risk.percentage}%</p>
              <p className="text-xs">{risk.investments} investment{risk.investments !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6">
        <h2 className="text-lg font-bold text-secondary mb-4">💡 Recommendations</h2>
        <ul className="space-y-3 text-slate-700">
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Your portfolio is performing well with a 4.14% profit. Consider maintaining this balance.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>The 62-38% split between mutual funds and stocks is a good diversification strategy.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Review your high-risk investments regularly to ensure they align with your goals.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary font-bold">✓</span>
            <span>Consider rebalancing your portfolio quarterly for optimal performance.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
