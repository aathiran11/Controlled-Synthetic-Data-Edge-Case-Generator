const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Checks backend health endpoint
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Fetches available domain presets metadata
 */
export async function fetchDomains() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/domains`);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    return { success: true, domains: data.domains || [] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Generates structured AI plan and dataset from natural language prompt
 */
export async function generateWithAI(prompt, seed = 42, executeGeneration = true) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        seed: seed ? parseInt(seed) : null,
        execute_generation: executeGeneration
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || `HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Generates synthetic dataset with edge cases directly
 */
export async function generateEdgeCaseDataset(domain, numRows, seed, edgeCasePct = 0.10) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate/edge-cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain,
        num_rows: parseInt(numRows),
        seed: seed ? parseInt(seed) : null,
        edge_case_config: {
          edge_case_pct: parseFloat(edgeCasePct),
          include_invalid: true,
          include_boundary: true,
          include_outliers: true,
          include_missing: true,
          include_duplicates: true,
          include_contradictions: true
        }
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || `HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Validates a generated dataset for Quality Score (0-100) and issue audits
 */
export async function validateDatasetApi(datasetRecords, domain = 'ecommerce') {
  try {
    const response = await fetch(`${API_BASE_URL}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dataset: datasetRecords,
        domain
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || `HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Trains ML model and evaluates normal vs edge-case performance
 */
export async function runMLStressTestApi(domain, numRows, edgeCasePct = 0.20, modelType = 'random_forest', seed = 42) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ml/train-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain,
        num_rows: parseInt(numRows),
        edge_case_pct: parseFloat(edgeCasePct),
        model_type: modelType,
        seed: seed ? parseInt(seed) : 42
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || `HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Simulates what-if scenario (severe weather, edge-case surge, missing values, outliers)
 */
export async function simulateScenarioApi(domain = 'logistics', numRows = 2000, scenarioType = 'severe_weather', intensityPct = 25.0, seed = 42) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/scenarios/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain,
        num_rows: parseInt(numRows),
        scenario_type: scenarioType,
        intensity_pct: parseFloat(intensityPct),
        seed: seed ? parseInt(seed) : 42
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || `HTTP Error: ${response.status}`);
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
