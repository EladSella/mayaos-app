import React from 'react';
import { User } from '../types';
import { Menu, Bell, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500/30 selection:text-rose-900 relative overflow-x-hidden">
      {/* Global Ambient Background - Radiant Light Mode */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-rose-400/30 rounded-full blur-[130px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-300/40 rounded-full blur-[130px] mix-blend-multiply animate-pulse delay-700"></div>
        <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-rose-300/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse delay-1000"></div>
      </div>

      {/* Top Navigation - Mobile Optimized */}
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 lg:h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 z-50 flex items-center justify-between px-3 sm:px-6 lg:px-12 transition-all duration-300 safe-area-inset">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors lg:hidden active:scale-95">
            <Menu className="w-5 h-5 text-slate-600" />
          </div>
          <span className="text-xl sm:text-2xl font-extrabold tracking-tighter group cursor-pointer flex items-center gap-0.5">
            <span className="text-[#E10020]">Maya</span><span className="text-slate-400 font-light">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">


          <div className="flex items-center gap-2 sm:gap-4 pl-3 sm:pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700 truncate max-w-[120px] lg:max-w-none">{user.name}</p>
              <p className="text-xs text-slate-500 font-light tracking-wide">NKI&T Workspace</p>
            </div>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/10 shadow-lg shadow-black/20 ring-1 ring-white/5"
            />
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors hover:bg-rose-50 rounded-full ml-1"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Mobile Optimized Padding */}
      <div className="pt-16 sm:pt-20 lg:pt-24 max-w-7xl mx-auto w-full min-h-[calc(100vh-4rem)] pb-6 sm:pb-12 px-0 sm:px-4">
        {children}
      </div>
    </div>
  );
};