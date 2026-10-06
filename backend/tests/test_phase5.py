"""
Phase 5 Test Verification Script for What-If Scenario Simulation Engine.
Tests severe weather, edge-case ratio surge, missing value spikes,
Before vs After comparisons, and API responses.
"""

import unittest
from fastapi.testclient import TestClient
from main import app
from app.schemas.scenario import ScenarioSimulationRequest

client = TestClient(app)

class TestPhase5WhatIfScenarios(unittest.TestCase):

    def test_01_simulate_logistics_edge_case_surge(self):
        """Test logistics scenario: Edge-Case Ratio Surge (+30% intensity)"""
        payload = {
            "domain": "logistics",
            "num_rows": 2000,
            "scenario_type": "increase_edge_cases",
            "intensity_pct": 30.0,
            "seed": 42
        }
        response = client.post("/api/scenarios/simulate", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertTrue(data["success"])
        self.assertEqual(data["domain"], "logistics")
        self.assertIsNotNone(data["baseline_metrics"])
        self.assertIsNotNone(data["scenario_metrics"])
        self.assertIn("comparison", data)
        self.assertIsNotNone(data["robustness_verdict"])

        comp = data["comparison"]
        base_f1 = comp["ml_f1_score"]["baseline_value"]
        scen_f1 = comp["ml_f1_score"]["scenario_value"]

        print(f"[PASS] Logistics Edge-Case Surge Scenario Simulated.")
        print(f"       Baseline F1: {base_f1:.4f} | Scenario F1: {scen_f1:.4f}")
        print(f"       Quality Score: {comp['quality_score']['baseline_value']} -> {comp['quality_score']['scenario_value']}")
        print(f"       Verdict: {data['robustness_verdict']}")

    def test_02_simulate_missing_value_spike(self):
        """Test e-commerce scenario: Missing Value Spike (+25% intensity)"""
        payload = {
            "domain": "ecommerce",
            "num_rows": 1000,
            "scenario_type": "increase_missing",
            "intensity_pct": 25.0,
            "seed": 99
        }
        response = client.post("/api/scenarios/simulate", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertTrue(data["success"])
        base_edge = data["baseline_metrics"]["edge_case_count"]
        scen_edge = data["scenario_metrics"]["edge_case_count"]
        self.assertGreater(scen_edge, base_edge)

        print(f"[PASS] Missing Value Spike Simulated. Edge Cases: {base_edge} -> {scen_edge}")

    def test_03_invalid_request_handling(self):
        """Test num_rows < 200 returns validation error"""
        response = client.post("/api/scenarios/simulate", json={"num_rows": 50})
        self.assertIn(response.status_code, [400, 422])
        print("[PASS] Invalid request handling verified for scenario endpoint.")

if __name__ == "__main__":
    unittest.main()
