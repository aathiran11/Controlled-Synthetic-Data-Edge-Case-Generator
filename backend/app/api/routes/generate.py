import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, status
from app.schemas.dataset import (
    GenerateDatasetRequest,
    GenerateEdgeCaseRequest,
    GenerateDatasetResponse
)
from app.generator import (
    generate_clean_dataset,
    inject_edge_cases,
    DOMAIN_PRESETS
)

router = APIRouter()

@router.post("/generate", response_model=GenerateDatasetResponse)
def generate_dataset(request: GenerateDatasetRequest):
    """
    Generates a clean synthetic dataset for a specified domain preset or custom schema.
    Returns generated tabular data without edge cases.
    """
    domain_key = request.domain.lower() if request.domain else "ecommerce"

    if not request.custom_columns and domain_key not in DOMAIN_PRESETS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid domain '{request.domain}'. Supported domains: {list(DOMAIN_PRESETS.keys())}"
        )

    try:
        custom_cols = [c.dict() for c in request.custom_columns] if request.custom_columns else None
        df = generate_clean_dataset(
            domain_name=domain_key,
            num_rows=request.num_rows,
            seed=request.seed,
            custom_columns=custom_cols
        )

        # Replace NaN values with None for JSON serialization compatibility
        clean_records = df.where(pd.notnull(df), None).to_dict(orient="records")

        return GenerateDatasetResponse(
            success=True,
            domain=domain_key,
            total_rows=len(df),
            clean_rows_count=len(df),
            edge_case_rows_count=0,
            seed_used=request.seed,
            columns=list(df.columns),
            sample_data=clean_records,
            edge_case_summary=None
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate dataset: {str(e)}"
        )


@router.post("/generate/edge-cases", response_model=GenerateDatasetResponse)
def generate_edge_case_dataset(request: GenerateEdgeCaseRequest):
    """
    Generates a synthetic dataset with controlled edge-case and anomaly injection.
    Every row contains edge_case flags: is_edge_case, edge_case_type, edge_case_severity, edge_case_description.
    """
    domain_key = request.domain.lower() if request.domain else "ecommerce"

    if not request.custom_columns and domain_key not in DOMAIN_PRESETS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid domain '{request.domain}'. Supported domains: {list(DOMAIN_PRESETS.keys())}"
        )

    try:
        custom_cols = [c.dict() for c in request.custom_columns] if request.custom_columns else None
        
        # 1. Generate clean baseline
        df_clean = generate_clean_dataset(
            domain_name=domain_key,
            num_rows=request.num_rows,
            seed=request.seed,
            custom_columns=custom_cols
        )

        # 2. Inject edge cases
        df_edge, summary = inject_edge_cases(
            df=df_clean,
            domain_name=domain_key,
            config=request.edge_case_config,
            seed=request.seed
        )

        # Replace NaN values with None for clean JSON output
        records = df_edge.where(pd.notnull(df_edge), None).to_dict(orient="records")

        clean_count = len(df_edge[df_edge["is_edge_case"] == False])
        edge_count = len(df_edge[df_edge["is_edge_case"] == True])

        return GenerateDatasetResponse(
            success=True,
            domain=domain_key,
            total_rows=len(df_edge),
            clean_rows_count=clean_count,
            edge_case_rows_count=edge_count,
            seed_used=request.seed,
            columns=list(df_edge.columns),
            sample_data=records,
            edge_case_summary=summary
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate edge-case dataset: {str(e)}"
        )
