import React, { useState } from 'react';

export default function AddInvestment() {
  const [formData, setFormData] = useState({
    investmentType: 'stock',
    investmentName: '',
    investedAmount: '',
    purchasePrice: '',
    quantity: '',
    purchaseDate: '',
  });
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const typeOptions = [
    { value: 'stock', label: 'Stock' },
    { value: 'mutual-fund', label: 'Mutual Fund' },
    { value: 'etf', label: 'ETF' },
    { value: 'cryptocurrency', label: 'Cryptocurrency' },
    { value: 'bonds', label: 'Bonds' },
  ];

  const iconMap = {
    stock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19h16" />
        <path d="M7 15V9" />
        <path d="M12 15V6" />
        <path d="M17 15v-3" />
      </svg>
    ),
    'mutual-fund': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 12V4" />
        <path d="M12 12l6 4" />
      </svg>
    ),
    etf: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 16l5-5 4 3 7-8" />
        <path d="M20 10V4h-6" />
      </svg>
    ),
    cryptocurrency: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 4v10l-7 4-7-4V7z" />
        <path d="M9 9h6M9 12h6M9 15h6" />
      </svg>
    ),
    bonds: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    ),
  };

  const toLabel = (value) => {
    if (!value) return 'Stock';
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  const formatINR = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(numeric);
  };

  const parseDateInput = (dateString) => {
    const trimmed = String(dateString || '').trim();
    const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(trimmed);

    if (!match) {
      return null;
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const parsed = new Date(year, month - 1, day);

    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.getDate() !== day ||
      parsed.getMonth() !== month - 1 ||
      parsed.getFullYear() !== year
    ) {
      return null;
    }

    return parsed;
  };

  const formatDate = (dateString) => {
    const parsed = parseDateInput(dateString);
    if (!parsed) return 'Not Selected';

    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'investmentType',
      'investmentName',
      'investedAmount',
      'purchasePrice',
      'quantity',
      'purchaseDate',
    ];

    requiredFields.forEach((field) => {
      if (formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required.';
      }
    });

    ['investedAmount', 'purchasePrice', 'quantity'].forEach((field) => {
      if (formData[field] && Number(formData[field]) <= 0) {
        newErrors[field] = 'Enter a value greater than zero.';
      }
    });

    if (formData.purchaseDate && !parseDateInput(formData.purchaseDate)) {
      newErrors.purchaseDate = 'Use format dd-mm-yyyy.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log('Form submitted:', formData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      investmentType: 'stock',
      investmentName: '',
      investedAmount: '',
      purchasePrice: '',
      quantity: '',
      purchaseDate: '',
    });
    setErrors({});
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
          Financial Workspace
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Add Investment
        </h1>
        <p className="text-slate-600">
          Capture transaction details and instantly preview your investment card.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl border border-borderline bg-white p-6 shadow-soft md:p-8">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
              Investment Details
            </h2>
            <p className="text-slate-600 text-sm">
              Fill in your investment information below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-1">
                <label htmlFor="investmentType" className="mb-2 block text-sm font-semibold text-slate-700">
                  Investment Type
                </label>
                <select
                  id="investmentType"
                  name="investmentType"
                  value={formData.investmentType}
                  onChange={handleChange}
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition-all duration-200 ${
                    errors.investmentType
                      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-borderline focus:border-primary focus:ring-4 focus:ring-blue-100'
                  }`}
                  aria-invalid={Boolean(errors.investmentType)}
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.investmentType && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.investmentType}</p>}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="investmentName" className="mb-2 block text-sm font-semibold text-slate-700">
                  Investment Name
                </label>
                <input
                  id="investmentName"
                  type="text"
                  name="investmentName"
                  value={formData.investmentName}
                  onChange={handleChange}
                  placeholder="e.g. HDFC Equity Fund"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                    errors.investmentName
                      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-borderline focus:border-primary focus:ring-4 focus:ring-blue-100'
                  }`}
                  aria-invalid={Boolean(errors.investmentName)}
                />
                {errors.investmentName && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.investmentName}</p>}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="investedAmount" className="mb-2 block text-sm font-semibold text-slate-700">
                  Total Amount Invested
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">₹</span>
                  <input
                    id="investedAmount"
                    type="number"
                    name="investedAmount"
                    value={formData.investedAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="50000"
                    className={`h-12 w-full rounded-xl border bg-white pl-8 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                      errors.investedAmount
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-borderline focus:border-primary focus:ring-4 focus:ring-blue-100'
                    }`}
                    aria-invalid={Boolean(errors.investedAmount)}
                  />
                </div>
                {errors.investedAmount && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.investedAmount}</p>}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="purchasePrice" className="mb-2 block text-sm font-semibold text-slate-700">
                  Purchase Price
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">₹</span>
                  <input
                    id="purchasePrice"
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="2500"
                    className={`h-12 w-full rounded-xl border bg-white pl-8 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                      errors.purchasePrice
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                        : 'border-borderline focus:border-primary focus:ring-4 focus:ring-blue-100'
                    }`}
                    aria-invalid={Boolean(errors.purchasePrice)}
                  />
                </div>
                {errors.purchasePrice && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.purchasePrice}</p>}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="quantity" className="mb-2 block text-sm font-semibold text-slate-700">
                  Quantity / Units
                </label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="20"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                    errors.quantity
                      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-borderline focus:border-primary focus:ring-4 focus:ring-blue-100'
                  }`}
                  aria-invalid={Boolean(errors.quantity)}
                />
                {errors.quantity && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.quantity}</p>}
              </div>

              <div className="md:col-span-1">
                <label htmlFor="purchaseDate" className="mb-2 block text-sm font-semibold text-slate-700">
                  Purchase Date
                </label>
                <input
                  id="purchaseDate"
                  type="text"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  inputMode="numeric"
                  placeholder="dd-mm-yyyy"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 ${
                    errors.purchaseDate
                      ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                      : 'border-borderline focus:border-primary focus:ring-4 focus:ring-blue-100'
                  }`}
                  aria-invalid={Boolean(errors.purchaseDate)}
                />
                {errors.purchaseDate && <p className="mt-1.5 text-xs font-medium text-red-600">{errors.purchaseDate}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <button
                type="submit"
                className="h-12 flex-1 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#06B6D4] px-6 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/35 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Add Investment
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="h-12 rounded-xl border border-borderline bg-white px-6 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-100 sm:w-36"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-borderline bg-white p-6 shadow-soft md:p-8 lg:sticky lg:top-24">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
              Live Preview
            </h2>
            <p className="text-slate-600 text-sm">Your card updates while you type.</p>
          </div>

          <div className="rounded-2xl p-5 border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 mb-4">
            <div className="flex gap-3 mb-4 items-center">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white flex-shrink-0">
                {iconMap[formData.investmentType] || iconMap.stock}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  {toLabel(formData.investmentType)}
                </p>
                <h4 className="text-lg font-bold text-slate-900 truncate">
                  {formData.investmentName || 'Your Investment Name'}
                </h4>
              </div>
            </div>

            <p className="text-3xl font-black text-slate-900 mb-3">
              {formatINR(formData.investedAmount)}
            </p>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Purchase Price</span>
                <strong className="text-slate-900 font-semibold">
                  {formatINR(formData.purchasePrice)}
                </strong>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Units</span>
                <strong className="text-slate-900 font-semibold">
                  {formData.quantity
                    ? Number(formData.quantity).toLocaleString('en-IN')
                    : '0'}
                </strong>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Date</span>
                <strong className="text-slate-900 font-semibold">
                  {formatDate(formData.purchaseDate)}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-borderline p-4 bg-white space-y-3">
            <div className="flex justify-between gap-2">
              <span className="text-sm text-slate-500">Invested Capital</span>
              <strong className="text-slate-900 font-semibold">
                {formatINR(formData.investedAmount)}
              </strong>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-sm text-slate-500">Allocation Type</span>
              <strong className="text-slate-900 font-semibold">
                {toLabel(formData.investmentType)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-20 flex items-center gap-2.5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 shadow-soft">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <p className="text-sm font-semibold text-green-700">
            Investment added successfully.
          </p>
        </div>
      )}
    </div>
  );
}
