from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ScenarioSimulationRequest(BaseModel):
    domain: Optional[str] = Field("logistics", description="Domain: logistics, ecommerce, finance, healthcare, iot")
    num_rows: int = Field(2000, ge=200, le=20000, description="Dataset row count")
    scenario_type: str = Field(
        "severe_weather",
        description="Scenario type: increase_edge_cases, increase_missing, increase_outliers, severe_weather, increase_delays"
    )
    intensity_pct: float = Field(25.0, ge=5.0, le=80.0, description="Intensity/increase percentage (5% to 80%)")
    seed: Optional[int] = Field(42, description="Random seed for reproducibility")

class MetricComparisonPoint(BaseModel):
    baseline_value: float
    scenario_value: float
    absolute_change: float
    percentage_change: float

class ScenarioSimulationResponse(BaseModel):
    success: bool = True
    domain: str
    scenario_type: str
    scenario_label: str
    intensity_pct: float
    seed_used: int
    baseline_metrics: Dict[str, Any]
    scenario_metrics: Dict[str, Any]
    comparison: Dict[str, MetricComparisonPoint]
    robustness_verdict: str
    simulated_notice: str = "Simulated synthetic what-if scenario executed programmatically via Python Data Engine."
