import React from 'react';
import { ArrowLeft, Sparkles, LayoutDashboard, Database } from 'lucide-react';
import GenerateSection from './GenerateSection';
import ResultsKPIs from './ResultsKPIs';
import EdgeCaseAnalysis from './EdgeCaseAnalysis';
import DatasetTable from './DatasetTable';
import QualityValidation from './QualityValidation';
import MLStressTestCard from './MLStressTestCard';
import WhatIfScenario from './WhatIfScenario';

export default function StudioView({
  onBackToLanding,
  onGenerate,
  loading,
  error,
  datasetData,
  aiPlan,
  validationData,
  validating,
  mlData,
  mlLoading,
  onReRunML,
  scenarioData,
  scenarioLoading,
  onSimulateScenario,
  activeConfig
}) {
  return (
    <div className="space-y-10">
      
      {/* Studio Top Navigation Bar */}
      <div className="aquafi-panel rounded-3xl p-5 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLanding}
            className="aquafi-pill px-4 py-2 rounded-full text-xs font-bold text-white flex items-center space-x-2 cursor-pointer hover:border-purple-400/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#c084fc]" />
            <span>Back to Landing Page</span>
          </button>

          <div className="h-6 w-[1px] bg-purple-500/20 hidden sm:block"></div>

          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-[#c084fc]" />
            <span className="font-extrabold text-white text-base">Studio Workspace</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#c084fc]/20 text-[#c084fc] border border-[#c084fc]/30 uppercase">
              Domain: {activeConfig.domain}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-purple-200/80">
          <Sparkles className="w-4 h-4 text-[#c084fc]" />
          <span>Processing Option: <strong className="text-white font-mono">{activeConfig.numRows.toLocaleString()} rows @ {activeConfig.edgeCasePct}% edge cases</strong></span>
        </div>

      </div>

      {/* 1. Generator Control Section */}
      <GenerateSection
        onGenerate={onGenerate}
        loading={loading}
        error={error}
      />

      {/* 2. Pipeline Processing Results & Analysis */}
      {datasetData && (
        <div className="space-y-10">
          {/* Results KPIs */}
          <ResultsKPIs
            datasetData={datasetData}
            aiPlan={aiPlan}
          />

          {/* Edge Case Analysis */}
          <EdgeCaseAnalysis
            summary={datasetData.edge_case_summary}
          />

          {/* Paginated Dataset Table Preview */}
          <DatasetTable
            sampleData={datasetData.sample_data}
            columns={datasetData.columns}
          />

          {/* Data Quality Validation Scorecard */}
          <QualityValidation
            validationData={validationData}
            loading={validating}
          />

          {/* ML Robustness Stress Test */}
          <MLStressTestCard
            mlData={mlData}
            loading={mlLoading}
            onRunML={onReRunML}
          />

          {/* What-If Scenario Simulator */}
          <WhatIfScenario
            onSimulate={onSimulateScenario}
            scenarioData={scenarioData}
            loading={scenarioLoading}
            activeDomain={activeConfig.domain}
            numRows={activeConfig.numRows}
          />
        </div>
      )}

    </div>
  );
}
