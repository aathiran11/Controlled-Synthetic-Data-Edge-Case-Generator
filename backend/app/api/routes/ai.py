import pandas as pd
from fastapi import APIRouter, HTTPException, status
from app.schemas.ai_plan import AIPlanRequest, AIPlanResponse, GenerationPlan
from app.schemas.dataset import GenerateDatasetResponse
from app.ai.planner import generate_plan_from_prompt
from app.generator import generate_clean_dataset, inject_edge_cases

router = APIRouter()

@router.post("/ai/plan", response_model=AIPlanResponse)
def create_ai_generation_plan(request: AIPlanRequest):
    """
    Translates a natural-language dataset description into a structured GenerationPlan JSON.
    If execute_generation=True (default), feeds the plan directly into the Python synthetic generator.
    """
    if not request.prompt or len(request.prompt.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt must be at least 3 characters long."
        )

    try:
        # 1. AI Planning step: Gemini generates structured JSON plan
        plan: GenerationPlan = generate_plan_from_prompt(request.prompt, request.seed)

        dataset_response = None

        # 2. Python Generation step (if execute_generation is True)
        if request.execute_generation:
            custom_cols = [c.model_dump() for c in plan.columns] if plan.columns else None
            domain_name = plan.domain if plan.domain else "custom"

            # Generate baseline clean data
            df_clean = generate_clean_dataset(
                domain_name=domain_name,
                num_rows=plan.num_rows,
                seed=request.seed,
                custom_columns=custom_cols if domain_name == "custom" else None
            )

            # Inject edge cases according to plan config
            df_edge, summary = inject_edge_cases(
                df=df_clean,
                domain_name=domain_name,
                config=plan.edge_case_config,
                seed=request.seed
            )

            # Convert records for JSON safety
            records = df_edge.where(pd.notnull(df_edge), None).to_dict(orient="records")

            clean_count = len(df_edge[df_edge["is_edge_case"] == False])
            edge_count = len(df_edge[df_edge["is_edge_case"] == True])

            dataset_response = GenerateDatasetResponse(
                success=True,
                domain=domain_name,
                total_rows=len(df_edge),
                clean_rows_count=clean_count,
                edge_case_rows_count=edge_count,
                seed_used=request.seed,
                columns=list(df_edge.columns),
                sample_data=records,
                edge_case_summary=summary
            )

        return AIPlanResponse(
            success=True,
            prompt=request.prompt,
            plan=plan,
            generated_dataset=dataset_response,
            error_message=None
        )

    except Exception as e:
        # Return graceful error response without crashing backend
        return AIPlanResponse(
            success=False,
            prompt=request.prompt,
            plan=None,
            generated_dataset=None,
            error_message=f"AI Planning execution error: {str(e)}"
        )
