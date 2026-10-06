from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ModelPerformanceMetrics(BaseModel):
    accuracy: float = Field(..., description="Classification accuracy (0.0 to 1.0)")
    precision: float = Field(..., description="Precision score (0.0 to 1.0)")
    recall: float = Field(..., description="Recall score (0.0 to 1.0)")
    f1_score: float = Field(..., description="F1 score (0.0 to 1.0)")

class PerformanceComparison(BaseModel):
    clean_data_metrics: ModelPerformanceMetrics
    edge_case_metrics: ModelPerformanceMetrics
    accuracy_drop: float = Field(..., description="Clean accuracy minus edge case accuracy")
    precision_drop: float = Field(..., description="Clean precision minus edge case precision")
    recall_drop: float = Field(..., description="Clean recall minus edge case recall")
    f1_drop: float = Field(..., description="Clean F1 minus edge case F1")
    degradation_pct: float = Field(..., description="Percentage drop in F1 score under stress")

class MLTrainTestRequest(BaseModel):
    domain: Optional[str] = Field("logistics", description="Domain context: logistics, ecommerce, finance, healthcare, iot")
    num_rows: int = Field(2000, ge=200, le=20000, description="Dataset size for ML training")
    edge_case_pct: float = Field(0.20, ge=0.05, le=0.50, description="Edge case ratio for stress test evaluation dataset")
    model_type: str = Field("random_forest", description="Model algorithm: random_forest or logistic_regression")
    seed: Optional[int] = Field(42, description="Random seed for reproducibility")

class MLTrainTestResponse(BaseModel):
    success: bool = True
    domain: str
    model_type: str
    target_column: str
    train_row_count: int
    clean_test_row_count: int
    edge_case_test_row_count: int
    comparison: PerformanceComparison
    robustness_rating: str = Field(..., description="Robustness verdict: Highly Resilient, Moderate Drop, Severe Degradation, Critical Vulnerability")
    feature_importance: Optional[Dict[str, float]] = None
