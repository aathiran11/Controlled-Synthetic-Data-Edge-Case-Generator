import React, { useState } from 'react';
import { SlidersHorizontal, Play, RefreshCw, Cpu, ArrowRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function WhatIfScenario({ onSimulate, scenarioData, loading, activeDomain, numRows }) {
  const [scenarioType, setScenarioType] = useState('severe_weather');
  const [intensityPct, setIntensityPct] = useState(25);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSimulate) {
      onSimulate({ scenarioType, intensityPct });
    }
  };

  const chartData = scenarioData && scenarioData.comparison ? [
    {
      metric: 'Edge Cases',
      Baseline: scenarioData.baseline_metrics.edge_case_count,
      WhatIfScenario: scenarioData.scenario_metrics.edge_case_count
    },
    {
      metric: 'Quality Score (/100)',
      Baseline: scenarioData.baseline_metrics.quality_score,
      WhatIfScenario: scenarioData.scenario_metrics.quality_score
    },
    {
      metric: 'ML F1 Score (%)',
      Baseline: +(scenarioData.baseline_metrics.ml_f1_score * 100).toFixed(1),
      WhatIfScenario: +(scenarioData.scenario_metrics.ml_f1_score * 100).toFixed(1)
    }
  ] : [];

  return (
    <div id="what-if-section" className="aquafi-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl mb-12 relative overflow-hidden">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-purple-500/20 mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#a855f7]/20 border border-purple-500/30 rounded-2xl text-[#c084fc]">
            <SlidersHorizontal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">7. What-If Stress Scenario Simulator</h2>
            <p className="text-xs text-purple-200/70">
              Simulate operational disruptions and system failure spikes programmatically using the Python engine.
            </p>
          </div>
        </div>

        <span className="px-3.5 py-1 rounded-full bg-[#c084fc]/20 border border-purple-500/30 text-[#e9d5ff] text-xs font-bold uppercase tracking-wider">
          Stress Simulator
        </span>
      </div>

      {/* Scenario Controls Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-2 uppercase tracking-wider">
              Select What-If Scenario Type
            </label>
            <select
              value={scenarioType}
              onChange={(e) => setScenarioType(e.target.value)}
              className="w-full bg-[#130a2a]/90 border border-purple-500/30 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#c084fc]"
            >
              <option value="severe_weather">Severe Weather & Vehicle Failures</option>
              <option value="increase_edge_cases">Edge-Case Ratio Surge (+%)</option>
              <option value="increase_missing">Missing Operational Values Spike</option>
              <option value="increase_outliers">Extreme Outlier Spikes</option>
              <option value="increase_delays">Systemic Logistics Delay Surge</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold text-purple-200 uppercase tracking-wider">Scenario Intensity / Surge</label>
              <span className="text-xs font-mono font-bold text-[#c084fc]">+{intensityPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="5"
              value={intensityPct}
              onChange={(e) => setIntensityPct(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-950 rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-aquafi-primary py-3 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#12072b]" />
                  <span>Simulating Disruptions...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#12072b] text-[#12072b]" />
                  <span>Simulate What-If Scenario</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Results View */}
      {scenarioData && scenarioData.comparison && (
        <div className="space-y-6">
          
          <div className="aquafi-card p-5 rounded-3xl border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-purple-200/60 uppercase font-semibold tracking-wider">Scenario Verdict</span>
              <h3 className="text-base font-bold text-white mt-0.5">{scenarioData.scenario_label} (+{scenarioData.intensity_pct}% Surge)</h3>
            </div>
            <div className="px-4 py-2 rounded-full bg-[#c084fc]/20 border border-[#c084fc]/40 text-[#e9d5ff] font-bold text-xs uppercase tracking-wide">
              {scenarioData.robustness_verdict}
            </div>
          </div>

          {/* Before vs After Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Edge Cases Card */}
            <div className="aquafi-card p-5 rounded-3xl border border-purple-500/30">
              <span className="text-xs text-purple-200/60 font-semibold uppercase tracking-wider">Edge Cases Count</span>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-[11px] text-amber-200/50 block">Baseline</span>
                  <span className="text-xl font-extrabold text-amber-100 font-mono">
                    {scenarioData.baseline_metrics.edge_case_count}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-200/40" />
                <div className="text-right">
                  <span className="text-[11px] text-[#ff851a] block">What-If</span>
                  <span className="text-xl font-extrabold text-[#ff851a] font-mono">
                    {scenarioData.scenario_metrics.edge_case_count}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#ff851a] mt-3 border-t border-[#331709] pt-2 font-mono">
                Change: +{scenarioData.comparison.edge_case_count.absolute_change} rows ({scenarioData.comparison.edge_case_count.percentage_change}%)
              </p>
            </div>

            {/* Quality Score Card */}
            <div className="glass-amber-card p-5 rounded-3xl border border-[#331709]">
              <span className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider">Data Quality Score</span>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-[11px] text-amber-200/50 block">Baseline</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">
                    {scenarioData.baseline_metrics.quality_score}/100
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-200/40" />
                <div className="text-right">
                  <span className="text-[11px] text-amber-400 block">What-If</span>
                  <span className="text-xl font-extrabold text-amber-400 font-mono">
                    {scenarioData.scenario_metrics.quality_score}/100
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-amber-400 mt-3 border-t border-[#331709] pt-2 font-mono">
                Drop: {scenarioData.comparison.quality_score.absolute_change} pts ({scenarioData.comparison.quality_score.percentage_change}%)
              </p>
            </div>

            {/* ML F1 Score Card */}
            <div className="glass-amber-card p-5 rounded-3xl border border-[#331709]">
              <span className="text-xs text-amber-200/60 font-semibold uppercase tracking-wider">ML Model F1 Score</span>
              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-[11px] text-amber-200/50 block">Baseline</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">
                    {(scenarioData.baseline_metrics.ml_f1_score * 100).toFixed(1)}%
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-200/40" />
                <div className="text-right">
                  <span className="text-[11px] text-rose-400 block">What-If</span>
                  <span className="text-xl font-extrabold text-rose-400 font-mono">
                    {(scenarioData.scenario_metrics.ml_f1_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-rose-400 mt-3 border-t border-[#331709] pt-2 font-mono">
                Drop: {(scenarioData.comparison.ml_f1_score.absolute_change * 100).toFixed(1)}% ({scenarioData.comparison.ml_f1_score.percentage_change}% drop)
              </p>
            </div>

          </div>

          {/* Recharts Comparison Chart */}
          <div className="glass-amber-card p-6 rounded-3xl border border-[#331709]">
            <h3 className="text-xs font-bold text-amber-100 mb-5 flex items-center space-x-2 uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-[#ff7300]" />
              <span>Baseline vs What-If Scenario Impact</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <XAxis dataKey="metric" tick={{ fill: '#fdba74', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#fdba74', fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#140803', borderColor: '#331709', borderRadius: '12px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                  <Bar dataKey="Baseline" fill="#ff7300" radius={[6, 6, 0, 0]} name="Before Baseline" />
                  <Bar dataKey="WhatIfScenario" fill="#f43f5e" radius={[6, 6, 0, 0]} name="What-If Scenario" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
