'use client';

import React from 'react';
import UserDropdown from './UserDropdown'; // Assuming UserDropdown is in the same Shared/ directory

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg font-sans">
      <header className="fixed top-0 right-0 z-50 p-4 sm:p-6">
        <UserDropdown />
      </header>
      <main className="flex-grow pt-20 sm:pt-24 p-4 sm:p-6">
        {children}
      </main>
      {/* You can add a shared footer here if needed */}
    </div>
  );
};

export default Layout; 