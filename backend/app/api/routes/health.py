from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str
    service: str

@router.get("/health", response_model=HealthResponse)
def get_health():
    return HealthResponse(
        status="ok",
        message="PSA 07 Backend Service is healthy and operational",
        timestamp=datetime.now().isoformat(),
        service="Controlled Synthetic Data & Edge-Case Generator API"
    )
