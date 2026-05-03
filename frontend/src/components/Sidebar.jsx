// src/components/Sidebar.jsx
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, BarChart3, Clock, User, Wallet, X, LogOut
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const NAV = [
  { to: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/stocks',       label: 'Stocks',       icon: TrendingUp },
  { to: '/mutual-funds', label: 'Mutual Funds', icon: BarChart3 },
  { to: '/history',      label: 'Transactions', icon: Clock },
  { to: '/profile',      label: 'Profile',      icon: User },
];

export default function Sidebar({ open, onClose }) {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-40 w-64
          md:static md:z-auto md:w-16 lg:w-64
          bg-[var(--color-surface)] border-r border-[var(--color-border)]
          flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <Wallet size={17} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden lg:block">FolioVault</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-l-2 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-500/10 text-[var(--color-text)]'
                    : 'border-transparent text-[var(--color-muted)] hover:bg-[var(--color-border)]/60 hover:text-[var(--color-text)]'
                }`
              }
            >
              <Icon size={17} className="shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-4 border-t border-[var(--color-border)] space-y-2">
          {user && (
            <div className="px-3 py-2 hidden lg:block">
              <p className="text-xs font-medium text-[var(--color-text)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--color-muted)] truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-2 border-transparent text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-150"
          >
            <LogOut size={17} className="shrink-0" />
            <span className="hidden lg:block">Logout</span>
          </button>
          <p className="text-center text-xs text-[var(--color-muted)] pb-1 hidden lg:block">© 2026 FolioVault</p>
        </div>
      </aside>
    </>
  );
}
