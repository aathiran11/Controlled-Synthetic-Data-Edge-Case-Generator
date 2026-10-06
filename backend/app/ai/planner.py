"""
Gemini AI Planner Module.
Translates natural-language user dataset specifications into a structured GenerationPlan JSON.
IMPORTANT: Gemini operates strictly as the schema architect and plan generator.
Gemini does NOT generate actual dataset rows.
"""

import os
import re
import json
import logging
from typing import Optional, Dict, Any
from app.core.config import settings
from app.schemas.ai_plan import GenerationPlan
from app.schemas.dataset import ColumnSpec, EdgeCaseConfig
from app.generator.domain_presets import DOMAIN_PRESETS

logger = logging.getLogger("uvicorn.error")

SYSTEM_PROMPT = """
You are an expert Synthetic Data Architect AI.
Your job is to analyze the user's natural language dataset request and convert it into a structured GenerationPlan JSON.

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY valid, raw JSON matching the required schema. Do NOT include markdown text outside the JSON code block.
2. You MUST NOT generate actual tabular data rows. You are creating the architectural execution PLAN for the Python generator.
3. Identify the domain: 'ecommerce', 'finance', 'healthcare', 'logistics', 'iot', or 'custom'.
4. Extract requested number of rows (default 1000 if unspecified, max 50000).
5. Extract requested edge case percentage (e.g., "10% failure cases" -> edge_case_pct: 0.10).
6. Build a comprehensive list of column specifications (name, data_type, distribution, min_val, max_val, mean, std, categories, probabilities, nullable).
   Supported data_types: 'uuid', 'string', 'numeric', 'integer', 'categorical', 'datetime'.
   Supported distributions: 'uniform', 'normal', 'poisson', 'choice'.
7. Extract relevant business rules and what-if scenario goals.

JSON OUTPUT STRUCTURE SCHEMA:
{
  "domain": "logistics",
  "num_rows": 5000,
  "scenario_summary": "Simulating logistics shipments with weather disruptions and delay spikes",
  "business_rules": ["Delay hours increase when weather is Severe Storm", "Delivery status set to Delayed if delay_hours > 12"],
  "columns": [
    {"name": "shipment_id", "data_type": "string", "prefix": "SHP-"},
    {"name": "weather_condition", "data_type": "categorical", "categories": ["Clear", "Rain", "Fog", "Severe Storm"], "probabilities": [0.5, 0.25, 0.15, 0.10]},
    {"name": "vehicle_type", "data_type": "categorical", "categories": ["Semi-Truck", "Cargo Van", "Freight Train", "Air Cargo"]},
    {"name": "delay_hours", "data_type": "integer", "distribution": "poisson", "mean": 4, "min_val": 0, "max_val": 72},
    {"name": "delivery_status", "data_type": "categorical", "categories": ["Delivered", "In Transit", "Delayed", "Cancelled"]}
  ],
  "edge_case_config": {
    "edge_case_pct": 0.10,
    "include_invalid": true,
    "include_boundary": true,
    "include_outliers": true,
    "include_missing": true,
    "include_duplicates": true,
    "include_contradictions": true
  }
}
"""

def generate_plan_from_prompt(prompt: str, seed: Optional[int] = None) -> GenerationPlan:
    """
    Parses a natural language request using Gemini AI to produce a structured GenerationPlan.
    Includes robust fallback logic if API key is missing or call fails.
    """
    api_key = os.getenv("GEMINI_API_KEY", settings.GEMINI_API_KEY).strip()

    if not api_key:
        logger.info("GEMINI_API_KEY not set. Using heuristic rule planner fallback.")
        return _fallback_heuristic_planner(prompt, seed)

    try:
        raw_json_str = _call_gemini_api(prompt, api_key)
        clean_json_str = _clean_json_output(raw_json_str)
        plan = GenerationPlan.model_validate_json(clean_json_str)
        if seed is not None:
            plan.seed = seed
        return plan

    except Exception as e:
        logger.error(f"Gemini API planning failed: {e}. Falling back to heuristic planner.")
        return _fallback_heuristic_planner(prompt, seed, str(e))


def _call_gemini_api(prompt: str, api_key: str) -> str:
    """Invokes Gemini model using available Python SDK."""
    full_prompt = f"{SYSTEM_PROMPT}\n\nUSER REQUEST: {prompt}"

    # Try official google.genai Client first
    try:
        import google.genai as genai
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=full_prompt
        )
        return response.text
    except Exception as err1:
        logger.debug(f"google.genai call failed ({err1}), trying google.generativeai fallback...")
        
    # Fallback to google.generativeai
    try:
        import google.generativeai as genai_legacy
        genai_legacy.configure(api_key=api_key)
        model = genai_legacy.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as err2:
        raise RuntimeError(f"Both Gemini SDKs failed: {err2}")


