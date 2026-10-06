from fastapi import APIRouter, HTTPException, status
from app.schemas.ml import MLTrainTestRequest, MLTrainTestResponse
from app.ml import run_ml_stress_test

router = APIRouter()

@router.post("/ml/train-test", response_model=MLTrainTestResponse)
def train_and_stress_test_ml_model(request: MLTrainTestRequest):
    """
    Trains a baseline Scikit-learn model on clean synthetic data and evaluates model performance
    degradation on edge-case corrupted test data.
    """
    if request.num_rows < 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="num_rows must be at least 200 for meaningful ML training."
        )

    try:
        response = run_ml_stress_test(request)
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"ML Stress Testing failed: {str(e)}"
        )
