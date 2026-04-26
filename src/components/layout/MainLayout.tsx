import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useSiteConfig } from '../../config/siteConfig';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const themeColor = useSiteConfig((state) => state.themeColor);

  return (
    <div className={`min-h-screen flex flex-col ${themeColor} relative overflow-hidden font-sans`}>
      {/* Background Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="background-glow background-glow-1"></div>
        <div className="background-glow background-glow-2"></div>
      </div>

      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {children}
      </main>

      <Footer />
    </div>
  );
};
