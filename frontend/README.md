# FolioVault Frontend

React-based dashboard for the FolioVault Investment Portfolio System.

## Tech Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS v4
- **Charts**: Chart.js
- **Icons**: Lucide React

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Proxy**
   - The frontend uses a Vite proxy to communicate with the PHP backend.
   - Update `vite.config.js` if your backend is running on a different port than `80`.

3. **Development**
   ```bash
   npm run dev
   ```
   - Opens the app at `http://localhost:5173`.

4. **Build**
   ```bash
   npm run build
   ```

## Key Features

- **Auth Flow**: Secure JWT-based login and registration.
- **Dashboard**: Asset breakdown charts and recent activity.
- **Inventory**: Sortable tables for Stocks and Mutual Funds with expanded transaction history.
- **Transactions**: Search-as-you-type combobox for adding new holdings.
- **Theme**: Premium dark/light mode support.
