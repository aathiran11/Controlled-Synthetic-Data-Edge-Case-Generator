from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health, domains, generate, ai, validation, ml, scenarios

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for PSA 07 - Controlled Synthetic Data & Edge-Case Generator",
    version="1.0.0"
)

# CORS middleware configuration for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["Health"])
app.include_router(domains.router, prefix=settings.API_V1_STR, tags=["Domains"])
app.include_router(generate.router, prefix=settings.API_V1_STR, tags=["Generation"])
app.include_router(ai.router, prefix=settings.API_V1_STR, tags=["AI Planner"])
app.include_router(validation.router, prefix=settings.API_V1_STR, tags=["Validation Engine"])
app.include_router(ml.router, prefix=settings.API_V1_STR, tags=["ML Stress Testing"])
app.include_router(scenarios.router, prefix=settings.API_V1_STR, tags=["What-If Scenarios"])

@app.get("/")
def root():
    return {
        "status": "ok",
        "app": settings.PROJECT_NAME,
        "docs": "/docs",
        "health_check": f"{settings.API_V1_STR}/health",
        "domains_endpoint": f"{settings.API_V1_STR}/domains",
        "generate_endpoint": f"{settings.API_V1_STR}/generate",
        "edge_cases_endpoint": f"{settings.API_V1_STR}/generate/edge-cases",
        "ai_plan_endpoint": f"{settings.API_V1_STR}/ai/plan",
        "validate_endpoint": f"{settings.API_V1_STR}/validate",
        "ml_train_test_endpoint": f"{settings.API_V1_STR}/ml/train-test",
        "scenarios_simulate_endpoint": f"{settings.API_V1_STR}/scenarios/simulate"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
