import React, { useState } from 'react';

export default function InvestmentHistory() {
  const [filter, setFilter] = useState('all');

  const allInvestments = [
    { id: 1, name: 'HDFC Equity Fund', type: 'Mutual Fund', amount: 50000, currentValue: 52500, profit: 2500, profitPercent: 5.0, date: '2/28/2026', status: 'Active' },
    { id: 2, name: 'Reliance Industries', type: 'Stock', amount: 30000, currentValue: 31200, profit: 1200, profitPercent: 4.0, date: '2/25/2026', status: 'Active' },
    { id: 3, name: 'SBI Blue Chip Fund', type: 'Mutual Fund', amount: 40000, currentValue: 41500, profit: 1500, profitPercent: 3.75, date: '2/20/2026', status: 'Active' },
    { id: 4, name: 'TCS', type: 'Stock', amount: 25000, currentValue: 26800, profit: 1800, profitPercent: 7.2, date: '2/15/2026', status: 'Active' },
    { id: 5, name: 'Old Mutual Fund', type: 'Mutual Fund', amount: 20000, currentValue: 19500, profit: -500, profitPercent: -2.5, date: '1/10/2026', status: 'Closed' },
  ];

  const filteredInvestments = filter === 'all' ? allInvestments : allInvestments.filter(inv => inv.status.toLowerCase() === filter);

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'Stock':
        return 'bg-emerald-100 text-emerald-700';
      case 'Mutual Fund':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadgeColor = (status) => {
    return status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700';
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      console.log('Deleted investment:', id);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-2">Investment History</h1>
        <p className="text-slate-600">View and manage all your investments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'active', 'closed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              filter === tab
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Investments Table */}
      <div className="bg-white rounded-2xl border border-borderline shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-borderline">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Investment Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Profit/Loss</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline">
              {filteredInvestments.length > 0 ? (
                filteredInvestments.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-secondary">{inv.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(inv.type)}`}>
                        {inv.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">₹{inv.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">₹{inv.currentValue.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      <span className={inv.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {inv.profit >= 0 ? '+' : '-'}₹{Math.abs(inv.profit).toLocaleString()} ({inv.profitPercent}%)
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{inv.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => console.log('Edit:', inv.id)}
                          className="px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    <p>No investments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-borderline p-6">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Investments</p>
          <p className="text-3xl font-bold text-secondary">{filteredInvestments.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-borderline p-6">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Invested</p>
          <p className="text-3xl font-bold text-secondary">
            ₹{filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-borderline p-6">
          <p className="text-slate-600 text-sm font-medium mb-1">Total Profit/Loss</p>
          <p className={`text-3xl font-bold ${filteredInvestments.reduce((sum, inv) => sum + inv.profit, 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            ₹{filteredInvestments.reduce((sum, inv) => sum + inv.profit, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
