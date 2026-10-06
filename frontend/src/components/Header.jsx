import React from 'react';
import { Plus, ArrowUpRight, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';

export default function Header({ isBackendOnline, currentView, onNavigate }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#090514]/80 border-b border-purple-500/20 px-4 sm:px-8 py-3.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo matching AquaFi layout (+ SynthData) */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-2.5 cursor-pointer group text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#a855f7] to-[#c084fc] flex items-center justify-center text-[#12072b] font-extrabold shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-105 transition-transform">
            <Plus className="w-5 h-5 stroke-[3]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-extrabold text-2xl tracking-tight text-white font-sans uppercase">
              SynthData
            </span>
            <span className="text-xs font-bold text-[#c084fc] font-mono tracking-widest hidden sm:inline-block">
              AI ENGINE
            </span>
          </div>
        </button>

        {/* Center Pill Navigation matching AquaFi reference */}
        <nav className="hidden md:flex items-center space-x-1 aquafi-pill px-2 py-1.5 rounded-full shadow-inner">
          {currentView === 'landing' ? (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#c084fc] text-[#12072b] shadow-sm"
              >
                Home
              </button>
              <a
                href="#domain-options-section"
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-purple-500/20 transition-all"
              >
                Options & Domains
              </a>
              <a
                href="#features-section"
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-purple-500/20 transition-all"
              >
                Capabilities
              </a>
              <a
                href="#how-it-works-section"
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-purple-500/20 transition-all"
              >
                How It Works
              </a>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className="px-4 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white hover:bg-purple-500/20 flex items-center space-x-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Landing Page</span>
              </button>
              <button
                onClick={() => onNavigate('studio')}
                className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#c084fc] text-[#12072b] shadow-sm flex items-center space-x-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Studio Workspace</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Backend Status Pill */}
          <div className="hidden lg:flex items-center space-x-2 bg-[#170e2d]/80 px-3.5 py-1.5 rounded-full border border-purple-500/30 text-[11px] font-medium backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isBackendOnline ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isBackendOnline ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              ></span>
            </span>
            <span className="text-white/90 font-mono">
              FastAPI: {isBackendOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {currentView === 'landing' ? (
            <button
              onClick={() => onNavigate('studio')}
              className="btn-aquafi-primary px-5 py-2.5 text-xs font-extrabold flex items-center space-x-1.5 tracking-tight cursor-pointer"
            >
              <span>Launch Studio</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('landing')}
              className="btn-aquafi-glass px-4 py-2 text-xs font-extrabold flex items-center space-x-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
