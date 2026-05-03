// src/App.jsx
import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import StockInventory from './pages/StockInventory';
import MutualFundInventory from './pages/MutualFundInventory';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Register from './pages/Register';
import { useState } from 'react';

const PAGE_TITLES = {
  '/':             'Dashboard',
  '/stocks':       'Stock Inventory',
  '/mutual-funds': 'Mutual Funds',
  '/history':      'Transaction History',
  '/insights':     'Insights',
  '/profile':      'My Profile',
};

// Shows a centered spinner while auth state resolves — never redirects during load
function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-[var(--color-bg)]">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Redirects unauthenticated users to /login; shows spinner while loading
function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <Spinner />;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'FolioVault';

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/stocks"       element={<StockInventory />} />
            <Route path="/mutual-funds" element={<MutualFundInventory />} />
            <Route path="/history"      element={<TransactionHistory />} />
            <Route path="/insights"     element={<Insights />} />
            <Route path="/profile"      element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All other routes require auth */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
