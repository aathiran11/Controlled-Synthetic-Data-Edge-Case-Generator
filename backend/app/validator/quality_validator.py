"""
Data Quality Validation Engine.
Performs comprehensive quality, schema, consistency, contradiction, outlier,
and PII audits on synthetic datasets. Calculates overall Data Quality Score (0-100).
"""

import re
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple
from app.schemas.validation import (
    ValidationIssue,
    ValidationMetrics,
    ValidationReportResponse
)

# Regular expressions for PII detection
PII_PATTERNS = {
    "email": re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"),
    "ssn": re.compile(r"\b\d{3}-\d{2}-\d{4}\b"),
    "credit_card": re.compile(r"\b(?:\d[ -]*?){13,16}\b"),
    "phone": re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
}

def validate_dataset(records: List[Dict[str, Any]], domain: str = "ecommerce") -> ValidationReportResponse:
    """
    Validates a tabular dataset (list of dictionaries) against schema, consistency, range,
    contradiction, outlier, and PII standards.
    """
    if not records:
        return ValidationReportResponse(
            success=False,
            quality_score=0.0,
            quality_grade="F",
            metrics=ValidationMetrics(
                total_records=0, clean_records=0, corrupted_records=0,
                missing_value_count=0, invalid_type_count=0, range_violation_count=0,
                contradiction_count=0, duplicate_record_count=0, outlier_count=0, pii_pattern_count=0
            ),
            issues=[ValidationIssue(issue_type="empty_dataset", severity="critical", column="all", count=0, message="Empty dataset provided")],
            domain=domain,
            summary_text="Dataset is empty. Quality Score: 0/100 (Grade: F)"
        )

    df = pd.DataFrame(records)
    total_rows = len(df)
    data_cols = [c for c in df.columns if c not in ["is_edge_case", "edge_case_type", "edge_case_severity", "edge_case_description"]]

    issues: List[ValidationIssue] = []

    # 1. Missing Values Audit
    missing_value_count = int(df[data_cols].isnull().sum().sum())
    if missing_value_count > 0:
        for col in data_cols:
            col_missing = int(df[col].isnull().sum())
            if col_missing > 0:
                issues.append(ValidationIssue(
                    issue_type="missing_value",
                    severity="medium",
                    column=col,
                    count=col_missing,
                    message=f"Column '{col}' contains {col_missing} missing / NULL values."
                ))

    # 2. Duplicate Primary Keys / Rows Audit
    pk_cols = [c for c in data_cols if "id" in c or "key" in c or "number" in c]
    duplicate_count = 0
    if pk_cols:
        pk_col = pk_cols[0]
        duplicate_count = int(df[pk_col].duplicated().sum())
        if duplicate_count > 0:
            issues.append(ValidationIssue(
                issue_type="duplicate_primary_key",
                severity="high",
                column=pk_col,
                count=duplicate_count,
                message=f"Primary key column '{pk_col}' contains {duplicate_count} duplicate identifiers."
            ))

    # 3. Invalid Values / Range Violations Audit
    invalid_type_count = 0
    range_violation_count = 0

    for col in data_cols:
        col_series = df[col].dropna()
        if col_series.empty:
            continue

        # Check strings injected into numeric fields or negative limits
        if "price" in col or "cost" in col or "amount" in col or "weight" in col or "quantity" in col:
            # Check negative values
            neg_mask = col_series.apply(lambda v: isinstance(v, (int, float)) and v < 0)
            neg_count = int(neg_mask.sum())
            if neg_count > 0:
                range_violation_count += neg_count
                issues.append(ValidationIssue(
                    issue_type="range_violation",
                    severity="high",
                    column=col,
                    count=neg_count,
                    message=f"Column '{col}' contains {neg_count} negative value violations."
                ))

            # Check text string injection
            str_mask = col_series.apply(lambda v: isinstance(v, str) and not v.replace(".", "", 1).replace("-", "", 1).isdigit())
            str_count = int(str_mask.sum())
            if str_count > 0:
                invalid_type_count += str_count
                issues.append(ValidationIssue(
                    issue_type="invalid_type",
                    severity="critical",
                    column=col,
                    count=str_count,
                    message=f"Column '{col}' contains {str_count} corrupted string values in numeric field."
                ))

        if "heart_rate" in col:
            invalid_hr = int(col_series.apply(lambda v: isinstance(v, (int, float)) and (v < 30 or v > 250)).sum())
            if invalid_hr > 0:
                range_violation_count += invalid_hr
                issues.append(ValidationIssue(
                    issue_type="range_violation",
                    severity="high",
                    column=col,
                    count=invalid_hr,
                    message=f"Physiological violation: {invalid_hr} heart rate readings outside 30-250 bpm range."
                ))

        if "oxygen" in col:
            invalid_ox = int(col_series.apply(lambda v: isinstance(v, (int, float)) and (v < 50.0 or v > 100.0)).sum())
            if invalid_ox > 0:
                range_violation_count += invalid_ox
                issues.append(ValidationIssue(
                    issue_type="range_violation",
                    severity="high",
                    column=col,
                    count=invalid_ox,
                    message=f"Physiological violation: {invalid_ox} oxygen saturation readings outside 50-100% range."
                ))

    # 4. Business Rule & Contradiction Audit
    contradiction_count = 0

    if "blood_pressure_sys" in df.columns and "blood_pressure_dia" in df.columns:
        bp_mask = df.apply(
            lambda r: isinstance(r.get("blood_pressure_sys"), (int, float)) and
                      isinstance(r.get("blood_pressure_dia"), (int, float)) and
                      r["blood_pressure_sys"] < r["blood_pressure_dia"],
            axis=1
        )
        bp_contradictions = int(bp_mask.sum())
        if bp_contradictions > 0:
            contradiction_count += bp_contradictions
            issues.append(ValidationIssue(
                issue_type="contradiction",
                severity="critical",
                column="blood_pressure_sys",
                count=bp_contradictions,
                message=f"Logical contradiction: {bp_contradictions} rows have Systolic BP lower than Diastolic BP."
            ))

    if "order_status" in df.columns and "shipping_cost" in df.columns:
        cancel_mask = df.apply(
            lambda r: r.get("order_status") == "Cancelled" and isinstance(r.get("shipping_cost"), (int, float)) and r["shipping_cost"] > 40.0,
            axis=1
        )
        cancel_contradictions = int(cancel_mask.sum())
        if cancel_contradictions > 0:
            contradiction_count += cancel_contradictions
            issues.append(ValidationIssue(
                issue_type="contradiction",
                severity="critical",
                column="order_status",
                count=cancel_contradictions,
                message=f"Logical contradiction: {cancel_contradictions} cancelled orders have active shipping costs."
            ))

    if "delivery_status" in df.columns and "transit_days" in df.columns:
        deliv_mask = df.apply(
            lambda r: r.get("delivery_status") == "Delivered" and r.get("transit_days") == 0 and isinstance(r.get("distance_km"), (int, float)) and r.get("distance_km", 0) > 1000,
            axis=1
        )
        deliv_contradictions = int(deliv_mask.sum())
        if deliv_contradictions > 0:
            contradiction_count += deliv_contradictions
            issues.append(ValidationIssue(
                issue_type="contradiction",
                severity="critical",
                column="delivery_status",
                count=deliv_contradictions,
                message=f"Logical contradiction: {deliv_contradictions} shipments marked Delivered for >1000km distance in 0 days."
            ))

    # 5. Outlier Detection (Numeric > 3 std dev)
    outlier_count = 0
    numeric_cols = [c for c in data_cols if pd.api.types.is_numeric_dtype(df[c])]
    for col in numeric_cols:
        col_clean = pd.to_numeric(df[col], errors="coerce").dropna()
        if len(col_clean) > 10 and col_clean.std() > 0:
            z_scores = np.abs((col_clean - col_clean.mean()) / col_clean.std())
            col_outliers = int((z_scores > 3.5).sum())
            if col_outliers > 0:
                outlier_count += col_outliers
                issues.append(ValidationIssue(
                    issue_type="outlier",
                    severity="medium",
                    column=col,
                    count=col_outliers,
                    message=f"Statistical outlier: Column '{col}' contains {col_outliers} values exceeding 3.5 std dev."
                ))

    # 6. PII Pattern Detection
    pii_pattern_count = 0
    for col in data_cols:
        str_vals = df[col].dropna().astype(str)
        for pii_name, pattern in PII_PATTERNS.items():
            if col in ["customer_id", "patient_id", "transaction_id", "email"]:
                continue
            pii_matches = int(str_vals.apply(lambda s: bool(pattern.search(s))).sum())
            if pii_matches > 0:
                pii_pattern_count += pii_matches
                issues.append(ValidationIssue(
                    issue_type="pii_detected",
                    severity="medium",
                    column=col,
                    count=pii_matches,
                    message=f"PII pattern: Column '{col}' contains {pii_matches} potential {pii_name.upper()} patterns."
                ))

    # Calculate Data Quality Score (0 to 100)
    total_cells = max(1, total_rows * len(data_cols))
    
    missing_penalty = min(20.0, (missing_value_count / total_cells) * 200.0)
    invalid_penalty = min(25.0, (invalid_type_count / total_rows) * 100.0)
    range_penalty = min(20.0, (range_violation_count / total_rows) * 100.0)
    contradiction_penalty = min(25.0, (contradiction_count / total_rows) * 100.0)
    duplicate_penalty = min(15.0, (duplicate_count / total_rows) * 100.0)
    outlier_penalty = min(10.0, (outlier_count / total_rows) * 40.0)

    quality_score = max(0.0, round(100.0 - (missing_penalty + invalid_penalty + range_penalty + contradiction_penalty + duplicate_penalty + outlier_penalty), 1))

    if quality_score >= 95.0:
        grade = "A+"
    elif quality_score >= 90.0:
        grade = "A"
    elif quality_score >= 80.0:
        grade = "B"
    elif quality_score >= 70.0:
        grade = "C"
    elif quality_score >= 60.0:
        grade = "D"
    else:
        grade = "F"

    # Edge Case breakdown summary if present
    if "is_edge_case" in df.columns:
        corrupted_records = int(df["is_edge_case"].sum())
    else:
        corrupted_records = int(missing_value_count > 0 or invalid_type_count > 0 or contradiction_count > 0)
    
    clean_records = total_rows - corrupted_records

    metrics = ValidationMetrics(
        total_records=total_rows,
        clean_records=clean_records,
        corrupted_records=corrupted_records,
        missing_value_count=missing_value_count,
        invalid_type_count=invalid_type_count,
        range_violation_count=range_violation_count,
        contradiction_count=contradiction_count,
        duplicate_record_count=duplicate_count,
        outlier_count=outlier_count,
        pii_pattern_count=pii_pattern_count
    )

    summary_text = (
        f"Data Quality Score: {quality_score}/100 (Grade: {grade}). "
        f"Audited {total_rows} records ({clean_records} clean, {corrupted_records} corrupted). "
        f"Identified {len(issues)} distinct quality issues across {len(data_cols)} columns."
    )

    return ValidationReportResponse(
        success=True,
        quality_score=quality_score,
        quality_grade=grade,
        metrics=metrics,
        issues=issues,
        domain=domain,
        summary_text=summary_text
    )
