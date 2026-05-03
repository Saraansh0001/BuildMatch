// src/components/HoldingsTable.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { getInventory, getHistory } from '../services/api';
import { TrendingUp, TrendingDown, Plus, Search, ChevronDown, ChevronRight, ArrowUpDown } from 'lucide-react';
import Skeleton from './Skeleton';
import TransactionModal from './TransactionModal';
import { useToast } from '../context/ToastContext';

const fmt = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const COLS = [
  { key: 'symbol',        label: 'Symbol',  align: 'left'  },
  { key: 'quantity',      label: 'Qty',     align: 'right' },
  { key: 'average_price', label: 'Avg Buy', align: 'right' },
  { key: 'current_price', label: 'Price',   align: 'right' },
  { key: 'current_value', label: 'Value',   align: 'right' },
];

export default function HoldingsTable({ type }) {
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [search, setSearch]       = useState('');
  const [sortKey, setSortKey]     = useState('symbol');
  const [sortDir, setSortDir]     = useState('asc');
  const [expanded, setExpanded]   = useState(null);
  const [expandData, setExpandData] = useState({});
  const [expandLoading, setExpandLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();

  const dataKey   = type === 'Stock' ? 'stocks' : 'mutual_funds';
  const accentCls = type === 'Stock'
    ? 'bg-indigo-500/10 text-indigo-400'
    : 'bg-amber-500/10 text-amber-400';

  const load = useCallback(() => {
    setLoading(true);
    getInventory()
      .then(r => setRows(r.data[dataKey] || []))
      .catch(() => setError(`Failed to load ${type} holdings.`))
      .finally(() => setLoading(false));
  }, [dataKey, type]);

  useEffect(() => { load(); }, [load]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = rows
    .filter(r =>
      r.symbol.toLowerCase().includes(search.toLowerCase()) ||
      (r.stock_name || r.mf_name || '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      const cmp = typeof va === 'string' ? va.localeCompare(vb) : (va - vb);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const toggleExpand = async (symbol) => {
    if (expanded === symbol) { setExpanded(null); return; }
    setExpanded(symbol);
    if (expandData[symbol]) return;
    setExpandLoading(true);
    try {
      const r = await getHistory({ search: symbol });
      setExpandData(d => ({ ...d, [symbol]: r.data.transactions || [] }));
    } catch {
      setExpandData(d => ({ ...d, [symbol]: [] }));
    } finally {
      setExpandLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder={`Search ${type === 'Stock' ? 'stocks' : 'funds'}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6"><Skeleton /></div>
        ) : error ? (
          <div className="py-12 text-center text-rose-400 text-sm">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-[var(--color-surface)]">
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
                  <th className="w-8 px-4 py-3.5" />
                  {COLS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => toggleSort(col.key)}
                      className={`px-4 py-3.5 font-semibold cursor-pointer select-none hover:text-[var(--color-text)] transition-colors ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <ArrowUpDown size={10} className={sortKey === col.key ? 'opacity-80' : 'opacity-25'} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-[var(--color-muted)] text-sm">
                      No holdings found.
                    </td>
                  </tr>
                ) : filtered.map(row => (
                  <React.Fragment key={row.stock_id || row.mf_id}>
                    <tr
                      key={row.stock_id || row.mf_id}
                      onClick={() => toggleExpand(row.symbol)}
                      className="table-row cursor-pointer"
                    >
                      <td className="px-4 py-3.5 text-[var(--color-muted)]">
                        {expanded === row.symbol ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${accentCls}`}>
                            {row.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-semibold">{row.symbol}</p>
                            <p className="text-xs text-[var(--color-muted)] truncate max-w-[130px]">{row.stock_name || row.mf_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono">{Number(row.quantity).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-right font-mono">{fmt(row.average_price ?? row.average_nav ?? 0)}</td>
                      <td className="px-4 py-3.5 text-right font-mono">{fmt(row.current_price)}</td>
                      <td className="px-4 py-3.5 text-right font-mono font-semibold">{fmt(row.current_value)}</td>
                    </tr>
                    {expanded === row.symbol && (
                      <tr key={`${row.stock_id || row.mf_id}-exp`}>
                        <td colSpan={7} className="bg-[var(--color-bg)] px-8 py-4 border-b border-[var(--color-border)]">
                          {expandLoading && !expandData[row.symbol] ? (
                            <Skeleton count={2} />
                          ) : (
                            <React.Fragment key={row.stock_id || row.mf_id}>
                              <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
                                Recent transactions — {row.symbol}
                              </p>
                              {(expandData[row.symbol] || []).length === 0 ? (
                                <p className="text-xs text-[var(--color-muted)]">No transactions found.</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {expandData[row.symbol].map(tx => (
                                    <div key={tx.id} className="grid grid-cols-4 gap-2 text-xs py-1.5 border-b border-[var(--color-border)] last:border-0">
                                      <span className={`font-semibold ${tx.transaction_type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {tx.transaction_type}
                                      </span>
                                      <span className="text-[var(--color-muted)]">{tx.quantity} units @ {fmt(tx.price_per_unit)}</span>
                                      <span className="font-mono font-semibold text-right">{fmt(tx.total_amount)}</span>
                                      <span className="text-[var(--color-muted)] text-right">{new Date(tx.transaction_date).toLocaleDateString('en-IN')}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </React.Fragment>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { load(); addToast('Transaction added successfully!', 'success'); }}
        defaultType={type}
      />
    </div>
  );
}
