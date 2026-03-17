# Component Usage Guide

## Sidebar Component

### Basic Usage

The Sidebar component is automatically included in the MainLayout:

```jsx
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
}
```

### Features

#### 1. Active Route Detection

The sidebar automatically highlights the current page based on the route:

- Uses React Router's `useLocation()` hook
- Updates on route changes
- Shows blue background + left border indicator

#### 2. Collapse/Expand (Desktop)

- Click the arrow button at bottom of sidebar
- Smooth animation from 288px to 96px width
- Labels hide when collapsed
- Tooltips appear on hover over icons
- Hidden on mobile devices

#### 3. Mobile Menu

- Click hamburger icon to open
- Click overlay to close
- Click menu item to navigate (auto-closes)
- Responsive breakpoint at 1024px

#### 4. Navigation Items

Each nav item includes:

```jsx
{
  to: '/page-route',        // React Router path
  label: 'Page Name',        // Display text
  icon: IconComponent        // SVG icon component
}
```

### Adding Custom Navigation Items

Edit `src/components/Sidebar/Sidebar.jsx`:

```jsx
const navItems = useMemo(
  () => [
    { to: "/", label: "Dashboard", icon: DashboardIcon },
    { to: "/add-investment", label: "Add Investment", icon: AddIcon },
    // Add your new item here:
    { to: "/reports", label: "Reports", icon: ReportIcon },
  ],
  [],
);
```

Then create your page component:

```jsx
// src/pages/Reports.jsx
export default function Reports() {
  return (
    <div>
      <h1>Reports</h1>
      {/* Your content */}
    </div>
  );
}
```

Add the route in `src/App.jsx`:

```jsx
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* ... existing routes ... */}
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
```

## MainLayout Component

### Purpose

Provides consistent layout structure with:

- Sidebar on left
- Content area on right
- Responsive spacing
- Proper padding and margins

### Usage

```jsx
import MainLayout from "./layouts/MainLayout";

<MainLayout>
  <YourPageComponent />
</MainLayout>;
```

### Props

- `children` - React components to display in content area

### Responsive Behavior

- **Mobile**: No left margin, full width
- **Desktop**: Left margin auto-adjusts based on sidebar state

## Creating a New Page

### 1. Create the page component

```jsx
// src/pages/YourPage.jsx
import React from "react";

export default function YourPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold text-secondary mb-2">
        Your Page Title
      </h1>
      <p className="text-slate-600">Your page description</p>

      {/* Your content */}
    </div>
  );
}
```

### 2. Add route in App.jsx

```jsx
import YourPage from "./pages/YourPage";

<Routes>
  <Route path="/your-page" element={<YourPage />} />
</Routes>;
```

### 3. Add navigation item in Sidebar.jsx

```jsx
const navItems = [
  // ... existing items ...
  { to: "/your-page", label: "Your Page", icon: YourIcon },
];
```

## Styling Guide

### Using Tailwind Classes

All components use Tailwind CSS classes. Common patterns:

```jsx
// Text styling
className = "text-lg font-bold text-secondary";

// Spacing
className = "p-6 mb-8";

// Responsive
className = "w-full lg:w-72";

// Interactive
className = "hover:bg-slate-50 transition-colors";

// Gradients
className = "bg-gradient-to-r from-primary to-primary/80";
```

### Custom Colors

Defined in `tailwind.config.js`:

- `primary` - Main brand color (#2563EB)
- `secondary` - Dark text (#1E293B)
- `page` - Page background (#F8FAFC)
- `card` - Card background (#FFFFFF)
- `borderline` - Border color (#E2E8F0)

### Custom Animations

```jsx
className = "animate-fade-in"; // Fade in effect
className = "animate-slide-in"; // Slide in from left
```

## Common Components

### Stat Card (Dashboard)

```jsx
<StatCard
  label="Total Investment"
  value="₹145,000"
  color="blue"
  icon={WalletIcon}
/>
```

### Badge

```jsx
<span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
  Mutual Fund
</span>
```

### Button Styles

Primary button:

```jsx
<button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition">
  Click me
</button>
```

Secondary button:

```jsx
<button className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 transition">
  Click me
</button>
```

## State Management

Currently using React's built-in `useState` hook. For larger applications, consider:

- Redux Toolkit
- Zustand
- Recoil
- Context API

## Performance Optimization

### Already Implemented

- Memoized navigation items (`useMemo`)
- Efficient re-render prevention
- CSS transitions for smooth animations
- Lazy loading ready

### Potential Improvements

- React.memo for page components
- Code splitting with React.lazy
- Image optimization
- API call caching

## Debugging

### Console Logs

Already placed in key areas:

- Logout button click: `console.log('Logout clicked')`
- Investment actions: `console.log('Edit:', id)`
- Form submission: `console.log('Form submitted:', formData)`

### React DevTools

Use React Developer Tools browser extension for:

- Component tree inspection
- Props and state inspection
- Performance profiling

## Common Issues & Solutions

### Issue: Sidebar not showing active state

**Solution**: Ensure routes are correctly defined in `App.jsx` and match sidebar links

### Issue: Sidebar collapse animation not smooth

**Solution**: Check that Tailwind CSS is properly compiled and loaded

### Issue: Mobile menu stays open

**Solution**: Ensure `closeMobileMenu()` is called when navigating

---

For more detailed information, refer to the main README.md file.
