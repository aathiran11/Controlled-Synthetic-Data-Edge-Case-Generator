"""
Domain Preset Configurations for Synthetic Data Generation.
Defines column schemas, statistical parameters, and Faker providers for:
1. E-commerce
2. Finance
3. Healthcare
4. Logistics
5. IoT
"""

from typing import Dict, Any, List

DOMAIN_PRESETS: Dict[str, Dict[str, Any]] = {
    "ecommerce": {
        "id": "ecommerce",
        "name": "E-Commerce Transactions",
        "description": "Order records, customer details, pricing, discount percentages, and fulfillment status.",
        "target_column": "order_status",
        "primary_key": "order_id",
        "columns": [
            {"name": "order_id", "data_type": "uuid"},
            {"name": "customer_id", "data_type": "string", "prefix": "CUST-"},
            {"name": "product_name", "data_type": "categorical", "categories": [
                "Wireless Headphones", "Mechanical Keyboard", "Ergonomic Chair",
                "4K Monitor", "USB-C Docking Station", "Smartphone Stand",
                "Bluetooth Speaker", "Gaming Mouse", "Webcam 1080p", "Laptop Sleeve"
            ]},
            {"name": "price", "data_type": "numeric", "distribution": "uniform", "min_val": 15.0, "max_val": 499.0, "round_decimal": 2},
            {"name": "quantity", "data_type": "integer", "distribution": "poisson", "mean": 2, "min_val": 1, "max_val": 10},
            {"name": "discount_pct", "data_type": "numeric", "distribution": "uniform", "min_val": 0.0, "max_val": 0.35, "round_decimal": 2},
            {"name": "payment_method", "data_type": "categorical", "categories": ["Credit Card", "PayPal", "Debit Card", "Apple Pay", "Crypto"], "probabilities": [0.45, 0.25, 0.15, 0.10, 0.05]},
            {"name": "order_status", "data_type": "categorical", "categories": ["Completed", "Processing", "Shipped", "Cancelled", "Refunded"], "probabilities": [0.60, 0.15, 0.15, 0.06, 0.04]},
            {"name": "shipping_cost", "data_type": "numeric", "distribution": "uniform", "min_val": 3.99, "max_val": 25.0, "round_decimal": 2},
            {"name": "created_at", "data_type": "datetime", "start_days_ago": 90}
        ]
    },
    "finance": {
        "id": "finance",
        "name": "Financial Banking & Fraud",
        "description": "Account transactions, balances, credit scores, risk assessments, and merchant categories.",
        "target_column": "risk_score",
        "primary_key": "transaction_id",
        "columns": [
            {"name": "transaction_id", "data_type": "uuid"},
            {"name": "account_number", "data_type": "string", "prefix": "ACC-"},
            {"name": "transaction_type", "data_type": "categorical", "categories": ["Purchase", "Withdrawal", "Transfer", "Deposit", "Payment"], "probabilities": [0.50, 0.20, 0.15, 0.10, 0.05]},
            {"name": "amount", "data_type": "numeric", "distribution": "exponential", "mean": 125.0, "min_val": 1.0, "max_val": 2500.0, "round_decimal": 2},
            {"name": "balance_after", "data_type": "numeric", "distribution": "normal", "mean": 4500.0, "std": 1500.0, "min_val": 50.0, "max_val": 25000.0, "round_decimal": 2},
            {"name": "credit_score", "data_type": "integer", "distribution": "normal", "mean": 710, "std": 45, "min_val": 580, "max_val": 850},
            {"name": "merchant_category", "data_type": "categorical", "categories": ["Retail", "Groceries", "Electronics", "Travel", "Dining", "Utilities", "Entertainment"]},
            {"name": "risk_score", "data_type": "numeric", "distribution": "uniform", "min_val": 0.01, "max_val": 0.99, "round_decimal": 4},
            {"name": "location", "data_type": "categorical", "categories": ["New York, US", "London, UK", "Tokyo, JP", "Berlin, DE", "Toronto, CA", "Sydney, AU"]},
            {"name": "timestamp", "data_type": "datetime", "start_days_ago": 30}
        ]
    },
    "healthcare": {
        "id": "healthcare",
        "name": "Patient Vitals & Diagnostics",
        "description": "Patient vitals, blood pressure, oxygen saturation, heart rates, and diagnostic codes.",
        "target_column": "admission_type",
        "primary_key": "patient_id",
        "columns": [
            {"name": "patient_id", "data_type": "string", "prefix": "PAT-"},
            {"name": "age", "data_type": "integer", "distribution": "uniform", "min_val": 18, "max_val": 85},
            {"name": "gender", "data_type": "categorical", "categories": ["Male", "Female", "Other"], "probabilities": [0.48, 0.49, 0.03]},
            {"name": "heart_rate", "data_type": "integer", "distribution": "normal", "mean": 74, "std": 10, "min_val": 55, "max_val": 105},
            {"name": "blood_pressure_sys", "data_type": "integer", "distribution": "normal", "mean": 122, "std": 14, "min_val": 95, "max_val": 155},
            {"name": "blood_pressure_dia", "data_type": "integer", "distribution": "normal", "mean": 80, "std": 9, "min_val": 60, "max_val": 98},
            {"name": "oxygen_saturation", "data_type": "numeric", "distribution": "normal", "mean": 97.5, "std": 1.2, "min_val": 94.0, "max_val": 100.0, "round_decimal": 1},
            {"name": "bmi", "data_type": "numeric", "distribution": "normal", "mean": 26.2, "std": 4.1, "min_val": 18.5, "max_val": 38.0, "round_decimal": 1},
            {"name": "diagnosis_code", "data_type": "categorical", "categories": ["ICD-E11", "ICD-I10", "ICD-J45", "ICD-M54", "ICD-R07", "ICD-Z00"]},
            {"name": "admission_type", "data_type": "categorical", "categories": ["Outpatient", "Elective", "Urgent", "Emergency"], "probabilities": [0.45, 0.30, 0.15, 0.10]}
        ]
    },
    "logistics": {
        "id": "logistics",
        "name": "Logistics & Supply Chain",
        "description": "Shipments, transit distances, cargo weights, delivery status, and carrier performance.",
        "target_column": "delivery_status",
        "primary_key": "shipment_id",
        "columns": [
            {"name": "shipment_id", "data_type": "string", "prefix": "SHP-"},
            {"name": "origin_city", "data_type": "categorical", "categories": ["Chicago", "Los Angeles", "Seattle", "Miami", "Dallas", "Atlanta"]},
            {"name": "destination_city", "data_type": "categorical", "categories": ["New York", "San Francisco", "Houston", "Boston", "Denver", "Phoenix"]},
            {"name": "distance_km", "data_type": "integer", "distribution": "uniform", "min_val": 120, "max_val": 3500},
            {"name": "weight_kg", "data_type": "numeric", "distribution": "normal", "mean": 450.0, "std": 180.0, "min_val": 15.0, "max_val": 1200.0, "round_decimal": 1},
            {"name": "transit_days", "data_type": "integer", "distribution": "uniform", "min_val": 1, "max_val": 10},
            {"name": "delivery_status", "data_type": "categorical", "categories": ["Delivered", "In Transit", "Delayed", "Out for Delivery", "Returned"], "probabilities": [0.65, 0.15, 0.10, 0.06, 0.04]},
            {"name": "carrier", "data_type": "categorical", "categories": ["FedEx Logistics", "DHL Express", "UPS Ground", "Maersk Freight", "XPO Logistics"]},
            {"name": "fuel_cost", "data_type": "numeric", "distribution": "uniform", "min_val": 45.0, "max_val": 650.0, "round_decimal": 2},
            {"name": "delay_hours", "data_type": "integer", "distribution": "poisson", "mean": 2, "min_val": 0, "max_val": 48}
        ]
    },
    "iot": {
        "id": "iot",
        "name": "IoT Telemetry & Sensors",
        "description": "Industrial IoT sensors, telemetry readings, CPU load, pressure, battery, and error codes.",
        "target_column": "error_code",
        "primary_key": "device_id",
        "columns": [
            {"name": "device_id", "data_type": "string", "prefix": "IOT-DEV-"},
            {"name": "temperature", "data_type": "numeric", "distribution": "normal", "mean": 42.5, "std": 8.0, "min_val": 15.0, "max_val": 75.0, "round_decimal": 2},
            {"name": "humidity", "data_type": "numeric", "distribution": "uniform", "min_val": 20.0, "max_val": 85.0, "round_decimal": 1},
            {"name": "pressure", "data_type": "numeric", "distribution": "normal", "mean": 1013.25, "std": 15.0, "min_val": 970.0, "max_val": 1050.0, "round_decimal": 2},
            {"name": "battery_level", "data_type": "integer", "distribution": "uniform", "min_val": 10, "max_val": 100},
            {"name": "cpu_utilization", "data_type": "numeric", "distribution": "normal", "mean": 38.0, "std": 18.0, "min_val": 5.0, "max_val": 95.0, "round_decimal": 1},
            {"name": "firmware_version", "data_type": "categorical", "categories": ["v1.0.4", "v1.1.0", "v2.0.1", "v2.1.0-rc2"], "probabilities": [0.15, 0.45, 0.30, 0.10]},
            {"name": "error_code", "data_type": "categorical", "categories": ["ERR_NONE", "ERR_TEMP_WARN", "ERR_VOLTAGE_LOW", "ERR_PACKET_DROP", "ERR_CRITICAL_HALT"], "probabilities": [0.75, 0.12, 0.07, 0.04, 0.02]},
            {"name": "uptime_seconds", "data_type": "integer", "distribution": "uniform", "min_val": 3600, "max_val": 2592000},
            {"name": "timestamp", "data_type": "datetime", "start_days_ago": 7}
        ]
    }
}

def get_domain_info_list() -> List[Dict[str, Any]]:
    """Returns metadata for all supported domains."""
    result = []
    for domain_id, config in DOMAIN_PRESETS.items():
        sample_cols = [c["name"] for c in config["columns"]]
        result.append({
            "id": domain_id,
            "name": config["name"],
            "description": config["description"],
            "target_column": config["target_column"],
            "sample_columns": sample_cols[:5],
            "column_count": len(config["columns"])
        })
    return result
