import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does Gemini AI plan the synthetic schema?',
      a: 'Gemini AI analyzes your natural language requirements prompt to design a custom JSON Generation Plan containing Pydantic-compatible schemas, realistic numerical ranges, realistic categorical choices, and edge-case injection specifications.'
    },
    {
      q: 'What types of edge-case anomalies can be injected?',
      a: 'The engine supports 10+ anomaly types including numerical boundary violations, missing values (nulls), invalid data types, extreme statistical outliers (>3.5 std dev), duplicate record keys, and domain-specific semantic contradictions.'
    },
    {
      q: 'How is the Data Quality Score calculated?',
      a: 'The Automated Validation Engine evaluates generated datasets across completeness, consistency, range constraints, duplicate rates, and PII patterns. Scores range from 0 to 100 with letter grades from A+ to F.'
    },
    {
      q: 'Can I test my ML models on synthetic datasets?',
      a: 'Yes! The ML Stress Testing module automatically trains Scikit-Learn models on clean synthetic records and measures real-time accuracy, precision, recall, and F1 score drop when evaluated against edge-case heavy datasets.'
    },
    {
      q: 'Is the dataset generation reproducible?',
      a: 'Absolutely. By specifying a Random Seed (e.g. seed=42), both Python synthetic generation rules and ML model train/test splits execute deterministically.'
    }
  ];

  return (
    <section id="faq-section" className="mb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="px-4 py-1.5 rounded-full glass-pill-ultra text-[#c5fc34] text-xs font-bold uppercase tracking-wider border border-[#c5fc34]/30">
          Frequently Asked Questions
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4 font-display">
          Got questions? <span className="text-[#c5fc34]">We've got answers.</span>
        </h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-panel-ultra rounded-3xl border border-white/10 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                className="w-full p-6 text-left flex items-center justify-between font-bold text-sm text-white hover:text-[#c5fc34] cursor-pointer transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <HelpCircle className="w-5 h-5 text-[#c5fc34] flex-shrink-0" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#c5fc34]' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
