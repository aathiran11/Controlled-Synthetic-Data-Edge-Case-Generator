import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="mb-20">
      <div className="aquafi-panel rounded-[40px] p-8 sm:p-14 border border-purple-500/30 shadow-2xl relative overflow-hidden text-center aquafi-hero-spotlight">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#a855f7]/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full aquafi-pill text-[#e9d5ff] text-xs font-bold uppercase tracking-wider border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-[#c084fc]" />
            <span>Ready to Harden Your AI Models?</span>
          </span>

          <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight font-sans leading-tight">
            Start generating <span className="text-gradient-purple">production-ready synthetic datasets</span> today
          </h2>

          <p className="text-sm sm:text-base text-purple-200/90 font-sans leading-relaxed max-w-xl mx-auto">
            Zero setup required. Generate your first synthetic dataset with custom edge-case injection in under 30 seconds.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#studio-section"
              className="btn-aquafi-primary px-8 py-4 text-xs font-extrabold flex items-center space-x-2 tracking-wide shadow-2xl cursor-pointer"
            >
              <span>Launch Live Studio Free</span>
              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            </a>

            <a
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="btn-aquafi-glass px-7 py-4 text-xs font-bold"
            >
              <span>Explore API Docs</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
