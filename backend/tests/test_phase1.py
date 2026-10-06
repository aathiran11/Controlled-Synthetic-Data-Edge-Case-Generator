"""
Phase 1 Test Verification Script.
Tests all 5 domain presets, 1000+ row generation, edge case injection, API endpoints,
reproducibility with seed, and invalid request error handling.
"""

import sys
import unittest
import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestPhase1SyntheticEngine(unittest.TestCase):

    def test_01_get_domains(self):
        """Test GET /api/domains returns 5 presets"""
        response = client.get("/api/domains")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("domains", data)
        domain_ids = [d["id"] for d in data["domains"]]
        expected_domains = ["ecommerce", "finance", "healthcare", "logistics", "iot"]
        for domain in expected_domains:
            self.assertIn(domain, domain_ids)
        print("[PASS] GET /api/domains returned all 5 domain presets.")

    def test_02_generate_clean_dataset_all_domains(self):
        """Test POST /api/generate across all 5 domains with 1,000 rows"""
        domains = ["ecommerce", "finance", "healthcare", "logistics", "iot"]
        for domain in domains:
            payload = {
                "domain": domain,
                "num_rows": 1000,
                "seed": 42
            }
            response = client.post("/api/generate", json=payload)
            self.assertEqual(response.status_code, 200, f"Failed for domain {domain}")
            data = response.json()
            self.assertTrue(data["success"])
            self.assertEqual(data["total_rows"], 1000)
            self.assertEqual(data["clean_rows_count"], 1000)
            self.assertEqual(data["edge_case_rows_count"], 0)
            self.assertGreater(len(data["sample_data"]), 0)
            
            # Check edge case flags exist on sample rows
            first_row = data["sample_data"][0]
            self.assertIn("is_edge_case", first_row)
            self.assertIn("edge_case_type", first_row)
            self.assertIn("edge_case_severity", first_row)
            self.assertIn("edge_case_description", first_row)
            self.assertFalse(first_row["is_edge_case"])

            print(f"[PASS] Generated 1,000 clean rows for domain '{domain}'. Columns count: {len(data['columns'])}")

    def test_03_generate_edge_cases_1000_rows(self):
        """Test POST /api/generate/edge-cases with 1,000 rows and 15% edge case ratio"""
        payload = {
            "domain": "healthcare",
            "num_rows": 1000,
            "seed": 101,
            "edge_case_config": {
                "edge_case_pct": 0.15,
                "include_invalid": True,
                "include_boundary": True,
                "include_outliers": True,
                "include_missing": True,
                "include_duplicates": True,
                "include_contradictions": True
            }
        }
        response = client.post("/api/generate/edge-cases", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["total_rows"], 1000)
        self.assertEqual(data["edge_case_rows_count"], 150)
        self.assertEqual(data["clean_rows_count"], 850)
        self.assertIsNotNone(data["edge_case_summary"])
        
        summary = data["edge_case_summary"]
        self.assertEqual(summary["total_edge_cases"], 150)
        self.assertEqual(summary["edge_case_percentage"], 15.0)
        
        # Verify edge case breakdown
        print(f"[PASS] 150/1000 Edge cases generated. Types breakdown: {summary['breakdown_by_type']}")
        print(f"       Severity breakdown: {summary['breakdown_by_severity']}")

    def test_04_seed_reproducibility(self):
        """Test that passing the same seed produces identical output"""
        payload = {"domain": "finance", "num_rows": 500, "seed": 777}
        res1 = client.post("/api/generate", json=payload).json()
        res2 = client.post("/api/generate", json=payload).json()
        self.assertEqual(res1["sample_data"], res2["sample_data"])
        print("[PASS] Seed reproducibility verified. Identical seed produced identical data.")

    def test_05_invalid_request_handling(self):
        """Test invalid domain and invalid num_rows return proper HTTP errors"""
        # Test unknown domain
        response_domain = client.post("/api/generate", json={"domain": "unknown_domain_xyz", "num_rows": 50})
        self.assertEqual(response_domain.status_code, 400)
        self.assertIn("Invalid domain", response_domain.json()["detail"])

        # Test num_rows out of range (< 1)
        response_rows = client.post("/api/generate", json={"domain": "ecommerce", "num_rows": 0})
        self.assertEqual(response_rows.status_code, 422)

        print("[PASS] Invalid request handling verified (400 for bad domain, 422 for bad num_rows).")

if __name__ == "__main__":
    unittest.main()
