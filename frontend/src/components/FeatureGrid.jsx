import React from 'react';
import { Sparkles, ShieldCheck, Cpu, SlidersHorizontal, FileSpreadsheet, ArrowRight, ShieldAlert } from 'lucide-react';

export default function FeatureGrid() {
  const features = [
    {
      icon: Sparkles,
      color: 'text-[#f4a261]',
      bgColor: 'bg-[#f4a261]/15 border-[#f4a261]/30',
      title: 'AI Schema Architecture',
      description: 'Gemini AI analyzes natural-language requirements to dynamically engineer schema fields, data types, and realistic domain distributions.'
    },
    {
      icon: ShieldAlert,
      color: 'text-amber-300',
      bgColor: 'bg-amber-400/15 border-amber-400/30',
      title: '10+ Edge-Case Failure Injection',
      description: 'Inject rare boundary violations, extreme numerical outliers, missingness, duplicate keys, and semantic contradictions on demand.'
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-300',
      bgColor: 'bg-emerald-400/15 border-emerald-400/30',
      title: 'Automated Data Quality Audit',
      description: 'Continuous validation producing 0-100 Quality Scorecards, Letter Grades (A+ to F), and granular diagnostic audit logs.'
    },
    {
      icon: Cpu,
      color: 'text-sky-300',
      bgColor: 'bg-sky-400/15 border-sky-400/30',
      title: 'ML Robustness Stress Test',
      description: 'Train Scikit-Learn models on clean data and measure real-time accuracy, precision, recall, and F1 score drop under failure stress.'
    },
    {
      icon: SlidersHorizontal,
      color: 'text-rose-300',
      bgColor: 'bg-rose-400/15 border-rose-400/30',
      title: 'What-If Scenario Simulator',
      description: 'Programmatically simulate severe weather surges, system delays, and telemetry spikes without burning AI token quota.'
    },
    {
      icon: FileSpreadsheet,
      color: 'text-[#e88d72]',
      bgColor: 'bg-[#e88d72]/15 border-[#e88d72]/30',
      title: 'CSV Export & REST API',
      description: 'One-click CSV exports, full FastAPI REST backend endpoints, and seed controls for 100% reproducible synthetic datasets.'
    }
  ];

  return (
    <section id="features-section" className="mb-20">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-4 py-1.5 rounded-full aquafi-pill text-[#e9d5ff] text-xs font-bold uppercase tracking-wider border border-purple-500/30 shadow-lg">
          Engine Capabilities
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4 font-sans">
          Everything you need for <span className="text-gradient-purple">bulletproof AI models</span>
        </h2>
        <p className="text-sm text-purple-200/80 mt-3 font-sans">
          Stop waiting for rare production bugs. Generate comprehensive edge cases programmatically and harden your pipelines before deployment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const IconComponent = feat.icon;
          return (
            <div
              key={idx}
              className="aquafi-card p-7 rounded-[32px] flex flex-col justify-between group cursor-pointer border border-purple-500/25 hover:border-purple-400/60"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${feat.bgColor} border flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.3)]`}>
                  <IconComponent className={`w-6 h-6 ${feat.color} stroke-[2.5]`} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-[#c084fc] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-purple-200/80 leading-relaxed mt-2.5">
                  {feat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-purple-500/20 flex items-center text-xs font-semibold text-purple-300/70 group-hover:text-[#c084fc] transition-colors">
                <span>Learn capability</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
