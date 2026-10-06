# Controlled Synthetic Data & Edge-Case Generator (PSA 07)

An AI-powered platform to generate domain-specific synthetic datasets, inject targeted edge cases and operational failure anomalies, audit dataset quality (0–100 score), stress-test downstream machine learning models under distribution shifts, and simulate "what-if" operational disruption scenarios.

---

## Key Features

1. **Natural-Language AI Planning**: Gemini AI (`gemini-2.5-flash` / `gemini-1.5-flash`) translates natural-language dataset requests into structured `GenerationPlan` JSON schemas.
2. **Deterministic Data Engine**: Programmatic array generation using Python, NumPy, Pandas, Faker, and SciPy supporting random seeds for 100% reproducible data.
3. **5 Domain Presets**: Built-in support for E-Commerce, Finance, Healthcare, Logistics, and IoT Telemetry.
4. **Controlled Edge-Case Injection**: Injects 7 anomaly types (`boundary_violation`, `missing_value`, `invalid_value`, `outlier`, `duplicate`, `contradiction`, `domain_failure`) with severity ratings.
5. **Data Quality Auditor**: Evaluates schema consistency, missingness, range bounds, logical contradictions, standard deviation outliers, and PII patterns to generate a **0–100 Data Quality Score**.
6. **ML Stress Testing**: Trains Scikit-Learn classifiers (`RandomForestClassifier`) on clean data and measures performance metrics (Accuracy, Precision, Recall, F1) when exposed to edge-case distribution shifts.
7. **What-If Scenario Simulation**: Evaluates identical pre-trained model instances on baseline vs simulated disruption scenarios (e.g. severe blizzard weather, missing spikes, delay surges).
8. **Interactive Dashboard & CSV Export**: React + Vite + Tailwind glassmorphic dashboard with live KPIs, Recharts graphs, searchable dataset preview table, and full CSV export.

---

## Technical Architecture & Workflow

```
User Prompt / UI Selection
           │
           ▼
FastAPI Gateway App (/backend)
           │
           ├── (Natural Language Planning)
           │   └── Gemini 2.5 AI Planner (planner.py) ──> Structured GenerationPlan JSON
           │
           └── (Synthetic Dataset Generation)
               └── Python Engine (base_generator.py)  ──> Vectorized Clean Tabular Data
                       │
                       ▼
               Edge-Case Engine (edge_case_engine.py)  ──> Controlled Anomaly Injection
                       │
                       +-------------------------------+-------------------------------+
                       │                               │                               │
                       ▼                               v                               v
             Quality Validator                 ML Stress Tester               What-If Scenario Engine
           (quality_validator.py)             (stress_tester.py)               (scenario_engine.py)
                       │                               │                               │
                       +-------------------------------+-------------------------------+
                                                       │
                                                       ▼
                                             React Dashboard UI
                                            + Full CSV Download
```

> [!IMPORTANT]
> **AI vs. Deterministic Engine Clarification**:  
> - **Gemini AI** is used exclusively as the **natural-language schema architect**. It outputs architectural JSON plans (`GenerationPlan`) and **never generates raw tabular rows**.  
> - **Python (Pandas, NumPy, Faker)** performs all deterministic array generation locally, enabling instant, zero-cost creation of up to 50,000 rows.  
> - **Scikit-Learn** executes ML model training and robustness stress testing.

---

## Verified Canonical ML Benchmark

Evaluated using `MLTrainTestRequest(domain="logistics", num_rows=2000, edge_case_pct=0.20, seed=42, model_type="random_forest")`:

| Split | Evaluated Rows | Target Column | Accuracy | Precision | Recall | F1 Score |
| :--- | ---: | :--- | ---: | ---: | ---: | ---: |
| **Clean Test Set** | 400 | `is_delayed` | **0.8050** ($80.50\%$) | **0.8046** ($80.46\%$) | **0.9937** ($99.37\%$) | **0.8892** ($88.92\%$) |
| **Edge Test Set** | 1,200 | `is_delayed` | **0.8450** ($84.50\%$) | **0.8754** ($87.54\%$) | **0.9578** ($95.78\%$) | **0.9148** ($91.48\%$) |

- **Clean Confusion Matrix**: $\begin{pmatrix} 9 & 76 \\ 2 & 313 \end{pmatrix}$
- **Edge Confusion Matrix**: $\begin{pmatrix} 16 & 142 \\ 44 & 998 \end{pmatrix}$
- **F1 Performance Shift**: $+0.0256$ (+2.87% F1 Shift) | **Rating**: `Highly Resilient (< 5% Drop)`
- **Mathematical Alignment**: `sklearn` binary metrics match confusion matrix formulas to $< 10^{-10}$ floating-point tolerance.

---

## Installation & Setup

### Prerequisites
- **Python**: 3.9+
- **Node.js**: 18+

### 1. Environment Configuration
Create a `.env` file in the project root or `/backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If `GEMINI_API_KEY` is omitted, the system seamlessly falls back to a rule-based heuristic natural-language parser).*

### 2. Backend Setup & Test Run
```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt

# Run Unit Tests:
python -m unittest discover -s tests

# Start FastAPI Uvicorn Dev Server:
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Frontend Setup & Build
```bash
cd frontend
npm install

# Production Build Verification:
npm run build

# Start Vite Dev Server:
npm run dev
```

Dashboard access: `http://localhost:5173`  
Backend API Health: `http://127.0.0.1:8000/api/health`

---

## API Endpoints Summary

- `GET /api/health` — Health status & Gemini API key diagnostics
- `GET /api/domains` — Retrieve available domain presets metadata
- `POST /api/generate` — Generate clean synthetic dataset
- `POST /api/generate/edge-cases` — Generate dataset with controlled edge cases
- `POST /api/ai/plan` — Translate natural language prompt into GenerationPlan JSON
- `POST /api/validate` — Audit dataset for Quality Score (0–100) & PII patterns
- `POST /api/ml/train-test` — Train ML model and evaluate clean vs edge performance
- `POST /api/scenarios/simulate` — Simulate What-If operational scenarios

---

## License & Credits

Developed for **PSA 07 Hackathon Challenge**. Built with FastAPI, React, Vite, Tailwind CSS, NumPy, Pandas, Scikit-Learn, and Google Gemini AI.
