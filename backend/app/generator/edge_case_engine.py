"""
Edge-Case & Failure Scenario Injection Engine.
Injects controlled boundary values, missing data, invalid inputs, outliers,
duplicates, logical contradictions, and domain-specific failure scenarios.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from app.schemas.dataset import EdgeCaseConfig, EdgeCaseSummary

def inject_edge_cases(
    df: pd.DataFrame,
    domain_name: str = "ecommerce",
    config: EdgeCaseConfig = EdgeCaseConfig(),
    seed: int = None
) -> Tuple[pd.DataFrame, EdgeCaseSummary]:
    """
    Modifies a baseline DataFrame by injecting controlled edge cases into a target percentage of rows.
    
    Args:
        df: Input clean DataFrame
        domain_name: Domain name ('ecommerce', 'finance', 'healthcare', 'logistics', 'iot')
        config: EdgeCaseConfig parameters specifying ratio and enabled injection types
        seed: Random seed for deterministic injection
        
    Returns:
        Tuple of (modified_df, summary_metrics)
    """
    if seed is not None:
        np.random.seed(seed)

    # Convert all columns to object dtype to allow mixed invalid types (strings in numeric columns, nulls, etc.)
    df = df.astype(object)
    num_rows = len(df)
    target_count = int(num_rows * config.edge_case_pct)

    if target_count == 0:
        summary = EdgeCaseSummary(
            total_edge_cases=0,
            edge_case_percentage=0.0,
            breakdown_by_type={},
            breakdown_by_severity={"none": num_rows}
        )
        return df, summary

    # Determine enabled edge-case types based on configuration flags
    enabled_types = []
    if config.include_boundary:
        enabled_types.append("boundary_violation")
    if config.include_missing:
        enabled_types.append("missing_value")
    if config.include_invalid:
        enabled_types.append("invalid_value")
    if config.include_outliers:
        enabled_types.append("outlier")
    if config.include_duplicates:
        enabled_types.append("duplicate")
    if config.include_contradictions:
        enabled_types.append("contradiction")
    
    # Always allow domain_failure if invalid/contradiction are enabled
    if config.include_invalid:
        enabled_types.append("domain_failure")

    if not enabled_types:
        enabled_types = ["boundary_violation"]

    # Select random unique row indices for edge case injection
    selected_indices = np.random.choice(df.index, size=target_count, replace=False)
    
    type_counts: Dict[str, int] = {}
    severity_counts: Dict[str, int] = {"low": 0, "medium": 0, "high": 0, "critical": 0, "none": num_rows - target_count}

    for idx in selected_indices:
        chosen_type = np.random.choice(enabled_types)
        severity, description = _apply_edge_case(df, idx, chosen_type, domain_name)
        
        df.at[idx, "is_edge_case"] = True
        df.at[idx, "edge_case_type"] = chosen_type
        df.at[idx, "edge_case_severity"] = severity
        df.at[idx, "edge_case_description"] = description

        type_counts[chosen_type] = type_counts.get(chosen_type, 0) + 1
        severity_counts[severity] = severity_counts.get(severity, 0) + 1

    summary = EdgeCaseSummary(
        total_edge_cases=target_count,
        edge_case_percentage=round((target_count / num_rows) * 100, 2),
        breakdown_by_type=type_counts,
        breakdown_by_severity=severity_counts
    )

    return df, summary


def _apply_edge_case(df: pd.DataFrame, idx: int, ec_type: str, domain: str) -> Tuple[str, str]:
    """
    Applies a specific edge case mutation to row at `idx` in `df`.
    Returns (severity, description).
    """
    cols = [c for c in df.columns if c not in ["is_edge_case", "edge_case_type", "edge_case_severity", "edge_case_description"]]
    
    if ec_type == "boundary_violation":
        # Realistic or extreme boundary
        col = np.random.choice([c for c in cols if "id" not in c and "key" not in c and "number" in c] or cols)
        if "age" in col:
            df.at[idx, col] = np.random.choice([0, 105, 115])
            desc = f"Boundary violation: Patient age set to extreme boundary ({df.at[idx, col]})"
        elif "oxygen" in col:
            df.at[idx, col] = np.random.choice([85.0, 100.0])
            desc = f"Boundary violation: Oxygen saturation at critical limit ({df.at[idx, col]}%)"
        elif "discount" in col:
            df.at[idx, col] = 0.99
            desc = "Boundary violation: Discount percentage set to maximum boundary (99%)"
        elif "battery" in col:
            df.at[idx, col] = 1
            desc = "Boundary violation: Device battery at critical 1% threshold"
        elif "credit_score" in col:
            df.at[idx, col] = 300
            desc = "Boundary violation: Credit score at absolute minimum (300)"
        else:
            df.at[idx, col] = 0.0
            desc = f"Boundary violation: '{col}' set to zero boundary limit"
        return "low", desc

    elif ec_type == "missing_value":
        # Introduce NULL / None / NaN
        col = np.random.choice([c for c in cols if "id" not in c and "key" not in c] or cols)
        df.at[idx, col] = None
        desc = f"Missing value: Required field '{col}' contains NULL / None"
        return "medium", desc

    elif ec_type == "invalid_value":
        # Intentionally invalid data format, negative numbers, or impossible types
        if domain == "ecommerce":
            target = np.random.choice(["price", "quantity", "discount_pct"])
            if target == "price":
                df.at[idx, "price"] = -149.99
                desc = "Invalid value: Negative product price (-$149.99)"
            elif target == "quantity":
                df.at[idx, "quantity"] = -10
                desc = "Invalid value: Negative order quantity (-10)"
            else:
                df.at[idx, "discount_pct"] = 2.5
                desc = "Invalid value: Discount percentage exceeding 100% (250%)"
        elif domain == "finance":
            target = np.random.choice(["amount", "credit_score", "balance_after"])
            if target == "amount":
                df.at[idx, "amount"] = -500.00
                desc = "Invalid value: Negative transaction amount (-$500.00)"
            elif target == "credit_score":
                df.at[idx, "credit_score"] = 9999
                desc = "Invalid value: Credit score out of valid 300-850 range (9999)"
            else:
                df.at[idx, "balance_after"] = "CORRUPTED_TEXT_VAL"
                desc = "Invalid value: String text value injected into numeric balance column"
        elif domain == "healthcare":
            target = np.random.choice(["heart_rate", "oxygen_saturation", "age"])
            if target == "heart_rate":
                df.at[idx, "heart_rate"] = 350
                desc = "Invalid value: Impossible physiological heart rate (350 bpm)"
            elif target == "oxygen_saturation":
                df.at[idx, "oxygen_saturation"] = -15.0
                desc = "Invalid value: Negative oxygen saturation (-15.0%)"
            else:
                df.at[idx, "age"] = -5
                desc = "Invalid value: Negative patient age (-5 years)"
        elif domain == "logistics":
            target = np.random.choice(["weight_kg", "distance_km", "delay_hours"])
            if target == "weight_kg":
                df.at[idx, "weight_kg"] = -250.0
                desc = "Invalid value: Negative cargo weight (-250.0 kg)"
            elif target == "distance_km":
                df.at[idx, "distance_km"] = -1500
                desc = "Invalid value: Negative shipping distance (-1500 km)"
            else:
                df.at[idx, "delay_hours"] = -24
                desc = "Invalid value: Negative transit delay hours (-24 hrs)"
        else: # IoT
            target = np.random.choice(["battery_level", "temperature", "humidity"])
            if target == "battery_level":
                df.at[idx, "battery_level"] = 250
                desc = "Invalid value: Battery level exceeding 100% capacity (250%)"
            elif target == "temperature":
                df.at[idx, "temperature"] = -273.15
                desc = "Invalid value: Sensor temperature at absolute zero (-273.15°C)"
            else:
                df.at[idx, "humidity"] = "ERR_READ_FAIL"
                desc = "Invalid value: Sensor read failure text in numeric humidity column"
        return "high", desc

    elif ec_type == "outlier":
        # Extreme statistical anomaly
        col = np.random.choice([c for c in cols if "id" not in c and "key" not in c and "number" in c] or cols)
        
        if "amount" in col or "price" in col or "cost" in col:
            df.at[idx, col] = 95000.00
            desc = f"Statistical Outlier: Extreme high transaction amount ($95,000.00) in '{col}'"
        elif "temp" in col:
            df.at[idx, col] = 220.50
            desc = f"Statistical Outlier: Severe sensor temperature spike (220.50°C) in '{col}'"
        elif "weight" in col:
            df.at[idx, col] = 45000.0
            desc = f"Statistical Outlier: Extreme freight cargo weight (45,000 kg) in '{col}'"
        elif "heart_rate" in col:
            df.at[idx, col] = 210
            desc = f"Statistical Outlier: Extreme tachycardic heart rate surge (210 bpm) in '{col}'"
        else:
            val = float(df.at[idx, col]) if isinstance(df.at[idx, col], (int, float)) else 100.0
            df.at[idx, col] = val * 50
            desc = f"Statistical Outlier: Value in '{col}' boosted by 50x median factor"
        return "high", desc

    elif ec_type == "duplicate":
        # Duplicate primary key or exact duplicate record
        pk_cols = [c for c in cols if "id" in c or "key" in c or "number" in c]
        if pk_cols:
            pk_col = pk_cols[0]
            # Copy PK from a previous row
            prev_idx = (idx - 1) % len(df)
            duplicated_key = df.at[prev_idx, pk_col]
            df.at[idx, pk_col] = duplicated_key
            desc = f"Duplicate primary key: Repeated identifier '{duplicated_key}' in column '{pk_col}'"
        else:
            desc = "Duplicate record: Duplicate entry generated"
        return "high", desc

    elif ec_type == "contradiction":
        # Logical contradiction between multiple fields
        if domain == "healthcare":
            df.at[idx, "blood_pressure_sys"] = 70
            df.at[idx, "blood_pressure_dia"] = 135
            desc = "Logical contradiction: Systolic blood pressure (70) lower than Diastolic (135)"
        elif domain == "ecommerce":
            df.at[idx, "order_status"] = "Cancelled"
            df.at[idx, "shipping_cost"] = 49.99
            df.at[idx, "quantity"] = 0
            desc = "Logical contradiction: Order status is 'Cancelled' but shipping cost is $49.99 and quantity is 0"
        elif domain == "finance":
            df.at[idx, "transaction_type"] = "Withdrawal"
            df.at[idx, "amount"] = 5000.00
            df.at[idx, "credit_score"] = 300
            df.at[idx, "risk_score"] = 0.0001
            desc = "Logical contradiction: High $5,000 withdrawal with credit score 300 flagged with 0.0001 zero risk score"
        elif domain == "logistics":
            df.at[idx, "delivery_status"] = "Delivered"
            df.at[idx, "transit_days"] = 0
            df.at[idx, "distance_km"] = 3200
            desc = "Logical contradiction: Delivery status 'Delivered' for 3200 km distance with 0 transit days"
        else: # IoT
            df.at[idx, "error_code"] = "ERR_NONE"
            df.at[idx, "temperature"] = 125.0
            df.at[idx, "cpu_utilization"] = 100.0
            desc = "Logical contradiction: IoT sensor error code is 'ERR_NONE' during 125°C overheat and 100% CPU load"
        return "critical", desc

    else: # domain_failure
        if domain == "iot":
            df.at[idx, "firmware_version"] = "v0.0.0-UNFLASHED"
            df.at[idx, "error_code"] = "HARDWARE_FAULT_0xDEADBEEF"
            desc = "Domain failure: Device hardware fault with unflashed firmware signature"
        elif domain == "healthcare":
            df.at[idx, "diagnosis_code"] = "ICD-UNKNOWN-CORRUPT"
            desc = "Domain failure: Unmapped corrupted ICD diagnosis code format"
        elif domain == "logistics":
            df.at[idx, "carrier"] = "UNKNOWN_UNREGISTERED_CARRIER"
            df.at[idx, "delivery_status"] = "LOST_IN_TRANSIT"
            desc = "Domain failure: Freight lost with unregistered logistics carrier"
        elif domain == "finance":
            df.at[idx, "merchant_category"] = "FRAUD_BLACKLISTED_VENDOR"
            df.at[idx, "risk_score"] = 1.000
            desc = "Domain failure: Blacklisted fraud merchant transaction"
        else:
            df.at[idx, "order_status"] = "PAYMENT_GATEWAY_TIMEOUT"
            desc = "Domain failure: Payment gateway transaction timeout"
        return "critical", desc
