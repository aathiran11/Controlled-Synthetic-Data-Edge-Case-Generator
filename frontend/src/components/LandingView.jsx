import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Truck,
  ShoppingCart,
  Landmark,
  Activity,
  Cpu,
  ArrowRight,
  Plus,
  Layers,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Database,
  Lock,
  Radio
} from 'lucide-react';
import FeatureGrid from './FeatureGrid';
import HowItWorks from './HowItWorks';
import CallToAction from './CallToAction';

export default function LandingView({ onSelectOption, onLaunchStudio }) {
  const domainOptions = [
    {
      id: 'logistics',
      title: 'Logistics & Supply Chain',
      category: 'Supply Chain Anomaly',
      icon: Truck,
      color: 'text-[#c084fc]',
      bgColor: 'bg-[#a855f7]/20 border-[#c084fc]/40',
      badge: '5,000 Rows • 10% Edge-Cases',
      prompt: 'Generate 5000 logistics records with delivery delays, different vehicle types, weather conditions, and 10% rare failure cases.',
      description: 'Inject shipment delay spikes, severe weather disruptions, vehicle breakdown flags, and route contradictions into delivery data.'
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce & Order Surges',
      category: 'Retail & Payment Anomaly',
      icon: ShoppingCart,
      color: 'text-[#e9d5ff]',
      bgColor: 'bg-[#c084fc]/20 border-[#e9d5ff]/40',
      badge: '3,000 Rows • 15% Edge-Cases',
      prompt: 'Generate 3000 e-commerce order records with discount surges, payment methods, and 15% edge case anomalies.',
      description: 'Simulate high discount surges, payment processing timeouts, invalid credit card numbers, and negative order quantities.'
    },
    {
      id: 'finance',
      title: 'Finance & Banking Risk',
      category: 'Credit & Fraud Anomaly',
      icon: Landmark,
      color: 'text-[#d8b4fe]',
      bgColor: 'bg-[#9333ea]/20 border-[#d8b4fe]/40',
      badge: '2,000 Rows • 12% Edge-Cases',
      prompt: 'Generate 2000 financial banking records with credit scores, account balances, and 12% fraud risk edge cases.',
      description: 'Inject rapid credit score drops, negative account balance anomalies, duplicate transaction IDs, and high-risk fraud flags.'
    },
    {
      id: 'healthcare',
      title: 'Healthcare & Patient Vitals',
      category: 'Physiological Anomaly',
      icon: Activity,
      color: 'text-[#f472b6]',
      bgColor: 'bg-[#f472b6]/20 border-[#f472b6]/40',
      badge: '2,000 Rows • 10% Edge-Cases',
      prompt: 'Generate 2000 healthcare patient records with vitals, oxygen saturation, and 10% physiological edge cases.',
      description: 'Inject extreme physiological vitals, oxygen saturation drops (<80%), out-of-range heart rates, and missing lab records.'
    },
    {
      id: 'iot',
      title: 'IoT Sensors & Telemetry',
      category: 'Industrial Telemetry',
      icon: Cpu,
      color: 'text-[#38bdf8]',
      bgColor: 'bg-[#38bdf8]/20 border-[#38bdf8]/40',
      badge: '4,000 Rows • 15% Edge-Cases',
      prompt: 'Generate 4000 industrial IoT telemetry records with temperature sensors, battery levels, and 15% device failures.',
      description: 'Simulate industrial sensor overheat spikes (>150°C), rapid battery depletion, voltage spikes, and offline device logs.'
    },
    {
      id: 'custom',
      title: 'Custom AI Prompt Builder',
      category: 'Gemini AI Planner',
      icon: Sparkles,
      color: 'text-amber-300',
      bgColor: 'bg-amber-400/20 border-amber-300/40',
      badge: 'Flexible Schema • Custom Prompts',
      prompt: 'Generate a custom dataset with specific schema fields, edge-case failure rules, and domain distributions.',
      description: 'Write custom natural language requirements in plain English. Gemini 2.0 AI dynamically drafts Pydantic schemas.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-16"
    >
      
      {/* 1. AquaFi Hero Section - Stage Spotlights & Centered Layout */}
      <section className="relative pt-12 pb-20 rounded-[44px] overflow-hidden aquafi-hero-spotlight p-8 sm:p-14 shadow-2xl border border-purple-500/30">
        
        {/* Stage Spotlight Cone Rays coming from top edge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(192,132,252,0.4)_0%,rgba(147,51,234,0.15)_50%,transparent_80%)] pointer-events-none blur-xl"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[450px] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(216,180,254,0.25)_0deg,transparent_60deg,transparent_300deg,rgba(216,180,254,0.25)_360deg)] pointer-events-none filter blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Top Pill Badge matching AquaFi (( Effortless. Secure. Decentralized )) */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
            transition={{
              scale: { duration: 0.5 },
              opacity: { duration: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="aquafi-pill px-5 py-2 rounded-full text-xs font-bold text-[#e9d5ff] border border-[#c084fc]/50 shadow-[0_0_25px_rgba(168,85,247,0.4)] mb-6 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#c084fc] animate-pulse" />
            <span>Effortless. Controlled. AI-Driven Synthetic Engine</span>
          </motion.div>

          {/* Centered Main Headline matching AquaFi typography */}
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans"
          >
            Seamless Synthetic Data with <span className="text-gradient-purple font-black">SynthData</span> Powering the Future of ML Engine
          </motion.h1>

          {/* Centered Subtitle Paragraph matching AquaFi reference */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-sm sm:text-base text-purple-200/80 leading-relaxed font-sans max-w-2xl mt-5"
          >
            An advanced AI-powered system that analyzes schema requirements and delivers highly realistic synthetic datasets, ensuring seamless downstream ML model stress testing.
          </motion.p>

          {/* Centered Action Button matching AquaFi GET STARTED button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-col items-center"
          >
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: '0 0 55px rgba(192, 132, 252, 0.95)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onLaunchStudio}
              className="btn-aquafi-primary px-9 py-4.5 text-sm font-extrabold uppercase tracking-wider flex items-center space-x-3 cursor-pointer shadow-[0_0_40px_rgba(192,132,252,0.7)] group"
            >
              <span>GET STARTED</span>
              <div className="w-8 h-8 rounded-full bg-[#12072b] flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </div>
            </motion.button>
          </motion.div>

          {/* Left & Right Hero Floating Stat Cards matching AquaFi reference */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center mt-12 pt-10 border-t border-purple-500/20"
          >
            
            {/* Left Stats */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="md:col-span-3 text-left space-y-4 font-sans border-l-2 border-[#c084fc]/60 pl-4"
            >
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">100k+</span>
                <span className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Generated Records</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#c084fc] font-mono block">1.3M</span>
                <span className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Anomalies Injected</span>
              </div>
            </motion.div>

            {/* Center Dome Arc Showcase Preview Card matching AquaFi center card */}
            <div className="md:col-span-6 relative">
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="aquafi-panel rounded-3xl p-6 border border-purple-500/30 shadow-2xl relative overflow-hidden text-left aquafi-dome-glow"
              >
                {/* Glowing Arc Line */}
                <div className="w-full h-24 rounded-t-full border-t-2 border-[#c084fc] aquafi-arc-border mb-4 flex items-end justify-center pb-2">
                  <div className="p-3 bg-[#a855f7]/30 rounded-2xl border border-[#c084fc]/50 shadow-[0_0_25px_rgba(168,85,247,0.7)] animate-pulse">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Code Address Pill matching AquaFi screenshot */}
                <div className="bg-[#12072b]/90 border border-purple-500/30 rounded-full px-4 py-2 flex items-center justify-between text-xs font-mono text-purple-200 mb-4">
                  <span className="truncate">0x12c8d9...189c3eff7abc7ddb25329dcac5e4</span>
                  <span className="text-[10px] text-[#c084fc] font-bold">GRADE A+ AUDIT</span>
                </div>

                {/* Token Swap Box Stats matching AquaFi screenshot */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-[#1c103a]/90 p-3 rounded-2xl border border-purple-500/20">
                    <span className="text-[10px] text-purple-300/70 block">CLEAN RECORDS</span>
                    <span className="text-base font-bold text-white">4,500 ROWS</span>
                  </div>
                  <div className="bg-[#1c103a]/90 p-3 rounded-2xl border border-red-500/30 bg-red-500/10">
                    <span className="text-[10px] text-red-400 font-bold block">EDGE-CASE ANOMALIES</span>
                    <span className="text-base font-bold text-red-400">500 INJECTED</span>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Right Stats */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="md:col-span-3 text-right space-y-4 font-sans border-r-2 border-[#c084fc]/60 pr-4"
            >
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono block">Gemini 2.0</span>
                <span className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">AI Schema Planner</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#c084fc] font-mono block">0.4S</span>
                <span className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">Real-time Pipeline</span>
              </div>
            </motion.div>

          </motion.div>

        </div>

      </section>

      {/* 2. INTERACTIVE DOMAIN OPTIONS SELECTION GRID */}
      <section id="domain-options-section" className="scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="px-4 py-1.5 rounded-full aquafi-pill text-[#e9d5ff] text-xs font-bold uppercase tracking-wider border border-purple-500/30 shadow-lg">
            Domain Selection
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4 font-sans">
            Select a domain option to <span className="text-gradient-purple">process inside Studio</span>
          </h2>
          <p className="text-sm text-purple-200/80 mt-3 font-sans">
            Click any option card below to automatically load the schema & requirements and enter the Studio Workspace for full generation and stress testing.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {domainOptions.map((opt) => {
            const IconComponent = opt.icon;
            return (
              <motion.div
                key={opt.id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => onSelectOption(opt.id, opt.prompt)}
                className="aquafi-card p-7 rounded-[36px] flex flex-col justify-between group cursor-pointer border border-purple-500/25 hover:border-purple-400/60 transition-all duration-300 relative overflow-hidden"
              >
                {/* Glow Highlight on Hover */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#a855f7]/15 rounded-full blur-2xl group-hover:bg-[#a855f7]/30 transition-all pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-200/80 bg-purple-500/15 px-3 py-1 rounded-full border border-purple-500/30">
                      {opt.category}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl ${opt.bgColor} border flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]`}>
                      <IconComponent className={`w-5 h-5 ${opt.color} stroke-[2.5]`} />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#c084fc] transition-colors">
                    {opt.title}
                  </h3>

                  <p className="text-xs text-purple-200/80 leading-relaxed mt-3">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-purple-500/20 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300/80">
                    <span>{opt.badge}</span>
                  </div>

                  <button
                    type="button"
                    className="w-full btn-aquafi-primary py-3 rounded-full text-xs font-extrabold flex items-center justify-center space-x-2 tracking-wide group-hover:shadow-[0_0_30px_rgba(192,132,252,0.6)] transition-all cursor-pointer"
                  >
                    <span>Process Option Inside Studio</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 3. Capabilities Grid */}
      <FeatureGrid />

      {/* 4. How It Works Workflow */}
      <HowItWorks />

      {/* 5. Final Conversion CTA */}
      <CallToAction />

    </motion.div>
  );
}
