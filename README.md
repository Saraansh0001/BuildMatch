# Investment Portfolio Management System - React Refactor

A modern, responsive React application for managing your investment portfolio with a reusable sidebar component and clean, modular architecture.

## 🎯 Features

### 🎨 UI Components

- **Reusable Sidebar Component** - Rich, interactive navigation with smooth animations
  - Collapsible sidebar (desktop only)
  - Mobile hamburger menu
  - Active route highlighting with indicator animation
  - Tooltips when collapsed
  - Modern glass effect with subtle shadow
  - Smooth transitions and hover effects

- **MainLayout Wrapper** - Consistent layout across all pages
  - Fixed sidebar on desktop
  - Responsive design for mobile/tablet
  - Automatic margin adjustments based on sidebar state

### 📑 Pages

1. **Dashboard** - Portfolio overview with key statistics
2. **Add Investment** - Form to add new investments
3. **Investment History** - View and manage all investments
4. **Portfolio Summary** - Detailed portfolio analysis and insights

## 📁 Project Structure

```
src/
├── components/
│   └── Sidebar/
│       └── Sidebar.jsx          # Reusable sidebar component
├── layouts/
│   └── MainLayout.jsx            # Main layout wrapper
├── pages/
│   ├── Dashboard.jsx             # Dashboard page
│   ├── AddInvestment.jsx         # Add investment form
│   ├── InvestmentHistory.jsx     # Investment history
│   └── PortfolioSummary.jsx      # Portfolio analysis
├── App.jsx                       # Main app with routing
├── main.jsx                      # React entry point
└── index.css                     # Global styles
```

## 🚀 Getting Started

### Installation

```bash
npm install
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📚 Technologies Used

- **React** 18.2.0
- **React Router DOM** 6.20.0
- **Tailwind CSS** 3.4.1
- **Vite** 5.0.8

---

**Original Author**: Saraansh Gandhi
[LinkedIn Profile](https://www.linkedin.com/in/saraansh-gandhi-845403327)

**Refactored**: Converted to modern React with component-based architecture
