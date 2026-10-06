import React from 'react';
import { Plus } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 bg-[#090514]/90 backdrop-blur-xl py-10 text-xs text-purple-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#a855f7] to-[#c084fc] flex items-center justify-center text-[#12072b] font-extrabold shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white font-sans uppercase">
            SynthData <span className="text-[#c084fc]">AI</span>
          </span>
          <span className="text-purple-300/60 hidden sm:inline">— Controlled Synthetic Data Engine</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="aquafi-pill px-3.5 py-1.5 rounded-full text-white font-mono text-[11px]">
            Backend: FastAPI
          </span>
          <span className="aquafi-pill px-3.5 py-1.5 rounded-full text-white font-mono text-[11px]">
            AI: Gemini 2.0 Flash
          </span>
          <span className="aquafi-pill px-3.5 py-1.5 rounded-full text-[#c084fc] font-mono text-[11px] border border-[#c084fc]/40">
            Frontend: React 19 + Vite
          </span>
        </div>

        <p className="text-[11px] text-purple-300/60">
          © {new Date().getFullYear()} SynthData AI. All rights reserved.
        </p>

      </div>
    </footer>
  );
}
