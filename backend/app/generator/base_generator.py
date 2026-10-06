"""
Base Synthetic Data Generator Engine.
Generates baseline realistic clean datasets using NumPy, Pandas, Faker, and SciPy.
Supports random seeds for full reproducibility.
"""

import uuid
import datetime
import numpy as np
import pandas as pd
from faker import Faker
from typing import Dict, Any, List, Optional
from app.generator.domain_presets import DOMAIN_PRESETS

fake = Faker()

def _generate_seeded_uuid() -> str:
    """Generates a deterministic UUID string based on NumPy random state."""
    raw_bytes = bytes(np.random.randint(0, 256, size=16, dtype=np.uint8))
    return str(uuid.UUID(bytes=raw_bytes, version=4))

def generate_clean_dataset(
    domain_name: str = "ecommerce",
    num_rows: int = 100,
    seed: Optional[int] = None,
    custom_columns: Optional[List[Dict[str, Any]]] = None
) -> pd.DataFrame:
    """
    Generates a clean synthetic dataset based on a domain preset or custom column definitions.
    
    Args:
        domain_name: One of ['ecommerce', 'finance', 'healthcare', 'logistics', 'iot']
        num_rows: Number of rows to generate
        seed: Random seed for NumPy/Faker reproducibility
        custom_columns: List of column specifications if domain is custom
        
    Returns:
        Pandas DataFrame containing clean synthetic rows with edge-case metadata flags.
    """
    if seed is not None:
        np.random.seed(seed)
        Faker.seed(seed)

    if custom_columns:
        columns_config = custom_columns
    else:
        preset = DOMAIN_PRESETS.get(domain_name.lower())
        if not preset:
            raise ValueError(f"Unknown domain '{domain_name}'. Supported domains: {list(DOMAIN_PRESETS.keys())}")
        columns_config = preset["columns"]

    data_dict = {}

    for col in columns_config:
        col_name = col["name"]
        data_type = col.get("data_type", "string")

        if data_type == "uuid":
            data_dict[col_name] = [_generate_seeded_uuid() for _ in range(num_rows)]

        elif data_type == "string":
            prefix = col.get("prefix", "ID-")
            data_dict[col_name] = [f"{prefix}{np.random.randint(10000, 99999)}" for _ in range(num_rows)]

        elif data_type == "categorical":
            categories = col.get("categories", ["Category A", "Category B"])
            probs = col.get("probabilities", None)
            if probs and len(probs) == len(categories):
                # Normalize probabilities to sum to 1
                probs = np.array(probs) / np.sum(probs)
            else:
                probs = None
            data_dict[col_name] = np.random.choice(categories, size=num_rows, p=probs)

        elif data_type in ["numeric", "float"]:
            dist = col.get("distribution", "uniform")
            min_v = col.get("min_val", 0.0)
            max_v = col.get("max_val", 100.0)
            decimals = col.get("round_decimal", 2)

            if dist == "normal":
                mean = col.get("mean", (min_v + max_v) / 2)
                std = col.get("std", (max_v - min_v) / 6)
                raw_vals = np.random.normal(mean, std, size=num_rows)
                raw_vals = np.clip(raw_vals, min_v, max_v)
            elif dist == "exponential":
                scale = col.get("mean", 50.0)
                raw_vals = np.random.exponential(scale, size=num_rows)
                raw_vals = np.clip(raw_vals, min_v, max_v)
            else:  # uniform
                raw_vals = np.random.uniform(min_v, max_v, size=num_rows)

            data_dict[col_name] = np.round(raw_vals, decimals)

        elif data_type in ["integer", "int"]:
            dist = col.get("distribution", "uniform")
            min_v = int(col.get("min_val", 1))
            max_v = int(col.get("max_val", 100))

            if dist == "normal":
                mean = col.get("mean", (min_v + max_v) / 2)
                std = col.get("std", (max_v - min_v) / 6)
                raw_vals = np.random.normal(mean, std, size=num_rows)
                raw_vals = np.clip(raw_vals, min_v, max_v).astype(int)
            elif dist == "poisson":
                lam = col.get("mean", 3)
                raw_vals = np.random.poisson(lam, size=num_rows)
                raw_vals = np.clip(raw_vals, min_v, max_v).astype(int)
            else:  # uniform
                raw_vals = np.random.randint(min_v, max_v + 1, size=num_rows)

            data_dict[col_name] = raw_vals

        elif data_type == "datetime":
            days_ago = col.get("start_days_ago", 30)
            now = datetime.datetime(2026, 1, 1, 12, 0, 0) if seed is not None else datetime.datetime.now()
            start_date = now - datetime.timedelta(days=days_ago)
            # Generate random seconds offset
            random_offsets = np.random.randint(0, int(days_ago * 86400), size=num_rows)
            data_dict[col_name] = [(start_date + datetime.timedelta(seconds=int(offset))).strftime("%Y-%m-%d %H:%M:%S") for offset in random_offsets]

        else:
            # Fallback string generator
            data_dict[col_name] = [f"item-{np.random.randint(100, 999)}" for _ in range(num_rows)]

    df = pd.DataFrame(data_dict)

    # Attach baseline edge case metadata columns required by specification
    df["is_edge_case"] = False
    df["edge_case_type"] = "none"
    df["edge_case_severity"] = "none"
    df["edge_case_description"] = "Normal clean synthetic record"

    return df
