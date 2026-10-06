import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, CheckCircle2, FileSearch } from 'lucide-react';

const GRADE_STYLES = {
  'A+': 'bg-[#c084fc]/25 text-[#e9d5ff] border-[#c084fc]/60 shadow-[0_0_20px_rgba(192,132,252,0.4)]',
  'A': 'bg-[#c084fc]/25 text-[#e9d5ff] border-[#c084fc]/60 shadow-[0_0_20px_rgba(192,132,252,0.4)]',
  'B': 'bg-purple-500/20 text-purple-200 border-purple-500/40',
  'C': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  'D': 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  'F': 'bg-rose-500/20 text-rose-300 border-rose-500/40'
};

const SEVERITY_BADGES = {
  low: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
  medium: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  high: 'bg-[#c084fc]/20 text-[#c084fc] border-[#c084fc]/40',
  critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
};

export default function QualityValidation({ validationData, loading }) {
  if (loading) {
    return (
      <div className="aquafi-panel rounded-3xl p-8 border border-purple-500/30 shadow-2xl mb-12 text-center py-14">
        <ShieldCheck className="w-10 h-10 animate-bounce text-[#c084fc] mx-auto mb-4" />
        <p className="text-xs text-purple-200 font-semibold uppercase tracking-wider">Evaluating Schema Integrity & Data Quality Audits...</p>
      </div>
    );
  }

  if (!validationData) return null;

  const { quality_score, quality_grade, metrics, issues, summary_text } = validationData;

  return (
    <div className="aquafi-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl mb-12">
      
      <div className="flex items-center justify-between pb-6 border-b border-purple-500/20 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">5. Data Quality & Schema Audit Scorecard</h2>
            <p className="text-xs text-purple-200/70">
              Evaluated across schema rules, numeric ranges, missing values, duplicates, contradictions, outliers, and PII patterns.
            </p>
          </div>
        </div>

        {/* Grade Badge */}
        <div className={`px-5 py-2.5 rounded-full border text-center font-extrabold text-xl font-mono shadow-lg ${GRADE_STYLES[quality_grade] || GRADE_STYLES['A']}`}>
          Grade {quality_grade}
        </div>
      </div>

      {/* Main Score & Audit Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Score Card */}
        <div className="aquafi-card p-6 rounded-3xl border border-purple-500/25 flex flex-col justify-between items-center text-center">
          <span className="text-xs text-amber-200/70 uppercase font-semibold tracking-wider">Overall Quality Rating</span>
          <div className="relative my-4 flex items-center justify-center">
            <div className="text-5xl font-extrabold font-mono text-white">
              {quality_score}
              <span className="text-lg text-amber-200/40 font-normal">/100</span>
            </div>
          </div>
          <p className="text-[11px] text-amber-100 bg-[#140803] px-3.5 py-1.5 rounded-full border border-white/10">
            {summary_text}
          </p>
        </div>

        {/* Metrics Breakdown */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
            <span className="text-[11px] text-amber-200/60 font-medium uppercase tracking-wider">Missing Values</span>
            <h4 className="text-2xl font-bold text-amber-400 font-mono mt-1">{metrics?.missing_value_count || 0}</h4>
          </div>

          <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
            <span className="text-[11px] text-amber-200/60 font-medium uppercase tracking-wider">Duplicate Keys</span>
            <h4 className="text-2xl font-bold text-orange-400 font-mono mt-1">{metrics?.duplicate_record_count || 0}</h4>
          </div>

          <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
            <span className="text-[11px] text-amber-200/60 font-medium uppercase tracking-wider">Range Violations</span>
            <h4 className="text-2xl font-bold text-rose-400 font-mono mt-1">{metrics?.range_violation_count || 0}</h4>
          </div>

          <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
            <span className="text-[11px] text-amber-200/60 font-medium uppercase tracking-wider">Contradictions</span>
            <h4 className="text-2xl font-bold text-amber-300 font-mono mt-1">{metrics?.contradiction_count || 0}</h4>
          </div>

          <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
            <span className="text-[11px] text-amber-200/60 font-medium uppercase tracking-wider">Outliers (&gt;3.5 σ)</span>
            <h4 className="text-2xl font-bold text-[#ff7300] font-mono mt-1">{metrics?.outlier_count || 0}</h4>
          </div>

          <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
            <span className="text-[11px] text-amber-200/60 font-medium uppercase tracking-wider">PII Pattern Flags</span>
            <h4 className="text-2xl font-bold text-emerald-400 font-mono mt-1">{metrics?.pii_pattern_count || 0}</h4>
          </div>
        </div>

      </div>

      {/* Issues Diagnostic List */}
      <div>
        <h3 className="text-xs font-bold text-amber-100 mb-4 flex items-center space-x-2 uppercase tracking-wider">
          <FileSearch className="w-4 h-4 text-[#ff7300]" />
          <span>Diagnostic Issues Audit Log ({issues?.length || 0} items)</span>
        </h3>

        {!issues || issues.length === 0 ? (
          <div className="bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-2xl text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-semibold">Zero quality warnings or schema errors detected. Dataset is clean and compliant.</span>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
            {issues.map((iss, idx) => (
              <div
                key={idx}
                className="bg-[#180a03] p-3.5 rounded-2xl border border-[#331709] flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${SEVERITY_BADGES[iss.severity] || SEVERITY_BADGES['medium']}`}>
                    {iss.severity}
                  </span>
                  <span className="font-mono text-[#ff851a] font-bold">{iss.column}</span>
                  <span className="text-amber-100/90">{iss.message}</span>
                </div>
                <span className="text-amber-200/50 font-mono text-[11px]">{iss.count} rows</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
