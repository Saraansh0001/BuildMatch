// src/pages/TransactionHistory.jsx
import { useEffect, useState, useCallback } from 'react';
import { Search, Filter, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { getHistory } from '../services/api';
import Skeleton from '../components/Skeleton';

const fmt     = (n) => '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const fmtDate = (d) => new Date(d).toLocaleString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

function TxBadge({ type }) {
  const isBuy = type === 'BUY';
  return (
    <span className={isBuy ? 'badge-buy' : 'badge-sell'}>
      {isBuy ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
      {type}
    </span>
  );
}

export default function TransactionHistory() {
  const [txns, setTxns]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [pages, setPages]   = useState(1);
  const [page, setPage]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  const [search, setSearch]         = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [assetFilter, setAssetFilter] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getHistory({ page, search: search || undefined, type: typeFilter || undefined, asset_type: assetFilter || undefined })
      .then(r => {
        setTxns(r.data.transactions || []);
        setTotal(r.data.total || 0);
        setPages(r.data.pages || 1);
      })
      .catch(() => setError('Failed to load transaction history.'))
      .finally(() => setLoading(false));
  }, [page, search, typeFilter, assetFilter]);

  useEffect(() => { setPage(1); }, [search, typeFilter, assetFilter]);
  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search symbol or name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--color-muted)] shrink-0" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field w-auto">
            <option value="">All Types</option>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
          <select value={assetFilter} onChange={e => setAssetFilter(e.target.value)} className="input-field w-auto">
            <option value="">All Assets</option>
            <option value="Stock">Stock</option>
            <option value="Mutual Fund">Mutual Fund</option>
          </select>
        </div>
      </div>

      {/* Count bar */}
      <div className="flex items-center justify-between text-xs text-[var(--color-muted)] px-1">
        <span>{total} transaction{total !== 1 ? 's' : ''} found</span>
        {pages > 1 && <span>Page {page} of {pages}</span>}
      </div>

      {loading ? (
        <div className="card p-6"><Skeleton count={5} /></div>
      ) : error ? (
        <div className="card py-12 text-center text-rose-400 text-sm">{error}</div>
      ) : txns.length === 0 ? (
        <div className="card py-16 flex flex-col items-center gap-2 text-[var(--color-muted)] text-sm">
          <Clock size={30} className="opacity-20" />
          No transactions found
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="md:hidden space-y-3">
            {txns.map(tx => (
              <div key={tx.id} className="card p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-0.5 w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${tx.transaction_type === 'BUY' ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                    {tx.transaction_type === 'BUY'
                      ? <ArrowUp size={13} className="text-emerald-400" />
                      : <ArrowDown size={13} className="text-rose-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{tx.symbol}</p>
                    <p className="text-xs text-[var(--color-muted)]">{tx.asset_type} · {tx.quantity} units @ {fmt(tx.price_per_unit)}</p>
                    <p className="text-xs text-[var(--color-muted)] mt-0.5">{fmtDate(tx.transaction_date)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <TxBadge type={tx.transaction_type} />
                  <p className="font-mono font-semibold text-sm mt-1">{fmt(tx.total_amount)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-muted)]">
                    <th className="text-left px-5 py-3.5 font-semibold">Type</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Asset</th>
                    <th className="text-right px-5 py-3.5 font-semibold">Quantity</th>
                    <th className="text-right px-5 py-3.5 font-semibold">Price/Unit</th>
                    <th className="text-right px-5 py-3.5 font-semibold">Total</th>
                    <th className="text-right px-5 py-3.5 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map(tx => (
                    <tr key={tx.id} className="table-row">
                      <td className="px-5 py-3.5"><TxBadge type={tx.transaction_type} /></td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold">{tx.symbol}</p>
                        <p className="text-xs text-[var(--color-muted)]">{tx.asset_type}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono">{Number(tx.quantity).toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-right font-mono">{fmt(tx.price_per_unit)}</td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold">{fmt(tx.total_amount)}</td>
                      <td className="px-5 py-3.5 text-right text-xs text-[var(--color-muted)] whitespace-nowrap">{fmtDate(tx.transaction_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-30 hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm text-[var(--color-muted)]">{page} / {pages}</span>
          <button
            disabled={page === pages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 rounded-lg border border-[var(--color-border)] disabled:opacity-30 hover:bg-[var(--color-accent)]/10 transition-colors"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
