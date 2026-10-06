import React from 'react';
import { AlertTriangle, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const TYPE_COLORS = {
  boundary_violation: '#c084fc', // purple
  missing_value: '#e9d5ff',     // lavender
  invalid_value: '#f472b6',     // pink
  outlier: '#a855f7',           // violet
  duplicate: '#d8b4fe',         // soft purple
  contradiction: '#38bdf8',     // sky blue
  domain_failure: '#9333ea'      // deep purple
};

const SEVERITY_COLORS = {
  low: '#d8b4fe',
  medium: '#c084fc',
  high: '#a855f7',
  critical: '#f472b6'
};

export default function EdgeCaseAnalysis({ summary }) {
  if (!summary || !summary.breakdown_by_type) {
    return null;
  }

  const typeData = Object.entries(summary.breakdown_by_type).map(([key, value]) => ({
    name: key.replace('_', ' '),
    raw_key: key,
    count: value
  }));

  const severityData = Object.entries(summary.breakdown_by_severity || {})
    .filter(([key]) => key !== 'none')
    .map(([key, value]) => ({
      name: key.toUpperCase(),
      severity: key,
      count: value
    }));

  return (
    <div id="edge-cases-section" className="aquafi-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl mb-12 pt-6">
      
      <div className="flex items-center justify-between pb-6 border-b border-purple-500/20 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">3. Edge-Case & Failure Scenario Analysis</h2>
            <p className="text-xs text-amber-200/70">
              Distribution of {summary.total_edge_cases} injected anomalies across failure categories ({summary.edge_case_percentage}% density).
            </p>
          </div>
        </div>
      </div>

      {/* Severity Badges Summary */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-xs text-amber-200/70 font-semibold uppercase tracking-wider">Severity Distribution:</span>
        {severityData.map((sev) => (
          <span
            key={sev.severity}
            className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-bold border"
            style={{
              borderColor: `${SEVERITY_COLORS[sev.severity]}50`,
              backgroundColor: `${SEVERITY_COLORS[sev.severity]}20`,
              color: SEVERITY_COLORS[sev.severity]
            }}
          >
            <span>{sev.name}:</span>
            <span className="font-mono text-sm">{sev.count}</span>
          </span>
        ))}
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Bar Chart: Breakdown by Edge-Case Type */}
        <div className="glass-amber-card p-6 rounded-3xl border border-[#331709]">
          <h3 className="text-xs font-extrabold text-amber-100 mb-5 flex items-center space-x-2 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-[#ff7300]" />
            <span>Edge-Case Count by Anomaly Type</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#fdba74', fontSize: 10 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fill: '#fdba74', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#140803', borderColor: '#331709', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ color: '#ff7300' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[entry.raw_key] || '#ff7300'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Severity Ratio */}
        <div className="glass-amber-card p-6 rounded-3xl border border-[#331709]">
          <h3 className="text-xs font-extrabold text-amber-100 mb-5 flex items-center space-x-2 uppercase tracking-wider">
            <PieIcon className="w-4 h-4 text-amber-400" />
            <span>Severity Ratio Distribution</span>
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {severityData.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#ff7300'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#140803', borderColor: '#331709', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
