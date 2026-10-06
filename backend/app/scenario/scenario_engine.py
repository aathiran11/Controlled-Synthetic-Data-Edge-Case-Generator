"""
What-If Scenario Simulation Engine.
Simulates hypothetical operational disruptions, edge-case surges, severe weather conditions,
and distribution shifts using Python vectorized dataset generators.
Compares Baseline vs What-If Scenario metrics (Edge cases, Data Quality Score, ML F1 Score).
"""

import numpy as np
import pandas as pd
from typing import Dict, Any
from app.schemas.scenario import (
    ScenarioSimulationRequest,
    MetricComparisonPoint,
    ScenarioSimulationResponse
)
from app.schemas.dataset import EdgeCaseConfig
from app.generator import generate_clean_dataset, inject_edge_cases
from app.validator import validate_dataset
from app.ml.stress_tester import _prepare_features_and_target, _build_ml_pipeline, _calculate_metrics

SCENARIO_LABELS = {
    "increase_edge_cases": "Edge-Case Ratio Surge",
    "increase_missing": "Missing Operational Values Spike",
    "increase_outliers": "Extreme Outlier Spikes",
    "severe_weather": "Severe Weather & Vehicle Failures",
    "increase_delays": "Systemic Logistics Delay Surge"
}

def run_scenario_simulation(request: ScenarioSimulationRequest) -> ScenarioSimulationResponse:
    """
    Simulates a what-if scenario against baseline dataset metrics:
    1. Trains a baseline ML classifier strictly on clean normal data.
    2. Evaluates the exact same trained model on Baseline Test Data vs What-If Scenario Test Data.
    3. Evaluates Data Quality Scores and edge-case counts.
    4. Computes mathematically rigorous Before vs After comparison metrics.
    """
    domain = request.domain.lower() if request.domain else "logistics"
    seed = request.seed if request.seed is not None else 42
    np.random.seed(seed)
    num_rows = request.num_rows

    # 1. Train Baseline ML Model on Clean Data
    df_clean_train = generate_clean_dataset(domain_name=domain, num_rows=num_rows, seed=seed)
    _ensure_operational_cols(df_clean_train, domain)
    X_train, y_train, _ = _prepare_features_and_target(df_clean_train, domain)

    pipeline, _, _ = _build_ml_pipeline(X_train, "random_forest", seed)
    pipeline.fit(X_train, y_train)

    # 2. Baseline Test Set Evaluation (10% edge cases)
    df_base_clean = generate_clean_dataset(domain_name=domain, num_rows=num_rows, seed=seed + 10)
    _ensure_operational_cols(df_base_clean, domain)
    base_config = EdgeCaseConfig(edge_case_pct=0.10)
    df_base_edge, base_summary = inject_edge_cases(df_base_clean, domain_name=domain, config=base_config, seed=seed + 10)

    base_records = df_base_edge.to_dict(orient="records")
    base_val_report = validate_dataset(base_records, domain=domain)

    X_base, y_base, _ = _prepare_features_and_target(df_base_edge, domain)
    y_pred_base = pipeline.predict(X_base)
    base_ml_metrics = _calculate_metrics(y_base, y_pred_base)

    base_metrics = {
        "total_rows": num_rows,
        "edge_case_count": base_summary.total_edge_cases,
        "edge_case_pct": base_summary.edge_case_percentage,
        "quality_score": base_val_report.quality_score,
        "quality_grade": base_val_report.quality_grade,
        "ml_f1_score": base_ml_metrics.f1_score,
        "ml_accuracy": base_ml_metrics.accuracy
    }

    # 3. Generate What-If Scenario Test Dataset
    intensity_ratio = request.intensity_pct / 100.0
    scenario_type = request.scenario_type.lower()
    scenario_label = SCENARIO_LABELS.get(scenario_type, "Custom What-If Scenario")

    df_scen_clean = generate_clean_dataset(domain_name=domain, num_rows=num_rows, seed=seed + 50)
    _ensure_operational_cols(df_scen_clean, domain)
    df_scen_clean = df_scen_clean.astype(object)

    if scenario_type == "increase_edge_cases":
        scen_pct = min(0.75, 0.10 + intensity_ratio)
        scen_config = EdgeCaseConfig(edge_case_pct=scen_pct)
        df_scen_mod, scen_summary = inject_edge_cases(df_scen_clean, domain_name=domain, config=scen_config, seed=seed + 50)

    elif scenario_type == "increase_missing":
        scen_config = EdgeCaseConfig(edge_case_pct=0.10, include_missing=True)
        df_scen_mod, scen_summary = inject_edge_cases(df_scen_clean, domain_name=domain, config=scen_config, seed=seed + 50)
        cols = [c for c in df_scen_mod.columns if "id" not in c and "is_edge" not in c]
        missing_indices = np.random.choice(df_scen_mod.index, size=int(num_rows * intensity_ratio), replace=False)
        for idx in missing_indices:
            col = np.random.choice(cols)
            df_scen_mod.at[idx, col] = None
            df_scen_mod.at[idx, "is_edge_case"] = True
            df_scen_mod.at[idx, "edge_case_type"] = "missing_value"
            df_scen_mod.at[idx, "edge_case_description"] = f"What-If: Missing value injected into '{col}'"

    elif scenario_type == "increase_outliers":
        scen_config = EdgeCaseConfig(edge_case_pct=0.10, include_outliers=True)
        df_scen_mod, scen_summary = inject_edge_cases(df_scen_clean, domain_name=domain, config=scen_config, seed=seed + 50)
        num_cols = [c for c in df_scen_mod.columns if c in ["price", "amount", "weight_kg", "distance_km", "temperature"]]
        if num_cols:
            outlier_indices = np.random.choice(df_scen_mod.index, size=int(num_rows * intensity_ratio), replace=False)
            for idx in outlier_indices:
                col = np.random.choice(num_cols)
                df_scen_mod.at[idx, col] = 25000.0 if "price" in col or "amount" in col else 15000.0
                df_scen_mod.at[idx, "is_edge_case"] = True
                df_scen_mod.at[idx, "edge_case_type"] = "outlier"
                df_scen_mod.at[idx, "edge_case_description"] = f"What-If: Extreme outlier injected into '{col}'"

    elif scenario_type == "severe_weather":
        scen_config = EdgeCaseConfig(edge_case_pct=0.10, include_invalid=True)
        df_scen_mod, scen_summary = inject_edge_cases(df_scen_clean, domain_name=domain, config=scen_config, seed=seed + 50)
        weather_indices = np.random.choice(df_scen_mod.index, size=int(num_rows * intensity_ratio), replace=False)
        for idx in weather_indices:
            if "weather_condition" in df_scen_mod.columns:
                df_scen_mod.at[idx, "weather_condition"] = "Severe Blizzard Storm"
            if "vehicle_type" in df_scen_mod.columns:
                df_scen_mod.at[idx, "vehicle_type"] = "Vehicle Breakdown / Engine Failure"
            df_scen_mod.at[idx, "is_edge_case"] = True
            df_scen_mod.at[idx, "edge_case_type"] = "domain_failure"
            df_scen_mod.at[idx, "edge_case_description"] = "What-If: Severe weather blizzard & vehicle failure disruption"

    else: # increase_delays
        scen_config = EdgeCaseConfig(edge_case_pct=0.10, include_contradictions=True)
        df_scen_mod, scen_summary = inject_edge_cases(df_scen_clean, domain_name=domain, config=scen_config, seed=seed + 50)
        delay_indices = np.random.choice(df_scen_mod.index, size=int(num_rows * intensity_ratio), replace=False)
        for idx in delay_indices:
            if "delivery_status" in df_scen_mod.columns:
                df_scen_mod.at[idx, "delivery_status"] = "Delayed"
            if "delay_hours" in df_scen_mod.columns:
                df_scen_mod.at[idx, "delay_hours"] = 120
            df_scen_mod.at[idx, "is_edge_case"] = True
            df_scen_mod.at[idx, "edge_case_type"] = "contradiction"
            df_scen_mod.at[idx, "edge_case_description"] = "What-If: Severe systemic 120-hour transit delay surge"

    # 4. Evaluate EXACT SAME Trained Model on What-If Scenario Test Data
    scen_records = df_scen_mod.to_dict(orient="records")
    scen_val_report = validate_dataset(scen_records, domain=domain)

    scen_edge_count = int(df_scen_mod["is_edge_case"].sum())
    scen_edge_pct = round((scen_edge_count / num_rows) * 100, 2)

    X_scen, y_scen, _ = _prepare_features_and_target(df_scen_mod, domain)
    y_pred_scen = pipeline.predict(X_scen)
    scen_ml_metrics = _calculate_metrics(y_scen, y_pred_scen)

    scen_metrics = {
        "total_rows": num_rows,
        "edge_case_count": scen_edge_count,
        "edge_case_pct": scen_edge_pct,
        "quality_score": scen_val_report.quality_score,
        "quality_grade": scen_val_report.quality_grade,
        "ml_f1_score": scen_ml_metrics.f1_score,
        "ml_accuracy": scen_ml_metrics.accuracy
    }

    # 5. Before vs What-If Comparison
    comparison = {
        "edge_case_count": _create_point(base_metrics["edge_case_count"], scen_metrics["edge_case_count"]),
        "quality_score": _create_point(base_metrics["quality_score"], scen_metrics["quality_score"]),
        "ml_f1_score": _create_point(base_metrics["ml_f1_score"], scen_metrics["ml_f1_score"]),
        "ml_accuracy": _create_point(base_metrics["ml_accuracy"], scen_metrics["ml_accuracy"])
    }

    f1_pct_change = comparison["ml_f1_score"].percentage_change
    if f1_pct_change >= -5.0:
        verdict = f"Resilient under What-If Scenario ({f1_pct_change:+.1f}% F1 Shift)"
    elif f1_pct_change >= -20.0:
        verdict = f"Moderate Scenario Impact ({f1_pct_change:.1f}% F1 Drop)"
    else:
        verdict = f"Severe Scenario Failure Mode ({f1_pct_change:.1f}% F1 Drop)"


    return ScenarioSimulationResponse(
        success=True,
        domain=domain,
        scenario_type=scenario_type,
        scenario_label=scenario_label,
        intensity_pct=request.intensity_pct,
        seed_used=seed,
        baseline_metrics=base_metrics,
        scenario_metrics=scen_metrics,
        comparison=comparison,
        robustness_verdict=verdict
    )


def _ensure_operational_cols(df: pd.DataFrame, domain: str):
    """Ensures operational features exist for logistics."""
    num_rows = len(df)
    if domain == "logistics":
        if "weather_condition" not in df.columns:
            df["weather_condition"] = np.random.choice(["Clear", "Rain", "Fog"], size=num_rows, p=[0.70, 0.20, 0.10])
        if "vehicle_type" not in df.columns:
            df["vehicle_type"] = np.random.choice(["Semi-Truck", "Cargo Van", "Freight Train"], size=num_rows, p=[0.60, 0.30, 0.10])


def _create_point(base_val: float, scen_val: float) -> MetricComparisonPoint:
    """Helper to compute absolute and percentage change between baseline and scenario."""
    abs_diff = round(scen_val - base_val, 4)
    pct_diff = round(((scen_val - base_val) / base_val) * 100, 2) if base_val != 0 else 0.0
    return MetricComparisonPoint(
        baseline_value=round(base_val, 4),
        scenario_value=round(scen_val, 4),
        absolute_change=abs_diff,
        percentage_change=pct_diff
    )
