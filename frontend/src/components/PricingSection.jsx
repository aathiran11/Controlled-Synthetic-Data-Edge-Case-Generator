import React from 'react';
import { Check, Sparkles, Zap, Shield } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter AI',
      price: '$0',
      period: 'forever free',
      description: 'Ideal for individual data scientists & prototyping synthetic schemas.',
      features: [
        '5,000 synthetic rows per batch',
        'Basic edge-case injection (10%)',
        'Standard domain presets (Logistics, E-Com)',
        'Automated Data Quality Scorecard',
        'Export CSV datasets'
      ],
      cta: 'Start Free Studio',
      popular: false,
      buttonStyle: 'btn-glass-dark'
    },
    {
      name: 'Pro ML Architect',
      price: '$49',
      period: 'per month',
      description: 'For AI teams needing deep edge-case testing & ML stress evaluation.',
      features: [
        'Up to 100,000 synthetic rows per batch',
        'Advanced Edge-Case Injection (5%–50%)',
        'All 5 Domain Presets + Custom Gemini Prompts',
        'Downstream ML Robustness Stress Testing',
        'What-If Disruption Simulator Engine',
        'FastAPI REST API key integration'
      ],
      cta: 'Get Pro Access ↗',
      popular: true,
      buttonStyle: 'btn-glass-lime'
    },
    {
      name: 'Enterprise AI',
      price: 'Custom',
      period: 'tailored SLA',
      description: 'Dedicated infrastructure, custom LLM fine-tuning, and on-prem deployment.',
      features: [
        'Unlimited synthetic data generation',
        'Custom schema Pydantic definitions',
        'Private LLM endpoint connection',
        'On-premises / Private Cloud deployment',
        'SOC2 & HIPAA compliant data sanitization',
        'Dedicated 24/7 AI Engineer support'
      ],
      cta: 'Contact Enterprise',
      popular: false,
      buttonStyle: 'btn-glass-dark'
    }
  ];

  return (
    <section id="pricing-section" className="mb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="px-4 py-1.5 rounded-full glass-pill-ultra text-[#c5fc34] text-xs font-bold uppercase tracking-wider border border-[#c5fc34]/30">
          Flexible Pricing
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-4 font-display">
          Simple, transparent plans for <span className="text-[#c5fc34]">every AI team</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`glass-panel-ultra rounded-[40px] p-8 flex flex-col justify-between relative transition-all duration-300 ${
              plan.popular
                ? 'border-2 border-[#c5fc34] shadow-[0_0_50px_rgba(197,252,52,0.2)] bg-slate-900/80 scale-[1.03]'
                : 'border border-white/10'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#c5fc34] text-black text-[11px] font-extrabold uppercase tracking-widest shadow-md">
                Most Popular
              </span>
            )}

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                {plan.popular && <Sparkles className="w-5 h-5 text-[#c5fc34]" />}
              </div>

              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                {plan.description}
              </p>

              <div className="flex items-baseline space-x-1 mb-6">
                <span className="text-4xl font-extrabold text-white font-mono">{plan.price}</span>
                <span className="text-xs text-slate-400">/ {plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 text-xs text-slate-300">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start space-x-2.5">
                    <Check className="w-4 h-4 text-[#c5fc34] flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href="#studio-section"
              className={`w-full py-3.5 rounded-full text-xs font-bold text-center block cursor-pointer transition-all ${plan.buttonStyle}`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
