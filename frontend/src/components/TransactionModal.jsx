// src/components/TransactionModal.jsx
import { useState, useEffect, useRef } from 'react';
import { X, TrendingUp, TrendingDown, Loader2, Search, Check } from 'lucide-react';
import { getAssets, addTransaction } from '../services/api';

export default function TransactionModal({ open, onClose, onSuccess, defaultType = 'Stock' }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [txType, setTxType] = useState('BUY');

  // Combobox state
  const [query, setQuery] = useState('');
  const [dropOpen, setDropOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const comboRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError('');
    setQuery(''); setSelectedAsset(null); setDropOpen(false);
    setQuantity(''); setPricePerUnit('');
    setTxType('BUY');
    getAssets(defaultType === 'Stock' ? 'stock' : 'mutual_fund')
      .then(r => setAssets(r.data.assets || []))
      .catch(() => setError('Failed to load assets.'))
      .finally(() => setLoading(false));
  }, [open, defaultType]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (comboRef.current && !comboRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = assets.filter(a =>
    a.symbol.toLowerCase().includes(query.toLowerCase()) ||
    a.name.toLowerCase().includes(query.toLowerCase())
  );

  const selectAsset = (a) => {
    setSelectedAsset(a);
    setQuery(a.symbol);
    setPricePerUnit(String(a.current_price));
    setDropOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset) { setError('Please select an asset.'); return; }
    setError(''); setSubmitting(true);
    try {
      const isStock = defaultType === 'Stock';
      await addTransaction({
        asset_type: isStock ? 'stock' : 'mutual_fund',
        stock_id: isStock ? selectedAsset.id : undefined,
        mf_id: !isStock ? selectedAsset.id : undefined,
        transaction_type: txType,
        quantity: parseFloat(quantity),
        price: parseFloat(pricePerUnit),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Transaction failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const total = (parseFloat(quantity) || 0) * (parseFloat(pricePerUnit) || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--color-border)]">
          <h2 className="text-base font-bold">Add Transaction</h2>
          <button onClick={onClose} className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* BUY / SELL toggle */}
          <div className="flex rounded-xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]">
            {['BUY', 'SELL'].map(t => (
              <button
                key={t} type="button" onClick={() => setTxType(t)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-colors duration-150 ${txType === t
                  ? t === 'BUY' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  : 'text-[var(--color-muted)]'
                  }`}
              >
                {t === 'BUY' ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {t}
              </button>
            ))}
          </div>

          {/* Asset combobox */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Asset</label>
            {loading ? (
              <div className="input-field flex items-center gap-2 text-[var(--color-muted)]">
                <Loader2 size={14} className="animate-spin" /> Loading assets…
              </div>
            ) : (
              <div ref={comboRef} className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search asset…"
                  value={query}
                  onFocus={() => setDropOpen(true)}
                  onChange={e => { setQuery(e.target.value); setSelectedAsset(null); setDropOpen(true); }}
                  className="input-field pl-9"
                  autoComplete="off"
                />
                {selectedAsset && (
                  <Check size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                )}
                {dropOpen && filtered.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
                    {filtered.map(a => (
                      <button
                        key={a.id} type="button"
                        onClick={() => selectAsset(a)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--color-accent)]/10 transition-colors flex items-center justify-between gap-2 ${selectedAsset?.id === a.id ? 'bg-[var(--color-accent)]/10' : ''}`}
                      >
                        <span><span className="font-semibold">{a.symbol}</span> — <span className="text-[var(--color-muted)]">{a.name}</span></span>
                        <span className="text-xs text-[var(--color-muted)] shrink-0">₹{a.current_price}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Quantity</label>
            <input
              type="number" required min="0.000001" step="any" placeholder="e.g. 10"
              value={quantity} onChange={e => setQuantity(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted)] mb-1.5">Price per Unit (₹)</label>
            <input
              type="number" required min="0.000001" step="any" placeholder="e.g. 1500.50"
              value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Total preview */}
          {total > 0 && (
            <div className={`rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-between ${txType === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              <span>Total {txType === 'BUY' ? 'Cost' : 'Proceeds'}</span>
              <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          )}

          {error && <p className="text-xs text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button
              type="submit" disabled={submitting}
              className={`flex-1 flex items-center justify-center gap-2 font-semibold rounded-xl px-5 py-2.5 transition-all duration-150 active:scale-95 text-white disabled:opacity-50 ${txType === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? 'Processing…' : `Confirm ${txType}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
