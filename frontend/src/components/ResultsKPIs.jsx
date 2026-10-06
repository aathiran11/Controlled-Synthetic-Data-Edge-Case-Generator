import React from 'react';
import { Database, ShieldCheck, AlertTriangle, Layers, Sparkles } from 'lucide-react';

export default function ResultsKPIs({ datasetData, aiPlan }) {
  if (!datasetData) return null;

  const totalRows = datasetData.total_rows || 0;
  const cleanRows = datasetData.clean_rows_count || 0;
  const edgeRows = datasetData.edge_case_rows_count || 0;
  const domain = datasetData.domain || 'custom';
  const summaryText = aiPlan?.scenario_summary || `Generated ${totalRows.toLocaleString()} synthetic records for domain '${domain}'.`;

  return (
    <div id="results-section" className="mb-12 space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]"></span>
          <span>2. Dataset Generation Overview & KPIs</span>
        </h2>
        <span className="px-3.5 py-1 rounded-full bg-[#c084fc]/20 border border-[#c084fc]/30 text-[#e9d5ff] text-xs font-bold uppercase tracking-wider">
          Domain: {domain}
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Records */}
        <div className="aquafi-card p-6 rounded-3xl border border-purple-500/25 hover:border-[#c084fc]/50 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-200/70 font-semibold uppercase tracking-wider">Total Records</p>
            <h3 className="text-3xl font-extrabold text-[#fefefe] mt-1 font-mono">{totalRows.toLocaleString()}</h3>
            <p className="text-[11px] text-purple-200/50 mt-1">Generated Rows</p>
          </div>
          <div className="p-3.5 bg-[#a855f7]/20 rounded-2xl text-[#c084fc] border border-purple-500/30">
            <Database className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Clean Records */}
        <div className="aquafi-card p-6 rounded-3xl border border-purple-500/25 hover:border-emerald-400/50 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-200/70 font-semibold uppercase tracking-wider">Clean Records</p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{cleanRows.toLocaleString()}</h3>
            <p className="text-[11px] text-emerald-400/80 mt-1 font-mono">
              {totalRows > 0 ? ((cleanRows / totalRows) * 100).toFixed(1) : 0}% of dataset
            </p>
          </div>
          <div className="p-3.5 bg-emerald-500/15 rounded-2xl text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

        {/* Edge-Case Records */}
        <div className="aquafi-card p-6 rounded-3xl border border-red-500/30 hover:border-red-500/60 transition-all duration-300 flex items-center justify-between shadow-[0_0_20px_rgba(239,68,68,0.25)]">
          <div>
            <p className="text-xs text-red-300/80 font-semibold uppercase tracking-wider">Edge-Cases Injected</p>
            <h3 className="text-3xl font-extrabold text-red-400 mt-1 font-mono">{edgeRows.toLocaleString()}</h3>
            <p className="text-[11px] text-red-400/90 mt-1 font-mono font-bold">
              {totalRows > 0 ? ((edgeRows / totalRows) * 100).toFixed(1) : 0}% failure density
            </p>
          </div>
          <div className="p-3.5 bg-red-500/20 rounded-2xl text-red-400 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
        </div>

        {/* Schema Columns */}
        <div className="aquafi-card p-6 rounded-3xl border border-purple-500/25 hover:border-[#e9d5ff]/50 transition-all duration-300 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-200/70 font-semibold uppercase tracking-wider">Features / Columns</p>
            <h3 className="text-3xl font-extrabold text-[#e9d5ff] mt-1 font-mono">{datasetData.columns?.length || 0}</h3>
            <p className="text-[11px] text-purple-200/50 mt-1">Schema Fields</p>
          </div>
          <div className="p-3.5 bg-[#c084fc]/20 rounded-2xl text-[#e9d5ff] border border-purple-500/30">
            <Layers className="w-6 h-6 stroke-[2]" />
          </div>
        </div>

      </div>

      {/* Generation Summary Box */}
      <div className="aquafi-panel p-5 rounded-2xl border border-purple-500/30 flex items-start space-x-3.5 text-xs text-purple-200/90">
        <Sparkles className="w-5 h-5 text-[#c084fc] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-extrabold text-white uppercase tracking-wider">AI Generation Plan Context: </span>
          <span className="text-purple-200/80">{summaryText}</span>
        </div>
      </div>
    </div>
  );
}
