import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, CheckCircle2, XCircle, Server, Code, ShieldCheck } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

export default function HealthCheckCard({ onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [error, setError] = useState(null);

  const runHealthCheck = async () => {
    setLoading(true);
    setError(null);
    const result = await checkBackendHealth();

    if (result.success) {
      setHealthData(result.data);
      if (onStatusChange) onStatusChange(true);
    } else {
      setError(result.error);
      if (onStatusChange) onStatusChange(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl max-w-2xl mx-auto my-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">API Health Diagnostics</h2>
            <p className="text-xs text-slate-400">Test backend route `/api/health`</p>
          </div>
        </div>

        <button
          onClick={runHealthCheck}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Ping...' : 'Ping API'}</span>
        </button>
      </div>

      <div className="mt-5">
        {loading && (
          <div className="py-8 text-center text-slate-400 text-sm flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-indigo-400" />
            <span>Connecting to FastAPI backend...</span>
          </div>
        )}

        {!loading && healthData && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-300">Connection Successful</h3>
                <p className="text-xs text-emerald-400/80">{healthData.message}</p>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-400 font-bold">{healthData.status}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-500">Service:</span>
                <span className="text-slate-200">{healthData.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-indigo-300">{healthData.timestamp}</span>
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start space-x-3 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-rose-400">
            <XCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-rose-300">Connection Failed</h3>
              <p className="text-xs text-rose-400/80 mt-1">{error}</p>
              <p className="text-xs text-slate-400 mt-2">
                Ensure the FastAPI server is running at <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">http://127.0.0.1:8000</code>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CORS Enabled for localhost:5173</span>
        </span>
        <span className="flex items-center space-x-1">
          <Code className="w-4 h-4 text-indigo-400" />
          <span>FastAPI + Vite React Stack</span>
        </span>
      </div>
    </div>
  );
}
