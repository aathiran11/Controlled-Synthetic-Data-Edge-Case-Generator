from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ValidationIssue(BaseModel):
    issue_type: str = Field(..., description="Type of issue: missing_value, invalid_type, range_violation, contradiction, outlier, pii_detected")
    severity: str = Field(..., description="low, medium, high, critical")
    column: str = Field(..., description="Target column name")
    count: int = Field(..., description="Number of affected rows")
    message: str = Field(..., description="Human-readable issue description")

class ValidationMetrics(BaseModel):
    total_records: int
    clean_records: int
    corrupted_records: int
    missing_value_count: int
    invalid_type_count: int
    range_violation_count: int
    contradiction_count: int
    duplicate_record_count: int
    outlier_count: int
    pii_pattern_count: int

class ValidationReportResponse(BaseModel):
    success: bool = True
    quality_score: float = Field(..., ge=0.0, le=100.0, description="Overall data quality score (0-100)")
    quality_grade: str = Field(..., description="Grade: A+, A, B, C, D, F")
    metrics: ValidationMetrics
    issues: List[ValidationIssue]
    domain: Optional[str] = "ecommerce"
    summary_text: str = Field(..., description="Executive summary of dataset quality")

class ValidateDatasetRequest(BaseModel):
    dataset: List[Dict[str, Any]] = Field(..., description="List of row dictionaries to validate")
    domain: Optional[str] = Field("ecommerce", description="Domain context for business rule validation")
