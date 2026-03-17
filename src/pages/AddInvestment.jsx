import React, { useState } from 'react';

export default function AddInvestment() {
  const [formData, setFormData] = useState({
    investmentName: '',
    investmentType: 'stock',
    investmentAmount: '',
    investmentDate: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add submission logic here
    alert('Investment added successfully!');
    setFormData({
      investmentName: '',
      investmentType: 'stock',
      investmentAmount: '',
      investmentDate: '',
      description: '',
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-secondary mb-2">Add Investment</h1>
        <p className="text-slate-600">Add a new investment to your portfolio</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-borderline shadow-sm p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Investment Name */}
          <div className="group">
            <label className="block text-sm font-semibold text-secondary mb-2">
              Investment Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="investmentName"
              value={formData.investmentName}
              onChange={handleChange}
              required
              placeholder="e.g., HDFC Equity Fund"
              className="w-full px-4 py-3 border border-borderline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Investment Type */}
          <div className="group">
            <label className="block text-sm font-semibold text-secondary mb-2">
              Investment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="investmentType"
              value={formData.investmentType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-borderline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 bg-white"
            >
              <option value="stock">Stock</option>
              <option value="mutual-fund">Mutual Fund</option>
              <option value="cryptocurrency">Cryptocurrency</option>
              <option value="real-estate">Real Estate</option>
              <option value="bonds">Bonds</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Investment Amount */}
          <div className="group">
            <label className="block text-sm font-semibold text-secondary mb-2">
              Investment Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="investmentAmount"
              value={formData.investmentAmount}
              onChange={handleChange}
              required
              placeholder="50000"
              min="0"
              step="100"
              className="w-full px-4 py-3 border border-borderline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Investment Date */}
          <div className="group">
            <label className="block text-sm font-semibold text-secondary mb-2">
              Investment Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="investmentDate"
              value={formData.investmentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-borderline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div className="group">
            <label className="block text-sm font-semibold text-secondary mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any notes or details about this investment..."
              rows="4"
              className="w-full px-4 py-3 border border-borderline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 transform hover:scale-105"
            >
              ✓ Add Investment
            </button>
            <button
              type="reset"
              onClick={() => setFormData({
                investmentName: '',
                investmentType: 'stock',
                investmentAmount: '',
                investmentDate: '',
                description: '',
              })}
              className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-200 transition-all duration-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Helpful Tips */}
      <div className="mt-8 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20 p-6">
        <h3 className="font-semibold text-secondary mb-3">💡 Tips</h3>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• Make sure to accurately enter the investment amount</li>
          <li>• Provide detailed information for better portfolio tracking</li>
          <li>• You can edit or delete investments later from the history page</li>
          <li>• Keep your investment records updated for accurate analysis</li>
        </ul>
      </div>
    </div>
  );
}
