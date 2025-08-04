
import React from 'react';
import { Header } from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <div className="flex pt-16 lg:pt-16">
        <div className="fixed top-16 left-0 z-40 lg:block hidden">
          <Sidebar />
        </div>
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40">
          <Sidebar />
        </div>
        <main className="flex-1 p-4 lg:p-6 lg:ml-64 w-full min-w-0 pt-24 lg:pt-4">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
