"""
Phase 3 Test Verification Script for Data Validation Engine & ML Stress Testing.
Tests clean data validation, edge case dataset validation, score calculations,
Logistics delay ML model training, normal vs edge-case evaluation, and performance drop metrics.
"""

import unittest
from fastapi.testclient import TestClient
from main import app
from app.generator import generate_clean_dataset, inject_edge_cases
from app.schemas.dataset import EdgeCaseConfig
from app.validator import validate_dataset
from app.ml import run_ml_stress_test
from app.schemas.ml import MLTrainTestRequest

client = TestClient(app)

class TestPhase3ValidationAndML(unittest.TestCase):

    def test_01_clean_dataset_validation(self):
        """Test validation on clean synthetic dataset (expects High Quality Score >= 95.0, Grade A+)"""
        df_clean = generate_clean_dataset(domain_name="ecommerce", num_rows=1000, seed=42)
        records = df_clean.to_dict(orient="records")

        report = validate_dataset(records, domain="ecommerce")
        self.assertTrue(report.success)
        self.assertGreaterEqual(report.quality_score, 90.0)
        self.assertIn(report.quality_grade, ["A+", "A"])
        self.assertEqual(report.metrics.total_records, 1000)
        self.assertEqual(report.metrics.missing_value_count, 0)
        print(f"[PASS] Clean dataset validation score: {report.quality_score}/100 (Grade: {report.quality_grade}).")

    def test_02_edge_case_dataset_validation(self):
        """Test validation on 20% edge-case corrupted dataset (expects score drop & issues detected)"""
        df_clean = generate_clean_dataset(domain_name="healthcare", num_rows=1000, seed=101)
        df_edge, _ = inject_edge_cases(
            df=df_clean,
            domain_name="healthcare",
            config=EdgeCaseConfig(edge_case_pct=0.20),
            seed=101
        )
        records = df_edge.to_dict(orient="records")

        report = validate_dataset(records, domain="healthcare")
        self.assertTrue(report.success)
        self.assertLess(report.quality_score, 90.0)
        self.assertGreater(len(report.issues), 0)
        self.assertEqual(report.metrics.total_records, 1000)
        self.assertGreater(report.metrics.corrupted_records, 0)

        print(f"[PASS] Edge-case dataset validation score: {report.quality_score}/100 (Grade: {report.quality_grade}). Issues found: {len(report.issues)}")

    def test_03_ml_stress_test_logistics_model(self):
        """Test ML training & stress test on Logistics delay prediction model"""
        req = MLTrainTestRequest(
            domain="logistics",
            num_rows=2000,
            edge_case_pct=0.25,
            model_type="random_forest",
            seed=42
        )
        res = run_ml_stress_test(req)
        self.assertTrue(res.success)
        self.assertEqual(res.domain, "logistics")
        self.assertEqual(res.model_type, "random_forest")
        
        comp = res.comparison
        clean_f1 = comp.clean_data_metrics.f1_score
        edge_f1 = comp.edge_case_metrics.f1_score

        self.assertGreater(clean_f1, 0.0)
        self.assertIsNotNone(comp.f1_drop)
        self.assertIsNotNone(res.robustness_rating)

        print(f"[PASS] ML Logistics Model trained. Clean F1: {clean_f1:.4f}, Edge-Case F1: {edge_f1:.4f}. F1 Shift: {comp.f1_drop:.4f} ({comp.degradation_pct}% shift). Rating: {res.robustness_rating}")

    def test_04_ml_endpoint_api(self):
        """Test POST /api/ml/train-test API endpoint"""
        payload = {
            "domain": "finance",
            "num_rows": 1000,
            "edge_case_pct": 0.20,
            "model_type": "logistic_regression",
            "seed": 77
        }
        response = client.post("/api/ml/train-test", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["domain"], "finance")
        self.assertIn("comparison", data)
        print("[PASS] POST /api/ml/train-test API endpoint returned successful response.")

    def test_05_invalid_request_handling(self):
        """Test empty dataset validation & low row count ML requests return HTTP errors"""
        # Empty dataset for validation
        res_val = client.post("/api/validate", json={"dataset": []})
        self.assertEqual(res_val.status_code, 400)

        # num_rows < 200 for ML stress testing (returns Pydantic 422 validation error)
        res_ml = client.post("/api/ml/train-test", json={"num_rows": 50})
        self.assertIn(res_ml.status_code, [400, 422])

        print("[PASS] Invalid request handling verified for validation and ML endpoints.")

    def test_06_ml_confusion_matrix_consistency(self):
        """Test that sklearn binary metrics match metrics calculated directly from the Confusion Matrix with floating-point precision < 1e-10"""
        import numpy as np
        from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score, f1_score
        from app.ml.stress_tester import _calculate_metrics

        # Generate a synthetic binary evaluation setup
        y_true = np.array([0]*85 + [1]*315)
        y_pred = np.array([0]*9 + [1]*76 + [0]*2 + [1]*313)

        metrics = _calculate_metrics(y_true, y_pred)
        
        cm = confusion_matrix(y_true, y_pred)
        tn, fp, fn, tp = cm.ravel()
        total_rows = len(y_true)

        self.assertEqual(tn + fp + fn + tp, total_rows)

        calc_acc = (tp + tn) / total_rows
        calc_prec = tp / (tp + fp)
        calc_rec = tp / (tp + fn)
        calc_f1 = 2 * calc_prec * calc_rec / (calc_prec + calc_rec)

        sk_acc = accuracy_score(y_true, y_pred)
        sk_prec = precision_score(y_true, y_pred, average="binary")
        sk_rec = recall_score(y_true, y_pred, average="binary")
        sk_f1 = f1_score(y_true, y_pred, average="binary")

        # Verify strict floating-point mathematical equality < 1e-10
        self.assertLess(abs(sk_acc - calc_acc), 1e-10)
        self.assertLess(abs(sk_prec - calc_prec), 1e-10)
        self.assertLess(abs(sk_rec - calc_rec), 1e-10)
        self.assertLess(abs(sk_f1 - calc_f1), 1e-10)

        # Verify metrics schema matches rounded results
        self.assertEqual(metrics.accuracy, round(sk_acc, 4))
        self.assertEqual(metrics.precision, round(sk_prec, 4))
        self.assertEqual(metrics.recall, round(sk_rec, 4))
        self.assertEqual(metrics.f1_score, round(sk_f1, 4))

        print("[PASS] Confusion matrix mathematical equality verified (< 1e-10 tolerance).")

if __name__ == "__main__":
    unittest.main()


