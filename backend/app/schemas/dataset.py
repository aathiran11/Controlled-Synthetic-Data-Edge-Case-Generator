from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ColumnSpec(BaseModel):
    name: str = Field(..., description="Column name")
    data_type: str = Field(..., description="Data type: numeric, integer, string, categorical, datetime, email, uuid, boolean")
    distribution: Optional[str] = Field("uniform", description="Distribution type: uniform, normal, poisson, choice")
    min_val: Optional[float] = Field(None, description="Minimum numeric value or datetime start")
    max_val: Optional[float] = Field(None, description="Maximum numeric value or datetime end")
    mean: Optional[float] = Field(None, description="Mean for normal distribution")
    std: Optional[float] = Field(None, description="Standard deviation for normal distribution")
    categories: Optional[List[Any]] = Field(None, description="List of categorical values")
    probabilities: Optional[List[float]] = Field(None, description="Probabilities for categorical choices")
    nullable: bool = Field(False, description="Whether column can contain null values in clean data")

class GenerateDatasetRequest(BaseModel):
    domain: Optional[str] = Field("ecommerce", description="Domain preset: ecommerce, finance, healthcare, logistics, iot")
    num_rows: int = Field(100, ge=1, le=50000, description="Number of rows to generate (1 to 50,000)")
    seed: Optional[int] = Field(None, description="Random seed for reproducibility")
    custom_columns: Optional[List[ColumnSpec]] = Field(None, description="Custom columns if domain is not specified")

class EdgeCaseConfig(BaseModel):
    edge_case_pct: float = Field(0.1, ge=0.0, le=0.8, description="Percentage of rows that should be edge cases (0.0 to 0.8)")
    include_invalid: bool = Field(True, description="Include invalid data types or negative/impossible values")
    include_boundary: bool = Field(True, description="Include boundary min/max values")
    include_outliers: bool = Field(True, description="Include statistical outliers")
    include_missing: bool = Field(True, description="Include missing/null values")
    include_duplicates: bool = Field(True, description="Include duplicate primary keys or rows")
    include_contradictions: bool = Field(True, description="Include contradictory column combinations")

class GenerateEdgeCaseRequest(GenerateDatasetRequest):
    edge_case_config: EdgeCaseConfig = Field(default_factory=EdgeCaseConfig)

class EdgeCaseSummary(BaseModel):
    total_edge_cases: int
    edge_case_percentage: float
    breakdown_by_type: Dict[str, int]
    breakdown_by_severity: Dict[str, int]

class GenerateDatasetResponse(BaseModel):
    success: bool = True
    domain: str
    total_rows: int
    clean_rows_count: int
    edge_case_rows_count: int
    seed_used: Optional[int]
    columns: List[str]
    sample_data: List[Dict[str, Any]]
    edge_case_summary: Optional[EdgeCaseSummary] = None
