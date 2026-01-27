import React from 'react';
import { User } from '../types';
import { Menu, Bell } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
}

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-rose-500/30 selection:text-rose-900 relative">
      {/* Global Ambient Background */}
      {/* Global Ambient Background - Radiant Light Mode */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-rose-400/30 rounded-full blur-[130px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-300/40 rounded-full blur-[130px] mix-blend-multiply animate-pulse delay-700"></div>
        <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-rose-300/30 rounded-full blur-[100px] mix-blend-multiply animate-pulse delay-1000"></div>
      </div>
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 z-50 flex items-center justify-between px-6 sm:px-12 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors lg:hidden">
            <Menu className="w-5 h-5 text-slate-600" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter group cursor-pointer flex items-center gap-0.5">
            <span className="text-[#E10020]">Maya</span><span className="text-slate-400 font-light">OS</span>
          </span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8">
          <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-100 rounded-full">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-sm shadow-rose-500/50 ring-2 ring-rose-500/20"></span>
          </button>

          <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-700">{user.name}</p>
              <p className="text-xs text-slate-500 font-light tracking-wide">Neukleos Workspace</p>
            </div>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-white/10 shadow-lg shadow-black/20 ring-1 ring-white/5"
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="pt-24 max-w-7xl mx-auto w-full min-h-[calc(100vh-6rem)] pb-12">
        {children}
      </div>

    </div>
  );
};