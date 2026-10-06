import React from 'react';
import { Sparkles, Sliders, ShieldCheck, Cpu } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Prompt & Schema Draft',
      description: 'Describe requirements in plain English. Gemini AI plans schema features and data types.',
      icon: Sparkles,
      color: 'text-[#f4a261]'
    },
    {
      step: '02',
      title: 'Inject Rare Edge-Cases',
      description: 'Specify injection ratios (5%–50%) for boundary violations, missing data, and outliers.',
      icon: Sliders,
      color: 'text-amber-300'
    },
    {
      step: '03',
      title: 'Audit Schema Quality',
      description: 'Automated validators evaluate data quality scorecards (0-100) and letter grades.',
      icon: ShieldCheck,
      color: 'text-emerald-300'
    },
    {
      step: '04',
      title: 'Stress-Test & Export',
      description: 'Train ML models to measure F1 score degradation and export production CSV datasets.',
      icon: Cpu,
      color: 'text-sky-300'
    }
  ];

  return (
    <section id="how-it-works-section" className="mb-20">
      <div className="aquafi-panel rounded-[40px] p-8 sm:p-12 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-4 py-1.5 rounded-full aquafi-pill text-[#e9d5ff] text-xs font-bold uppercase tracking-wider border border-purple-500/30">
            Streamlined Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 font-sans">
            How <span className="text-gradient-purple">SynthData AI</span> works in 4 simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {steps.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="aquafi-card p-6 rounded-3xl border border-purple-500/25 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-extrabold font-mono text-[#c084fc]">{item.step}</span>
                    <div className="p-2.5 bg-[#a855f7]/20 rounded-2xl border border-purple-500/30">
                      <IconComponent className="w-5 h-5 text-[#c084fc]" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-purple-200/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
