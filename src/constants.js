// Navigation and application constants

export const ROUTES = {
  DASHBOARD: '/',
  ADD_INVESTMENT: '/add-investment',
  HISTORY: '/history',
  SUMMARY: '/summary',
};

export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    to: ROUTES.DASHBOARD,
  },
  {
    id: 'add-investment',
    label: 'Add Investment',
    to: ROUTES.ADD_INVESTMENT,
  },
  {
    id: 'history',
    label: 'Investment History',
    to: ROUTES.HISTORY,
  },
  {
    id: 'summary',
    label: 'Portfolio Summary',
    to: ROUTES.SUMMARY,
  },
];

export const COLORS = {
  primary: '#2563EB',
  secondary: '#1E293B',
  page: '#F8FAFC',
  card: '#FFFFFF',
  borderline: '#E2E8F0',
};

export const SIDEBAR_WIDTHS = {
  expanded: 'w-72',
  collapsed: 'w-24',
};

export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
};

// Investment types
export const INVESTMENT_TYPES = [
  { value: 'stock', label: 'Stock' },
  { value: 'mutual-fund', label: 'Mutual Fund' },
  { value: 'cryptocurrency', label: 'Cryptocurrency' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'bonds', label: 'Bonds' },
  { value: 'other', label: 'Other' },
];

// Badge colors for investment types
export const TYPE_BADGE_COLORS = {
  'Stock': 'bg-emerald-100 text-emerald-700',
  'Mutual Fund': 'bg-blue-100 text-blue-700',
  'Cryptocurrency': 'bg-yellow-100 text-yellow-700',
  'Real Estate': 'bg-purple-100 text-purple-700',
  'Bonds': 'bg-pink-100 text-pink-700',
  'Active': 'bg-emerald-100 text-emerald-700',
  'Closed': 'bg-slate-100 text-slate-700',
};

// Stat card colors
export const STAT_COLORS = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  mint: 'from-teal-500 to-teal-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-yellow-500 to-yellow-600',
};
