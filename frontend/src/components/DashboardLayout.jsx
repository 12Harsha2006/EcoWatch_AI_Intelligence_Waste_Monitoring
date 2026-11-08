import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#0B1220] text-[#F8FAFC]">
      {/* Left Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Operational Surveillance Navbar */}
        <Navbar />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
