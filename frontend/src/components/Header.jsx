// src/components/Header.jsx
import { Menu, Sun, Moon } from 'lucide-react';
import { useContext } from 'react';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

export default function Header({ onMenuClick, title }) {
  const { dark, toggle } = useTheme();
  const { user } = useContext(AuthContext);
  const initial = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-bold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all duration-200"
        >
          {dark
            ? <><Sun size={15} /><span className="text-xs font-medium hidden sm:inline">Light</span></>
            : <><Moon size={15} /><span className="text-xs font-medium hidden sm:inline">Dark</span></>
          }
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/30">
          {initial}
        </div>
      </div>
    </header>
  );
}
