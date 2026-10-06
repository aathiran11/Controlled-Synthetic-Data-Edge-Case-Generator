import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Sparkles, Cpu, CheckCircle2, ArrowRight } from 'lucide-react';

export default function IntroSplash({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Connecting FastAPI Backend...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFading(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 700);
          }, 400);
          return 100;
        }

        const next = prev + 5;
        if (next > 25 && next <= 60) {
          setStatusText('Mounting Gemini 2.0 AI Schema Planner...');
        } else if (next > 60 && next <= 85) {
          setStatusText('Initializing Scikit-Learn ML Stress Tester...');
        } else if (next > 85) {
          setStatusText('Engine Ready. Launching Landing Studio...');
        }
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isFading && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] aquafi-bg flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Ambient Purple Spotlight Stage Beams */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.4)_0%,transparent_65%)] pointer-events-none"
          ></motion.div>

          {/* Floating Subtle Light Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center space-y-8">
            
            {/* Animated Glowing Orb Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative flex items-center justify-center"
            >
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#a855f7] via-[#c084fc] to-[#e9d5ff] flex items-center justify-center text-[#12072b] shadow-[0_0_80px_rgba(168,85,247,0.8)]">
                <Database className="w-14 h-14 stroke-[2.5] animate-pulse" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-5 rounded-full border border-[#c084fc]/50 pointer-events-none"
              ></motion.div>
            </motion.div>

            {/* Brand Title Kinetic Stagger Reveal */}
            <div className="space-y-2">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans text-white uppercase"
              >
                SYNTHDATA <span className="text-[#c084fc]">AI</span>
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="text-xs uppercase tracking-[0.3em] text-[#c084fc] font-mono font-bold"
              >
                Controlled Edge-Case Synthetic Engine
              </motion.p>
            </div>

            {/* Progress Bar & Dynamic Status Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="w-full space-y-3 pt-2"
            >
              <div className="w-full h-3 bg-[#130a2a]/90 rounded-full border border-purple-500/30 overflow-hidden p-0.5 shadow-2xl">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#ffffff] rounded-full shadow-[0_0_20px_rgba(168,85,247,0.9)]"
                  style={{ width: `${progress}%` }}
                ></motion.div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono px-1">
                <span className="text-white/80">{statusText}</span>
                <span className="text-[#c084fc] font-extrabold text-sm">{progress}%</span>
              </div>
            </motion.div>

            {/* Tech Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center space-x-4 pt-1 text-[11px] text-white/70 font-mono"
            >
              <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1 rounded-full border border-purple-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>FastAPI Live</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1 rounded-full border border-purple-500/20">
                <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>Gemini 2.0 AI</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/5 px-3 py-1 rounded-full border border-purple-500/20">
                <Cpu className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>ML Stress Test</span>
              </span>
            </motion.div>

            {/* Skip Intro Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={handleSkip}
              className="aquafi-pill px-5 py-2 rounded-full text-xs font-bold text-white/80 hover:text-white hover:bg-purple-500/30 transition-all flex items-center space-x-2 cursor-pointer mt-4"
            >
              <span>Skip Intro Animation</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#c084fc]" />
            </motion.button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
