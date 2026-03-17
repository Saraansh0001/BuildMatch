import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-page">
      <Sidebar />
      <main className="lg:ml-72 transition-all duration-300 ease-out">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
