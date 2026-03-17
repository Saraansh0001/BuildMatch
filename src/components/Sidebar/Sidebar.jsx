import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Navigation icons (SVG components)
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
    <rect x="14" y="3" width="7" height="4" rx="1.5"></rect>
    <rect x="14" y="10" width="7" height="11" rx="1.5"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
  </svg>
);

const AddIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M12 8v8M8 12h8"></path>
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 3v5h5"></path>
    <path d="M3 8a9 9 0 1 0 2.64-6.36L3 4"></path>
    <path d="M12 7v5l3 3"></path>
  </svg>
);

const SummaryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const NavItem = ({ to, label, icon: Icon, isCollapsed, isActive, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <li className="relative group">
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-300 ease-out relative overflow-hidden group/item
          ${
            isActive
              ? 'bg-primary/10 border-primary/20 text-primary font-semibold border-l-4 border-l-primary'
              : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-secondary'
          }
        `}
        onMouseEnter={() => isCollapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Active indicator animation */}
        {isActive && (
          <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary via-primary to-primary/50 animate-pulse-subtle"></span>
        )}

        <span className={`flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : 'text-slate-400 group-hover/item:text-primary'}`}>
          <Icon />
        </span>

        {!isCollapsed && (
          <span className="flex-1 text-sm font-semibold truncate">
            {label}
          </span>
        )}

        {/* Tooltip when collapsed */}
        {isCollapsed && showTooltip && (
          <div className="fixed left-20 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap z-50 animate-fade-in shadow-lg">
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900"></div>
          </div>
        )}
      </Link>
    </li>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Dashboard', icon: DashboardIcon },
      { to: '/add-investment', label: 'Add Investment', icon: AddIcon },
      { to: '/history', label: 'Investment History', icon: HistoryIcon },
      { to: '/summary', label: 'Portfolio Summary', icon: SummaryIcon },
    ],
    []
  );

  const handleLogout = (e) => {
    e.preventDefault();
    // Add logout logic here
    console.log('Logout clicked');
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white to-slate-50 border-r border-borderline shadow-lg backdrop-blur-sm transition-all duration-300 ease-out z-40 flex flex-col overflow-y-auto
          ${isCollapsed ? 'w-24' : 'w-72'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Section */}
        <div className={`flex items-center gap-3 px-6 py-6 border-b border-borderline transition-all duration-300 ${isCollapsed ? 'flex-col gap-2' : ''}`}>
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            IP
          </div>
          {!isCollapsed && (
            <div className="flex-1 animate-slide-in">
              <h1 className="text-lg font-extrabold text-primary tracking-tight">Investment</h1>
              <p className="text-xs font-medium text-slate-500">Portfolio</p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.to}
                onClick={closeMobileMenu}
              />
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="px-3 py-2">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>

        {/* Logout Button */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-transparent text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-out group"
            title={isCollapsed ? 'Logout' : ''}
          >
            <span className="flex-shrink-0 text-slate-400 group-hover:text-red-600 transition-colors">
              <LogoutIcon />
            </span>
            {!isCollapsed && (
              <span className="flex-1 text-sm font-semibold">Logout</span>
            )}
          </button>
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-full px-3 py-3 border-t border-borderline text-slate-500 hover:text-primary transition-colors hover:bg-slate-50"
          title={isCollapsed ? 'Expand' : 'Collapse'}
          aria-label="Toggle sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
          >
            <polyline points="15 18l-6-6 6-6"></polyline>
          </svg>
        </button>
      </aside>

      {/* Spacer for content */}
      <div
        className={`transition-all duration-300 ease-out ${isCollapsed ? 'lg:ml-24' : 'lg:ml-72'}`}
      ></div>
    </>
  );
}
