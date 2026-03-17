import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import AddInvestment from './pages/AddInvestment';
import InvestmentHistory from './pages/InvestmentHistory';
import PortfolioSummary from './pages/PortfolioSummary';

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-investment" element={<AddInvestment />} />
          <Route path="/history" element={<InvestmentHistory />} />
          <Route path="/summary" element={<PortfolioSummary />} />
          {/* 404 Fallback */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-secondary mb-2">404 - Page Not Found</h1>
              <p className="text-slate-600">The page you're looking for doesn't exist.</p>
              <a href="/" className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition">
                Go to Dashboard
              </a>
            </div>
          } />
        </Routes>
      </MainLayout>
    </Router>
  );
}
