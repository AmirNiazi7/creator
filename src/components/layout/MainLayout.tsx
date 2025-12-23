import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Zap, LayoutDashboard, TrendingUp, BarChart3, Search,
  Users, FileText, Upload, User, CreditCard, Menu, X,
  LogOut, Wand2, Sparkles
} from 'lucide-react';

interface MainLayoutProps {
  onLogout: () => void;
}

export default function MainLayout({ onLogout }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Viral Content', path: '/viral-content', icon: TrendingUp },
    { name: 'Shorts Analytics', path: '/shorts-analytics', icon: BarChart3 },
    { name: 'Advanced Search', path: '/advanced-search', icon: Search },
    { name: 'Competitor Finder', path: '/competitor-finder', icon: Users },
    { name: 'Script Analyzer', path: '/script-analyzer', icon: FileText },
    { name: 'Script Rewriter', path: '/script-rewriter', icon: Wand2 },
    { name: 'Manual Posting', path: '/manual-posting', icon: Upload },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
            <Link to="/" className="flex items-center gap-3">
              <img src="/vids-logo.svg" alt="vids.so" className="h-8 w-auto" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-blue-500 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
                      active
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-zinc-800/50 space-y-1">
            <Link
              to="/billing"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
                isActive('/billing')
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Billing</span>
            </Link>
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative overflow-hidden ${
                isActive('/profile')
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4" />
                  <span>Pro Plan</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
