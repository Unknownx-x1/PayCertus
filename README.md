# 🛡️ PayCertus — Enterprise AI Payroll Integrity & Fraud Detection Platform

> **Continuous Pre-Disbursement Fraud Prevention, Enterprise Trust Graph Analytics, Cryptographic Audit Proofs & Explainable AI Security Layer**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![NetworkX](https://img.shields.io/badge/NetworkX-3.2+-blue?style=for-the-badge)](https://networkx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

**PayCertus** (formerly Payroll Sentinel) is an industry-grade payroll fraud detection and payroll integrity platform operating as a continuous security firewall between Human Resource Management Systems (HRMS / ERP software such as Workday, SAP SuccessFactors, BambooHR) and payroll disbursement gateways.

Unlike traditional payroll tools that rely on retrospective, post-disbursement audits, **PayCertus continuously evaluates payroll batches before funds leave the enterprise**.

The platform calculates a composite **Payroll Integrity Score (PIS)**, generates canonical **SHA-256 Cryptographic Batch Proofs**, isolates hidden collusion rings via an **Enterprise Trust Graph**, generates **explainable AI audit evidence**, and enforces automated or manual **Payroll Firewall** holds/blocks on high-risk disbursement cycles.

```
[ HRMS / ERP Data Upload ] ──► [ Pre-Ingestion Data Validation ]
                                          │
                                          ▼
                               [ SHA-256 Cryptographic Proof ]
                                          │
                                          ▼
                       ┌─────────────────────────────────────┐
                       │   5-Layer Intelligence Pipeline     │
                       ├─────────────────────────────────────┤
                       │ 1. Deterministic Rule Engine        │
                       │ 2. Statistical ML (ANOMALY ≠ FRAUD) │
                       │ 3. Enterprise Trust Graph Topology  │
                       │ 4. Risk Engine (Deterministic Score)│
                       │ 5. Explainable AI Narrative         │
                       └──────────────────┬──────────────────┘
                                          │
                                          ▼
                       ┌─────────────────────────────────────┐
                       │  Payroll Integrity Score (PIS) &    │
                       │   Financial Exposure Breakdown      │
                       └──────────────────┬──────────────────┘
                                          │
                                          ▼
              ┌───────────────────────────┴───────────────────────────┐
              ▼                                                       ▼
  [ Approved / Safe Cycles ]                             [ High-Risk / Blocked Cycles ]
              │                                                       │
              ▼                                                       ▼
   { Auto Salary Release }                             { Payroll Firewall Gatekeeper }
                                                                      │
                                                                      ▼
                                                            { 5-Layer Forensic Dossier }
                                                            {  Audit PDF Exporter      }
```

---

## ✨ Key Enterprise Capabilities

1. **Pre-Disbursement Fraud Prevention**: Detects ghost employees, salary spikes, duplicate reimbursement claims, zero-attendance full payouts, and shared account collusion *before* payment execution.
2. **Canonical Cryptographic Proofs**: Generates deterministic SHA-256 proof hashes (`sha256:...`) from canonicalized batch data payloads for immutable regulatory compliance.
3. **Strict Data-Driven Trust Graph**: Builds 2D topology networks strictly from ingested dataset fields. Never fabricates entities (`Manager`, `Device`, `IPAddress`) unless explicitly present in source CSV data.
4. **ANOMALY ≠ FRAUD Distinction**: Employs unsupervised machine learning (`Isolation Forest`, `Z-Score`) to flag mathematical distribution outliers against peer baselines without falsely asserting fraud intent without supporting policy rules or graph evidence.
5. **Deterministic Multi-Layer Risk Engine**: Aggregates weighted risk contributions (`Rule + ML + Graph = Final Employee Risk`) using centralized governance thresholds (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).
6. **Financial Exposure Breakdown**: Computes exact monetary risk distribution (`Approved Amount`, `Held Amount`, `Blocked Amount`) and supports `PARTIAL_HOLD` batch firewall decisions.
7. **Compliance Audit Exporter**: Generates printable HTML/PDF compliance reports equipped with cryptographic proof hashes, multi-layer evidence lists, and employee forensic dossiers.

---

## 🔍 5-Layer Analytical Pipeline Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│               PRE-INGESTION DATA VALIDATION & CLEANSING                │
│       (Validates required fields, duplicate IDs, numeric bounds)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SHA-256 CRYPTOGRAPHIC PROOF HASH                     │
│         (Generates canonical hash for immutable audit trail)           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ 1. RULE ENGINE        │ │ 2. STATISTICAL ML     │ │ 3. TRUST GRAPH ENGINE │
│ - Shared Bank Accounts│ │ - Isolation Forest    │ │ - Graph Centrality    │
│ - Ghost Employee IDs  │ │ - Baseline Comparison │ │ - Degree Analytics    │
│ - Overtime Spikes     │ │ - Feature Deviations  │ │ - Shared Destination  │
│ - Zero Att Full Pay   │ │ (ANOMALY ≠ FRAUD)     │ │   Collusion Cluster   │
└───────────┬───────────┘ └───────────┬───────────┘ └───────────┬───────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ 4. RISK SCORING ENGINE    │
                        │ Aggregates Score Points   │
                        │ Outputs Employee Risk &   │
                        │ Batch PIS Score (0 - 100) │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ 5. LLM EXPLAINER SERVICE  │
                        │ Generates Natural Language│
                        │ Executive Audit Evidence  │
                        └───────────────────────────┘
```

### Layer 1: Deterministic Policy Rule Engine (`rule_engine.py`)
Executes explicit compliance policy checks:
- **R1_SHARED_BANK_ACCOUNT**: Flags multiple distinct employee records routing paychecks to identical bank accounts.
- **R2_UNAUTHORIZED_GHOST_EMPLOYEE**: Detects newly created employees (< 7 days before payroll) lacking manager authorization or attendance logs.
- **R3_EXCESSIVE_OVERTIME_SPIKE**: Identifies overtime claims exceeding policy thresholds (>40h/cycle).
- **R4_ZERO_ATTENDANCE_FULL_PAY**: Identifies 0 logged working days accompanied by full base pay release.
- **R5_UNAUTHORIZED_LARGE_REIMBURSEMENT**: Flags unverified expense claims exceeding threshold limits ($2,500).

### Layer 2: Statistical Machine Learning Engine (`ml_anomaly_engine.py`)
- **Isolation Forest & Z-Score Distribution**: Unsupervised multivariate anomaly detection on numerical feature vectors (gross pay, overtime hours, reimbursements, attendance days).
- **Peer Baseline Comparison**: Compares employee metrics against **Department Peer Baselines** (when department data exists) or **Batch-Level Baselines**.
- **Core Principle: ANOMALY ≠ FRAUD**: Statistical outlier detection flags unusual distribution metrics, but does not independently establish fraudulent intent without supporting policy rules or graph evidence.

### Layer 3: Enterprise Trust Graph Engine (`trust_graph_service.py`)
- **Topology Network**: Nodes (`Employee`, `BankAccount`, and optional `Manager`, `Device`, `IPAddress`, `Department`) linked by relationships (`PAID_TO`, `BELONGS_TO`, `REPORTS_TO`, `USES_DEVICE`).
- **Fraud Ring Cluster Detection**: Connected component analysis and degree centrality algorithms isolate shared infrastructure destinations used by multiple employees.
- **Visual Canvas UX**: Interactive 2D layout with relationship dimming (`opacity: 0.2` for unrelated nodes), cluster focus mode, and data-driven node inspector.

### Layer 4: Deterministic Risk Engine (`risk_scoring_service.py`)
Calculates employee risk scores ($Risk \in [0, 100]$) and composite Batch Integrity Scores ($PIS \in [0, 100]$):
- **Employee Risk Governance**:
  - `0 – 34` 🟢 **LOW**: `APPROVED`
  - `35 – 59` 🟡 **MEDIUM**: `FLAG_REVIEW`
  - `60 – 74` 🟠 **HIGH**: `HOLD`
  - `75 – 100` 🔴 **CRITICAL**: `BLOCKED`
- **Batch Firewall Status**: `APPROVED`, `FLAGGED`, `PARTIAL_HOLD`, `BLOCKED`.

### Layer 5: Explainable AI Narrative Engine (`llm_explainer.py`)
Generates natural language executive summaries grounded strictly in empirical findings returned by the analytical pipeline.

---

## 📊 100-Employee Benchmark Verification (`payroll_sentinel_large_test_batch_100.csv`)

The platform includes a 100-employee benchmark dataset for system auditing:

| Metric | Benchmark Target | System Output | Status |
| :--- | :--- | :--- | :--- |
| **Total Payroll Value** | `$8,681,000.00` | `$8,681,000.00` | ✅ Verified |
| **Total Employees** | `100` | `100` | ✅ Verified |
| **Unique Bank Accounts** | `89` | `89` | ✅ Verified |
| **Graph Nodes** | `189` (100 Emps + 89 Banks) | `189` | ✅ Verified |
| **Graph Edges** | `100` (`PAID_TO` edges) | `100` | ✅ Verified |
| **Fabricated Nodes** | `0` (No Manager/Device/IP) | `0` | ✅ Verified |
| **Primary Fraud Ring** | `AC9001` (5 Employees) | `AC9001 (5 EMPS)` | ✅ Verified |
| **Secondary Ring** | `AC9100` (3 Employees) | `AC9100 (3 EMPS)` | ✅ Verified |
| **Proof Hash** | Deterministic SHA-256 | `sha256:...` | ✅ Verified |

---

## 📁 Repository Directory Structure

```
payroll_fintech/
├── README.md                           # Enterprise documentation & system guide
├── payroll_sentinel_large_test_batch_100.csv # 100-employee benchmark dataset
├── .gitignore
│
├── backend/                            # Python FastAPI Microservices
│   ├── app/
│   │   ├── main.py                     # Application entrypoint & CORS middleware
│   │   ├── config.py                   # Pydantic environment configurations
│   │   ├── database.py                 # SQLAlchemy session engine
│   │   ├── mock_data.py                # Pre-seeded clean & fraud ring datasets
│   │   ├── models/                     # Database ORM Tables
│   │   │   └── payroll_models.py       # Employee, Batch, Transaction, RiskFinding, AuditLog
│   │   ├── schemas/                    # Pydantic Request/Response DTOs
│   │   │   └── payroll_schemas.py
│   │   ├── api/                        # REST API Router Endpoints
│   │   │   ├── router.py
│   │   │   ├── ingestion_routes.py     # CSV upload & demo loaders
│   │   │   ├── payroll_routes.py       # Batch details, graph API & firewall
│   │   │   └── audit_routes.py         # Audit logs & PDF/HTML exporter
│   │   └── services/                   # 5-Layer Intelligence Pipeline Logic
│   │       ├── validation_service.py   # CSV Pre-Ingestion Data Integrity Engine
│   │       ├── crypto_service.py       # SHA-256 Cryptographic Proof Generator
│   │       ├── ingestion_service.py    # Pipeline orchestrator & data cleanser
│   │       ├── rule_engine.py          # Deterministic policy rules
│   │       ├── ml_anomaly_engine.py    # Isolation Forest & Z-Score ML models
│   │       ├── trust_graph_service.py  # NetworkX topology & ring detector
│   │       ├── risk_scoring_service.py # Risk score breakdown & PIS calculator
│   │       └── llm_explainer.py        # Explainable AI narrative generator
│   └── tests/
│       ├── test_pipeline.py            # Pytest test suite for clean vs fraud runs
│       └── test_100_employee_batch.py  # Automated 100-employee benchmark test
│
└── frontend/                           # Next.js 14 App Router Frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx              # Root Layout & Provider Wrapper
    │   │   ├── page.tsx                # Executive Dashboard (PIS Gauge, KPIs, Trends)
    │   │   ├── upload/page.tsx         # Data Ingestion Wizard & CSV Drag/Drop
    │   │   ├── overview/page.tsx       # Employee Risk Table & Transaction Filter
    │   │   ├── trust-graph/page.tsx    # Interactive 2D Graph Visualizer & Inspector
    │   │   ├── investigation/page.tsx  # AI Fraud Investigation Hub
    │   │   └── reports/page.tsx        # Payroll Firewall Controls & Audit Exporter
    │   ├── components/                 # Component Library
    │   │   └── layout/
    │   │       ├── Header.tsx
    │   │       └── Sidebar.tsx
    │   └── lib/                        # API Client & Exporters
    │       ├── api.ts                  # Axios/Fetch client with offline fallback
    │       ├── exportReport.ts         # Standalone HTML/PDF Compliance Exporter
    │       └── types.ts                # TypeScript interfaces
    ├── package.json
    ├── postcss.config.js
    └── tailwind.config.ts
```

---

## 🛠️ Technology Stack & Dependencies

| Layer | Component | Technology |
| :--- | :--- | :--- |
| **Frontend** | Framework | Next.js 14+, React 18, TypeScript |
| | UI & Styling | Tailwind CSS, Solid Enterprise Dark Theme, Lucide Icons |
| | Visualizations | 2D SVG Topology Canvas, Interactive Node Inspector |
| **Backend** | API Server | Python FastAPI (Async ASGI framework) |
| | ORM & Database | SQLAlchemy, SQLite (Development) / PostgreSQL (Production) |
| | Cryptography | Python `hashlib` (SHA-256 Batch Hashing) |
| **Analytics & ML** | ML Anomaly Models | Scikit-learn (`IsolationForest`), NumPy, Pandas |
| | Graph Engine | NetworkX (In-Memory Topology & Degree Centrality) |
| **Testing** | Automated Suite | Pytest 9.0+ |

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### 2. Backend Setup & Server Execution
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI application server
python -m uvicorn app.main:app --reload --port 8000
```
- API Base Endpoint: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 3. Frontend Setup & Web App Launch
Open a new terminal window:
```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start Next.js development server
npm run dev -- -p 3000
```
- Web Application URL: `http://localhost:3000`

---

## 🧪 Running Automated Test Suite

Run the full backend test suite directly from the root repository directory:

```powershell
$env:PYTHONPATH="backend"; python -m pytest backend/tests
```

**Expected Output:**
```text
collected 3 items
backend\tests\test_100_employee_batch.py .                               [ 33%]
backend\tests\test_pipeline.py ..                                        [100%]
======================= 3 passed in 2.02s =======================
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
