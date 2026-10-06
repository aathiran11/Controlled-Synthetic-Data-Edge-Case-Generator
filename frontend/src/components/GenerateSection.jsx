import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RefreshCw,
  SlidersHorizontal,
  AlertCircle,
  Database,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Zap,
  Activity
} from 'lucide-react';

export default function GenerateSection({ onGenerate, loading, error }) {
  const [prompt, setPrompt] = useState(
    'Generate 5000 logistics records with delivery delays, different vehicle types, weather conditions, and 10% rare failure cases.'
  );
  const [domain, setDomain] = useState('logistics');
  const [numRows, setNumRows] = useState(5000);
  const [edgeCasePct, setEdgeCasePct] = useState(10);
  const [seed, setSeed] = useState(42);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onGenerate) {
      onGenerate({ prompt, domain, numRows, edgeCasePct, seed });
    }
  };

  const handlePresetSelect = (presetDomain, samplePrompt) => {
    setDomain(presetDomain);
    setPrompt(samplePrompt);
  };

  return (
    <div id="generate-section" className="relative mb-10">
      
      {/* Studio Generator Control Panel styled in AquaFi Deep Violet Theme */}
      <div className="aquafi-panel rounded-[36px] p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Spotlight Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#a855f7]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-purple-500/20 mb-6 gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-tr from-[#a855f7] to-[#c084fc] rounded-2xl text-[#12072b] shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-sans">
                AI Schema Generator & Synthetic Pipeline Controls
              </h2>
              <p className="text-xs text-purple-200/80 mt-0.5 font-sans">
                Formulate requirements in natural language or pick a domain preset. Gemini AI plans schema; Python engine generates synthetic data with controlled edge cases.
              </p>
            </div>
          </div>

          {/* Quick Domain Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 relative z-10">
            {[
              { id: 'logistics', label: 'Logistics', prompt: 'Generate 5000 logistics records with delivery delays, different vehicle types, weather conditions, and 10% rare failure cases.' },
              { id: 'ecommerce', label: 'E-Commerce', prompt: 'Generate 3000 e-commerce order records with discount surges, payment methods, and 15% edge case anomalies.' },
              { id: 'finance', label: 'Finance', prompt: 'Generate 2000 financial banking records with credit scores, account balances, and 12% fraud risk edge cases.' },
              { id: 'healthcare', label: 'Healthcare', prompt: 'Generate 2000 healthcare patient records with vitals, oxygen saturation, and 10% physiological edge cases.' },
              { id: 'iot', label: 'IoT Sensors', prompt: 'Generate 4000 industrial IoT telemetry records with temperature sensors, battery levels, and 15% device failures.' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePresetSelect(p.id, p.prompt)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  domain === p.id
                    ? 'bg-[#c084fc] text-[#12072b] shadow-md shadow-purple-500/40 font-extrabold'
                    : 'aquafi-pill text-white/80 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* Natural Language Prompt Input */}
          <div>
            <label className="block text-xs font-bold text-purple-200 mb-2 uppercase tracking-wider">
              Natural-Language Requirements Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              required
              className="w-full bg-[#130a2a]/90 border border-purple-500/30 focus:border-[#c084fc] rounded-2xl p-4.5 text-sm text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-[#c084fc]/30 transition-all font-sans"
              placeholder="Describe your dataset requirements in plain English..."
            />
          </div>

          {/* Configuration Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div>
              <label className="block text-xs font-bold text-purple-200 mb-2 uppercase tracking-wider">
                Domain Template
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-[#130a2a]/90 border border-purple-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#c084fc]"
              >
                <option value="logistics">Logistics & Supply Chain</option>
                <option value="ecommerce">E-Commerce & Orders</option>
                <option value="finance">Finance & Banking</option>
                <option value="healthcare">Healthcare & Vitals</option>
                <option value="iot">IoT Telemetry & Sensors</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-purple-200 uppercase tracking-wider">Target Row Count</label>
                <span className="text-xs font-mono font-bold text-[#c084fc]">{numRows.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={numRows}
                onChange={(e) => setNumRows(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-purple-200 uppercase tracking-wider">Edge-Case Injection Ratio</label>
                <span className="text-xs font-mono font-bold text-[#e9d5ff]">{edgeCasePct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={edgeCasePct}
                onChange={(e) => setEdgeCasePct(parseInt(e.target.value))}
                className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-200 mb-2 uppercase tracking-wider">
                Random Seed
              </label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="w-full bg-[#130a2a]/90 border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c084fc] font-mono"
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-aquafi-primary px-9 py-4 text-xs font-extrabold tracking-wide uppercase flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#12072b]" />
                  <span>Gemini AI Planning & Generating Data...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#12072b] text-[#12072b]" />
                  <span>Generate Dataset & Run Pipeline</span>
                </>
              )}
            </button>
          </div>

        </form>

        {error && (
          <div className="mt-4 flex items-start space-x-3 bg-rose-500/15 border border-rose-500/30 p-4 rounded-2xl text-rose-200 text-xs">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
            <div>
              <h4 className="font-semibold text-white">Pipeline Request Warning</h4>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
