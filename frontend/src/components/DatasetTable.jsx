import React, { useState, useMemo } from 'react';
import { Table, Search, Download, Filter, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DatasetTable({ sampleData, columns }) {
  if (!sampleData || sampleData.length === 0) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'clean', 'edge'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Filter columns to display (hide metadata flags in primary data columns unless expanded)
  const displayCols = useMemo(() => {
    return (columns || Object.keys(sampleData[0] || {})).filter(
      (col) => !['is_edge_case', 'edge_case_type', 'edge_case_severity', 'edge_case_description'].includes(col)
    );
  }, [columns, sampleData]);

  // Filter records based on search query and filterType toggle
  const filteredData = useMemo(() => {
    return sampleData.filter((row) => {
      // 1. Filter type check
      if (filterType === 'clean' && row.is_edge_case) return false;
      if (filterType === 'edge' && !row.is_edge_case) return false;

      // 2. Search query check
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return Object.values(row).some((val) =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(query)
      );
    });
  }, [sampleData, searchQuery, filterType]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleExportCSV = () => {
    if (!sampleData || sampleData.length === 0) return;
    const allHeaders = Object.keys(sampleData[0]);
    const csvRows = [
      allHeaders.join(','),
      ...sampleData.map((row) =>
        allHeaders
          .map((h) => {
            const val = row[h];
            if (val === null || val === undefined) return '""';
            return `"${String(val).replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `synthetic_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="aquafi-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl mb-12">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-purple-500/20 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-tr from-[#a855f7] to-[#c084fc] rounded-2xl text-[#12072b] shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Table className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">4. Interactive Dataset Preview</h2>
            <p className="text-xs text-purple-200/70">
              Showing {filteredData.length.toLocaleString()} of {sampleData.length.toLocaleString()} records. Highlighted rows indicate edge-case anomalies.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="btn-aquafi-primary px-5 py-2.5 text-xs font-extrabold flex items-center space-x-2 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Toggle Filters matching pill style */}
        <div className="flex items-center space-x-1 bg-[#130a2a] p-1.5 rounded-full border border-purple-500/30 text-xs w-full sm:w-auto">
          <button
            onClick={() => { setFilterType('all'); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-[#c084fc] text-[#12072b] shadow font-extrabold' : 'text-purple-200/70 hover:text-white'
            }`}
          >
            All Records ({sampleData.length})
          </button>
          <button
            onClick={() => { setFilterType('clean'); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              filterType === 'clean' ? 'bg-emerald-400 text-[#12072b] shadow font-extrabold' : 'text-purple-200/70 hover:text-white'
            }`}
          >
            Clean Only
          </button>
          <button
            onClick={() => { setFilterType('edge'); setCurrentPage(1); }}
            className={`px-4 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
              filterType === 'edge' ? 'bg-[#c084fc] text-[#12072b] shadow font-extrabold' : 'text-purple-200/70 hover:text-white'
            }`}
          >
            Edge Cases
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-300/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search records..."
            className="w-full bg-[#130a2a]/90 border border-purple-500/30 rounded-full pl-10 pr-4 py-2 text-xs text-purple-100 placeholder-purple-300/40 focus:outline-none focus:border-[#c084fc]"
          />
        </div>
      </div>

      {/* Dataset Table */}
      <div className="overflow-x-auto rounded-2xl border border-purple-500/30">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#130a2a] text-purple-200 font-bold border-b border-purple-500/20 uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4 w-12 text-center">Status</th>
              {displayCols.map((col) => (
                <th key={col} className="py-3.5 px-4 font-mono text-purple-200">
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
              <th className="py-3.5 px-4 text-purple-200">Edge-Case Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/20 font-mono">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={displayCols.length + 2} className="py-8 text-center text-purple-200/50 text-xs font-sans">
                  No matching dataset records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const isEdge = row.is_edge_case;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-[#1a0e3b] ${
                      isEdge ? 'bg-red-950/30 hover:bg-red-900/40 border-l-4 border-l-red-500' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      {isEdge ? (
                        <span className="inline-flex p-1.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.6)]" title={row.edge_case_type}>
                          <AlertCircle className="w-4 h-4 text-red-400 stroke-[2.5]" />
                        </span>
                      ) : (
                        <span className="inline-flex p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                        </span>
                      )}
                    </td>

                    {displayCols.map((col) => (
                      <td key={col} className="py-3 px-4 text-purple-100/90 whitespace-nowrap">
                        {row[col] === null || row[col] === undefined ? (
                          <span className="text-red-400/80 italic font-mono bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">null</span>
                        ) : (
                          String(row[col])
                        )}
                      </td>
                    ))}

                    <td className="py-3 px-4 text-xs font-sans whitespace-nowrap">
                      {isEdge ? (
                        <div className="flex flex-col">
                          <span className="text-red-400 font-bold">{row.edge_case_description}</span>
                          <span className="text-[10px] text-red-300/80 uppercase font-mono tracking-wider font-semibold">
                            Type: {row.edge_case_type} | Severity: {row.edge_case_severity}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-200/40 text-[11px]">Clean</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-5 text-xs text-amber-200/70">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(parseInt(e.target.value)); setCurrentPage(1); }}
            className="bg-[#140803] border border-[#331709] rounded-lg px-2.5 py-1 text-amber-100 focus:outline-none focus:border-[#ff7300]"
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <span>
            Page <strong className="text-white font-mono">{currentPage}</strong> of <strong className="text-white font-mono">{totalPages}</strong>
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-[#1c0d05] hover:bg-[#291307] disabled:opacity-40 rounded-xl border border-white/10 text-amber-100 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-[#1c0d05] hover:bg-[#291307] disabled:opacity-40 rounded-xl border border-white/10 text-amber-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
