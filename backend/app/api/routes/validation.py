from fastapi import APIRouter, HTTPException, status
from app.schemas.validation import ValidateDatasetRequest, ValidationReportResponse
from app.validator import validate_dataset

router = APIRouter()

@router.post("/validate", response_model=ValidationReportResponse)
def validate_dataset_endpoint(request: ValidateDatasetRequest):
    """
    Validates a synthetic dataset for quality score (0-100), schema consistency,
    range violations, missing values, duplicates, contradictions, outliers, and PII patterns.
    """
    if not request.dataset:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dataset cannot be empty."
        )

    try:
        report = validate_dataset(request.dataset, domain=request.domain or "ecommerce")
        return report

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Validation error: {str(e)}"
        )