def _clean_json_output(raw_text: str) -> str:
    """Strips markdown backticks and extracts clean JSON substring."""
    cleaned = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", cleaned)
    if match:
        cleaned = match.group(1).strip()
    return cleaned


def _fallback_heuristic_planner(prompt: str, seed: Optional[int] = None, original_error: str = None) -> GenerationPlan:
    """
    Heuristic rule-based natural language parser fallback.
    Used if GEMINI_API_KEY is not set or API call fails.
    """
    prompt_lower = prompt.lower()

    # Determine domain
    domain = "custom"
    if "logistics" in prompt_lower or "shipment" in prompt_lower or "delivery" in prompt_lower:
        domain = "logistics"
    elif "ecommerce" in prompt_lower or "e-commerce" in prompt_lower or "order" in prompt_lower or "shopping" in prompt_lower or "product" in prompt_lower:
        domain = "ecommerce"
    elif "finance" in prompt_lower or "banking" in prompt_lower or "fraud" in prompt_lower or "transaction" in prompt_lower:
        domain = "finance"
    elif "patient" in prompt_lower or "health" in prompt_lower or "medical" in prompt_lower or "hospital" in prompt_lower:
        domain = "healthcare"
    elif "iot" in prompt_lower or "sensor" in prompt_lower or "device" in prompt_lower or "telemetry" in prompt_lower:
        domain = "iot"

    # Determine num_rows (extract numbers like 5000, 2500, 1000)
    num_rows = 1000
    row_numbers = [int(n) for n in re.findall(r"\b\d+\b", prompt_lower) if 1 <= int(n) <= 50000]
    if row_numbers:
        # Pick first candidate number that is not a percentage (e.g. 10 or 15)
        for val in row_numbers:
            if val not in [5, 10, 15, 20, 25, 30, 50] or val >= 100:
                num_rows = val
                break
            elif val > 10:
                num_rows = val

    # Determine edge_case_pct
    edge_pct = 0.10
    pct_match = re.search(r"(\d+(?:\.\d+)?)\s*%\s*(?:rare|failure|edge|anomal|outlier|error|cases)?", prompt_lower)
    if pct_match:
        edge_pct = min(float(pct_match.group(1)) / 100.0, 0.8)

    # Load baseline domain preset columns if domain identified
    if domain in DOMAIN_PRESETS:
        base_cols_raw = DOMAIN_PRESETS[domain]["columns"]
        columns = [ColumnSpec(**c) for c in base_cols_raw]
    else:
        columns = [
            ColumnSpec(name="record_id", data_type="uuid"),
            ColumnSpec(name="category", data_type="categorical", categories=["Type A", "Type B", "Type C"]),
            ColumnSpec(name="value_metric", data_type="numeric", min_val=10.0, max_val=500.0),
            ColumnSpec(name="quantity", data_type="integer", min_val=1, max_val=50),
            ColumnSpec(name="timestamp", data_type="datetime", start_days_ago=30)
        ]

    # Inject additional requested columns from prompt if mentioned
    if "weather" in prompt_lower and not any(c.name == "weather_condition" for c in columns):
        columns.append(ColumnSpec(
            name="weather_condition",
            data_type="categorical",
            categories=["Clear", "Rain", "Heavy Fog", "Snowstorm"],
            probabilities=[0.5, 0.25, 0.15, 0.10]
        ))
    if "vehicle" in prompt_lower and not any(c.name == "vehicle_type" for c in columns):
        columns.append(ColumnSpec(
            name="vehicle_type",
            data_type="categorical",
            categories=["Semi-Truck", "Cargo Van", "Freight Train", "Air Courier"]
        ))

    scenario_summary = f"Parsed request for {num_rows} {domain} records with {int(edge_pct * 100)}% edge cases"
    if original_error:
        scenario_summary += f" (Fallback Planner used: {original_error})"

    return GenerationPlan(
        domain=domain,
        num_rows=num_rows,
        scenario_summary=scenario_summary,
        business_rules=[
            f"Generate synthetic records for domain '{domain}'",
            f"Apply {int(edge_pct * 100)}% edge cases and failure scenarios"
        ],
        columns=columns,
        edge_case_config=EdgeCaseConfig(
            edge_case_pct=edge_pct,
            include_invalid=True,
            include_boundary=True,
            include_outliers=True,
            include_missing=True,
            include_duplicates=True,
            include_contradictions=True
        )
    )
