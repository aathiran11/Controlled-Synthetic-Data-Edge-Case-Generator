from fastapi import APIRouter, HTTPException, status
from app.schemas.scenario import ScenarioSimulationRequest, ScenarioSimulationResponse
from app.scenario import run_scenario_simulation

router = APIRouter()

@router.post("/scenarios/simulate", response_model=ScenarioSimulationResponse)
def simulate_what_if_scenario(request: ScenarioSimulationRequest):
    """
    Simulates a what-if scenario (severe weather, edge-case surge, missing values, extreme outliers)
    and reports Before vs After metrics comparisons (Edge cases, Quality Score, ML F1 Score).
    """
    if request.num_rows < 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="num_rows must be at least 200 for scenario simulation."
        )

    try:
        response = run_scenario_simulation(request)
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Scenario Simulation failed: {str(e)}"
        )
