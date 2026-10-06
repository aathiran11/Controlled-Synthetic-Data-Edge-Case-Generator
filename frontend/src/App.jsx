import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingView from './components/LandingView';
import StudioView from './components/StudioView';
import IntroSplash from './components/IntroSplash';
import Footer from './components/Footer';

import {
  checkBackendHealth,
  generateWithAI,
  validateDatasetApi,
  runMLStressTestApi,
  simulateScenarioApi
} from './services/api';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('landing'); // 'landing' or 'studio'
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [mlLoading, setMlLoading] = useState(false);
  const [scenarioLoading, setScenarioLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pipeline Data States
  const [aiPlan, setAiPlan] = useState(null);
  const [datasetData, setDatasetData] = useState(null);
  const [validationData, setValidationData] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [scenarioData, setScenarioData] = useState(null);

  // Active generation configuration
  const [activeConfig, setActiveConfig] = useState({
    domain: 'logistics',
    numRows: 5000,
    edgeCasePct: 10,
    seed: 42
  });

  // Initial health check on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setIsBackendOnline(res.success);
    });
  }, []);

  // Handle navigation between Landing Page and Studio
  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Option Selection on Landing Page ("on clicking option it should go inside for further process")
  const handleSelectOption = (domainId, promptText) => {
    setActiveConfig((prev) => ({
      ...prev,
      domain: domainId
    }));
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Main End-to-End Pipeline Execution Trigger
  const handleGenerate = async ({ prompt, domain, numRows, edgeCasePct, seed }) => {
    setLoading(true);
    setError(null);
    setValidationData(null);
    setMlData(null);
    setScenarioData(null);
    setActiveConfig({ domain, numRows, edgeCasePct, seed });

    try {
      // 1. Call POST /api/ai/plan to get GenerationPlan & generated dataset
      const aiResult = await generateWithAI(prompt, seed, true);

      if (!aiResult.success) {
        throw new Error(aiResult.error || 'Failed to generate dataset with AI');
      }

      const plan = aiResult.data.plan;
      const dataset = aiResult.data.generated_dataset;

      setAiPlan(plan);
      setDatasetData(dataset);
      setLoading(false);

      // 2. Trigger Data Validation Audit (POST /api/validate)
      if (dataset && dataset.sample_data) {
        setValidating(true);
        const valResult = await validateDatasetApi(dataset.sample_data, dataset.domain || domain);
        if (valResult.success) {
          setValidationData(valResult.data);
        }
        setValidating(false);
      }

      // 3. Trigger ML Stress Testing (POST /api/ml/train-test)
      setMlLoading(true);
      const ratio = edgeCasePct / 100.0;
      const mlResult = await runMLStressTestApi(dataset?.domain || domain, numRows, ratio, 'random_forest', seed);
      if (mlResult.success) {
        setMlData(mlResult.data);
      }
      setMlLoading(false);

    } catch (err) {
      console.error('Pipeline execution error:', err);
      setError(err.message || 'An unexpected error occurred during pipeline execution.');
      setLoading(false);
      setValidating(false);
      setMlLoading(false);
    }
  };

  // Re-trigger ML stress test on demand
  const handleReRunML = async () => {
    setMlLoading(true);
    const ratio = activeConfig.edgeCasePct / 100.0;
    const mlResult = await runMLStressTestApi(
      activeConfig.domain,
      activeConfig.numRows,
      ratio,
      'random_forest',
      activeConfig.seed
    );
    if (mlResult.success) {
      setMlData(mlResult.data);
    }
    setMlLoading(false);
  };

  // Trigger What-If Scenario simulation
  const handleSimulateScenario = async ({ scenarioType, intensityPct }) => {
    setScenarioLoading(true);
    const scenResult = await simulateScenarioApi(
      activeConfig.domain,
      2000,
      scenarioType,
      intensityPct,
      activeConfig.seed
    );
    if (scenResult.success) {
      setScenarioData(scenResult.data);
    }
    setScenarioLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col aquafi-bg text-white font-sans selection:bg-[#a855f7] selection:text-white relative">
      
      {/* Intro Splash Animation Screen */}
      {showSplash && (
        <IntroSplash onComplete={() => setShowSplash(false)} />
      )}

      <Header
        isBackendOnline={isBackendOnline}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <main className="flex-1 w-full mx-auto px-4 sm:px-6 py-6 max-w-7xl">
        {currentView === 'landing' ? (
          <LandingView
            onSelectOption={handleSelectOption}
            onLaunchStudio={() => handleNavigate('studio')}
          />
        ) : (
          <StudioView
            onBackToLanding={() => handleNavigate('landing')}
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
            datasetData={datasetData}
            aiPlan={aiPlan}
            validationData={validationData}
            validating={validating}
            mlData={mlData}
            mlLoading={mlLoading}
            onReRunML={handleReRunML}
            scenarioData={scenarioData}
            scenarioLoading={scenarioLoading}
            onSimulateScenario={handleSimulateScenario}
            activeConfig={activeConfig}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
