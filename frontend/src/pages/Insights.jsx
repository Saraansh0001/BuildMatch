// src/pages/Insights.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Skeleton from '../components/Skeleton';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/get_insights.php')
      .then(r => setData(r.data))
      .catch(e => setError('Failed to load insights.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Insights</h1>
          <p className="text-[var(--color-muted)] mt-1">Advanced query analytics</p>
        </div>
        <div className="card p-6"><Skeleton count={5} /></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-rose-400 p-6 text-center">{error}</div>;
  }

  const { sector = [], most_traded = [], pl_breakdown = [], monthly = [], not_held = [], mf_breakdown = [] } = data;

  const renderTable = (headers, rows, renderRow) => (
    <div className="card overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-surface)]">
            <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
              {headers.map((h, i) => (
                <th key={i} className={`px-4 py-3.5 font-semibold text-left`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="py-8 text-center text-[var(--color-muted)] text-sm">
                  No data
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i} className="table-row border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)]/50 transition-colors">
                  {renderRow(row)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">Insights</h1>
        <p className="text-[var(--color-muted)] mt-1">Advanced query analytics</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] ml-1">Sector Breakdown</h2>
        {renderTable(
          ['Sector', 'Stocks Held', 'Portfolio Value (₹)'],
          sector,
          (row) => (
            <>
              <td className="px-4 py-3.5">{row.sector || 'Unknown'}</td>
              <td className="px-4 py-3.5 font-mono">{row.stocks_held}</td>
              <td className="px-4 py-3.5 font-mono font-semibold">{fmt(row.sector_value)}</td>
            </>
          )
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] ml-1">Most Traded Stocks</h2>
        {renderTable(
          ['Symbol', 'Name', 'Transactions', 'Total Qty Traded'],
          most_traded,
          (row) => (
            <>
              <td className="px-4 py-3.5 font-semibold">{row.symbol}</td>
              <td className="px-4 py-3.5">{row.stock_name}</td>
              <td className="px-4 py-3.5 font-mono">{row.txn_count}</td>
              <td className="px-4 py-3.5 font-mono">{Number(row.total_qty_traded).toLocaleString()}</td>
            </>
          )
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] ml-1">Stock P&L Breakdown</h2>
        {renderTable(
          ['Symbol', 'Name', 'Qty', 'Avg Price', 'Current Price', 'Invested (₹)', 'Current Value (₹)', 'Unrealised P&L (₹)'],
          pl_breakdown,
          (row) => {
            const pl = Number(row.unrealized_pl);
            const plColor = pl > 0 ? 'text-emerald-400' : pl < 0 ? 'text-rose-400' : 'text-[var(--color-text)]';
            return (
              <>
                <td className="px-4 py-3.5 font-semibold">{row.symbol}</td>
                <td className="px-4 py-3.5 truncate max-w-[150px]">{row.stock_name}</td>
                <td className="px-4 py-3.5 font-mono">{Number(row.quantity).toLocaleString()}</td>
                <td className="px-4 py-3.5 font-mono">{fmt(row.average_price)}</td>
                <td className="px-4 py-3.5 font-mono">{fmt(row.current_price)}</td>
                <td className="px-4 py-3.5 font-mono">{fmt(row.invested)}</td>
                <td className="px-4 py-3.5 font-mono font-semibold">{fmt(row.current_value)}</td>
                <td className={`px-4 py-3.5 font-mono font-bold ${plColor}`}>
                  {pl > 0 ? '+' : ''}{fmt(pl)}
                </td>
              </>
            );
          }
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] ml-1">Monthly Investment</h2>
        {renderTable(
          ['Month', 'No. of Buys', 'Total Invested (₹)'],
          monthly,
          (row) => (
            <>
              <td className="px-4 py-3.5">{row.month}</td>
              <td className="px-4 py-3.5 font-mono">{row.num_buys}</td>
              <td className="px-4 py-3.5 font-mono">{fmt(row.total_invested)}</td>
            </>
          )
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] ml-1">Stocks Not in Portfolio</h2>
        {renderTable(
          ['Symbol', 'Name', 'Sector', 'Current Price (₹)'],
          not_held,
          (row) => (
            <>
              <td className="px-4 py-3.5 font-semibold">{row.symbol}</td>
              <td className="px-4 py-3.5">{row.stock_name}</td>
              <td className="px-4 py-3.5">{row.sector || 'Unknown'}</td>
              <td className="px-4 py-3.5 font-mono">{fmt(row.current_price)}</td>
            </>
          )
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] ml-1">Mutual Fund Breakdown</h2>
        {renderTable(
          ['Symbol', 'Name', 'Fund House', 'Qty', 'Avg NAV', 'Current NAV', 'Current Value (₹)', 'Gain %'],
          mf_breakdown,
          (row) => {
            const gain = Number(row.gain_pct);
            const gainColor = gain > 0 ? 'text-emerald-400' : gain < 0 ? 'text-rose-400' : 'text-[var(--color-text)]';
            return (
              <>
                <td className="px-4 py-3.5 font-semibold">{row.symbol}</td>
                <td className="px-4 py-3.5 truncate max-w-[150px]">{row.mf_name}</td>
                <td className="px-4 py-3.5">{row.fund_house}</td>
                <td className="px-4 py-3.5 font-mono">{Number(row.quantity).toLocaleString()}</td>
                <td className="px-4 py-3.5 font-mono">{fmt(row.average_nav)}</td>
                <td className="px-4 py-3.5 font-mono">{fmt(row.nav)}</td>
                <td className="px-4 py-3.5 font-mono font-semibold">{fmt(row.current_value)}</td>
                <td className={`px-4 py-3.5 font-mono font-bold ${gainColor}`}>
                  {gain > 0 ? '+' : ''}{gain}%
                </td>
              </>
            );
          }
        )}
      </section>
    </div>
  );
}
