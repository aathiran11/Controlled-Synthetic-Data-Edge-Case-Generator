import React from 'react';
import { Cpu, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function MLStressTestCard({ mlData, loading, onRunML }) {
  if (loading) {
    return (
      <div id="ml-section" className="aquafi-panel rounded-3xl p-8 border border-purple-500/30 shadow-2xl mb-12 text-center py-14">
        <Cpu className="w-10 h-10 animate-spin text-[#c084fc] mx-auto mb-4" />
        <p className="text-xs text-purple-200 font-semibold uppercase tracking-wider">Training Scikit-Learn Model & Running ML Stress Test...</p>
      </div>
    );
  }

  if (!mlData || !mlData.comparison) {
    return (
      <div id="ml-section" className="aquafi-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">6. Downstream ML Robustness Stress Test</h2>
          <p className="text-xs text-purple-200/70">Train baseline machine learning model on clean data and evaluate accuracy degradation under edge-case stress.</p>
        </div>
        <button
          onClick={onRunML}
          className="btn-aquafi-primary px-6 py-3 text-xs font-bold flex items-center space-x-2 cursor-pointer"
        >
          <Cpu className="w-4 h-4 stroke-[2.5]" />
          <span>Run ML Stress Test</span>
        </button>
      </div>
    );
  }

  const { comparison, robustness_rating, model_type, target_column, domain } = mlData;
  const { clean_data_metrics, edge_case_metrics, f1_drop, degradation_pct } = comparison;

  // Chart data for Recharts grouped bar chart
  const chartData = [
    {
      metric: 'Accuracy',
      Normal: (clean_data_metrics.accuracy * 100).toFixed(1),
      EdgeCase: (edge_case_metrics.accuracy * 100).toFixed(1)
    },
    {
      metric: 'Precision',
      Normal: (clean_data_metrics.precision * 100).toFixed(1),
      EdgeCase: (edge_case_metrics.precision * 100).toFixed(1)
    },
    {
      metric: 'Recall',
      Normal: (clean_data_metrics.recall * 100).toFixed(1),
      EdgeCase: (edge_case_metrics.recall * 100).toFixed(1)
    },
    {
      metric: 'F1 Score',
      Normal: (clean_data_metrics.f1_score * 100).toFixed(1),
      EdgeCase: (edge_case_metrics.f1_score * 100).toFixed(1)
    }
  ];

  return (
    <div id="ml-section" className="aquafi-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl mb-12 pt-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-purple-500/20 mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#a855f7]/20 border border-purple-500/30 rounded-2xl text-[#c084fc]">
            <Cpu className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">6. Downstream ML Robustness Stress Test</h2>
            <p className="text-xs text-purple-200/70">
              Evaluated on Scikit-Learn <code className="text-[#c084fc]">{model_type}</code> predicting target <code className="text-[#c084fc]">{target_column}</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onRunML}
            className="aquafi-pill px-5 py-2.5 rounded-full text-xs font-bold text-white hover:text-white flex items-center space-x-2 cursor-pointer hover:border-purple-400/60 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#c084fc]" />
            <span>Re-run Test</span>
          </button>
        </div>
      </div>

      {/* Robustness Verdict Hero Banner */}
      <div className="aquafi-card p-6 rounded-3xl border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-rose-500/15 rounded-2xl text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-[11px] text-purple-200/70 uppercase font-semibold tracking-wider">Model Vulnerability Rating</span>
            <h3 className="text-xl font-extrabold text-white mt-0.5">{robustness_rating}</h3>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-right">
          <div>
            <span className="text-[11px] text-purple-200/70 uppercase font-semibold">F1 Absolute Drop</span>
            <p className="text-2xl font-extrabold text-rose-400 font-mono">-{f1_drop}</p>
          </div>
          <div>
            <span className="text-[11px] text-purple-200/70 uppercase font-semibold">F1 Degradation</span>
            <p className="text-2xl font-extrabold text-rose-400 font-mono">-{degradation_pct}%</p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#130a2a] p-4.5 rounded-2xl border border-purple-500/20">
          <span className="text-[11px] text-purple-200/60 font-semibold uppercase tracking-wider">Accuracy</span>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-purple-200/60">Normal:</span>
              <span className="font-bold text-[#c084fc] font-mono">{(clean_data_metrics.accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-purple-200/60">Edge-Case:</span>
              <span className="font-bold text-rose-400 font-mono">{(edge_case_metrics.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
          <span className="text-[11px] text-amber-200/60 font-semibold uppercase tracking-wider">Precision</span>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-200/60">Normal:</span>
              <span className="font-bold text-[#ff851a] font-mono">{(clean_data_metrics.precision * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-200/60">Edge-Case:</span>
              <span className="font-bold text-rose-400 font-mono">{(edge_case_metrics.precision * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
          <span className="text-[11px] text-amber-200/60 font-semibold uppercase tracking-wider">Recall</span>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-200/60">Normal:</span>
              <span className="font-bold text-[#ff851a] font-mono">{(clean_data_metrics.recall * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-200/60">Edge-Case:</span>
              <span className="font-bold text-rose-400 font-mono">{(edge_case_metrics.recall * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#180a03] p-4.5 rounded-2xl border border-[#331709]">
          <span className="text-[11px] text-amber-200/60 font-semibold uppercase tracking-wider">F1 Score</span>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-200/60">Normal:</span>
              <span className="font-bold text-[#ff851a] font-mono">{(clean_data_metrics.f1_score * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-200/60">Edge-Case:</span>
              <span className="font-bold text-rose-400 font-mono">{(edge_case_metrics.f1_score * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Grouped Comparison Bar Chart */}
      <div className="glass-amber-card p-6 rounded-3xl border border-[#331709]">
        <h3 className="text-xs font-bold text-amber-100 mb-5 flex items-center space-x-2 uppercase tracking-wider">
          <BarChart2 className="w-4 h-4 text-[#ff7300]" />
          <span>Normal vs Edge-Case Model Performance Comparison (%)</span>
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <XAxis dataKey="metric" tick={{ fill: '#fdba74', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#fdba74', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#140803', borderColor: '#331709', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
              <Bar dataKey="Normal" fill="#ff7300" radius={[6, 6, 0, 0]} name="Normal Test Data" />
              <Bar dataKey="EdgeCase" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Edge-Case Test Data" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
