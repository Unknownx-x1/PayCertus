# 🛡️ PayCertus — Enterprise AI Payroll Integrity & Risk Intelligence Platform

> **Continuous Pre-Disbursement Fraud Prevention, Enterprise Trust Graph Analytics & Explainable AI Security Layer**

[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![NetworkX](https://img.shields.io/badge/NetworkX-3.2+-blue?style=for-the-badge)](https://networkx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

**Payroll Sentinel** is an AI-powered payroll integrity platform operating as a continuous security layer between Human Resource Management Systems (HRMS / ERP software such as Workday, SAP SuccessFactors, BambooHR) and payroll disbursement gateways.

Unlike traditional payroll software that prioritizes batch processing efficiency and relies on static retrospective audits, **Payroll Sentinel continuously evaluates payroll data before salary payments leave the organization**. 

The platform produces a composite **Payroll Integrity Score (PIS)**, isolates hidden collusion rings via an **Enterprise Trust Graph**, generates **explainable AI audit narratives**, and enforces automated or manual **Payroll Firewall** holds/blocks on high-risk cycles.

```
[ HRMS / ERP Data ] ──► [ Data Ingestion & Cleansing ]
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │ Multi-Layer Risk Engine   │
                    ├───────────────────────────┤
                    │ 1. Deterministic Rules    │
                    │ 2. Statistical / ML (IF) │
                    │ 3. Enterprise Trust Graph │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │  Payroll Integrity Score  │
                    │      & LLM Explainer      │
                    └─────────────┬─────────────┘
                                  │
                                  ▼
             ┌────────────────────┴────────────────────┐
             ▼                                         ▼
   [ PIS >= 90: Trusted ]                     [ PIS < 70: High Risk / Critical ]
             │                                         │
             ▼                                         ▼
  { Auto Salary Release }                 { Payroll Firewall Hold/Block }
                                                       │
                                                       ▼
                                            { Investigation Hub UX }
```

---

## ✨ Key Innovations & Value Proposition

1. **Pre-Payment Fraud Prevention**: Identifies ghost employees, salary spikes, duplicate reimbursements, and collusion *before* disbursement occurs.
2. **Enterprise Trust Graph**: Models multi-entity connections (`Employee`, `BankAccount`, `Device`, `Manager`, `IPAddress`) to expose hidden fraud rings that isolated rule checks miss.
3. **Multi-Layer Detection Pipeline**: Combines deterministic rules, unsupervised machine learning (`IsolationForest`, `Z-Score`), and graph centrality metrics.
4. **Explainable AI (XAI)**: Translates complex multivariate risk scores into natural language audit evidence suitable for auditors and finance officers.
5. **Non-Disruptive API Layer**: Integrates smoothly with existing payroll gateways without requiring enterprises to replace core ERP software.

---

## 🔍 Multi-Layer Detection Pipeline Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION & CLEANSING                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│ 1. RULE ENGINE        │ │ 2. ANOMALY ENGINE     │ │ 3. TRUST GRAPH ENGINE │
│ - Duplicate Bank Accs │ │ - Isolation Forest    │ │ - Graph Centrality    │
│ - Ghost Employee IDs  │ │ - LOF Outlier Detection│ │ - Multi-Entity Ring  │
│ - Unauth Salary Bump  │ │ - Z-Score Analysis    │ │ - Shared IP/Device    │
│ - Missing Attendance  │ │ (Salary, OT, Claims)  │ │   Collusion Cluster   │
└───────────┬───────────┘ └───────────┬───────────┘ └───────────┬───────────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ 4. RISK SCORING ENGINE    │
                        │ Aggregates Weighted Risk  │
                        │ Outputs PIS (0 - 100)     │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ 5. LLM EXPLAINER SERVICE  │
                        │ Generates Audit Evidence  │
                        │ & Executive Narrative     │
                        └───────────────────────────┘
```

### Layer 1: Deterministic Policy Rule Engine (`rule_engine.py`)
Executes explicit compliance policy checks:
- **R1_SHARED_BANK_ACCOUNT**: Flags multiple distinct employee records routing paychecks to identical bank accounts.
- **R2_UNAUTHORIZED_GHOST_EMPLOYEE**: Detects newly created employees (< 7 days before payroll) lacking manager authorization or attendance logs.
- **R3_EXCESSIVE_OVERTIME_SPIKE**: Identifies overtime claims exceeding policy thresholds (>40h/cycle).
- **R4_ZERO_ATTENDANCE_FULL_PAY**: Identifies 0 logged working days accompanied by full base pay release.
- **R5_UNAUTHORIZED_LARGE_REIMBURSEMENT**: Flags unverified high-value expense claims.
- **R6_MISSING_APPROVALS**: Detects missing multi-tier management sign-offs.

### Layer 2: Machine Learning Anomaly Engine (`ml_anomaly_engine.py`)
- **Isolation Forest & Local Outlier Factor (LOF)**: Unsupervised multivariate anomaly detection on numerical attributes (gross pay, overtime pay, reimbursements, attendance ratio).
- **Departmental Z-Score Outlier Analysis**: Identifies compensation deviations where $|Z| > 2.5$ relative to department benchmarks.

### Layer 3: Enterprise Trust Graph Engine (`trust_graph_service.py`)
- **Topology Network**: Nodes (`Employee`, `Manager`, `BankAccount`, `Device`, `IPAddress`, `Department`) linked by edges (`REPORTS_TO`, `PAID_TO`, `USES_DEVICE`, `LOGGED_FROM_IP`).
- **Fraud Ring Detection**: Connected component analysis and degree centrality algorithms isolate shared infrastructure nodes used by multiple employees.

### Layer 4: Risk Engine & Payroll Integrity Score (PIS) (`risk_scoring_service.py`)
Calculates a unified composite score $PIS \in [0, 100]$:
- `90 – 100` 🟢 **Trusted**: Auto-approved for salary disbursement.
- `70 – 89` 🟡 **Review Recommended**: Flagged for Finance review.
- `40 – 69` 🟠 **High Risk / Hold**: Placed on hold; requires Auditor sign-off.
- `0 – 39` 🔴 **Critical / Blocked**: Automatically blocked by the Payroll Firewall.

### Layer 5: Explainable AI Narrative Engine (`llm_explainer.py`)
Outputs structured, natural language audit evidence summaries detailing exact root-cause evidence and confidence scores.

---

## 📁 Repository Directory Structure

```
payroll_fintech/
├── README.md                           # Enterprise documentation & system guide
├── docker-compose.yml                  # Container orchestration manifest
│
├── backend/                            # Python FastAPI Microservices
│   ├── app/
│   │   ├── main.py                     # Application entrypoint & CORS middleware
│   │   ├── config.py                   # Pydantic environment configurations
│   │   ├── database.py                 # SQLAlchemy session engine
│   │   ├── mock_data.py                # Pre-seeded clean & fraud ring datasets
│   │   ├── models/                     # Database ORM Tables
│   │   │   ├── __init__.py
│   │   │   └── payroll_models.py       # Employee, Batch, Transaction, RiskFinding, AuditLog
│   │   ├── schemas/                    # Pydantic Request/Response DTOs
│   │   │   ├── __init__.py
│   │   │   └── payroll_schemas.py
│   │   ├── api/                        # REST API Router Endpoints
│   │   │   ├── router.py
│   │   │   ├── ingestion_routes.py     # CSV upload & demo loaders
│   │   │   ├── payroll_routes.py       # Batch details, graph API & firewall
│   │   │   └── audit_routes.py         # Audit logs & PDF/HTML exporter
│   │   └── services/                   # 5-Layer Intelligence Pipeline Logic
│   │       ├── ingestion_service.py    # Pipeline orchestrator & data cleanser
│   │       ├── rule_engine.py          # Deterministic policy rules
│   │       ├── ml_anomaly_engine.py    # Isolation Forest & Z-Score ML models
│   │       ├── trust_graph_service.py  # NetworkX topology & ring detector
│   │       ├── risk_scoring_service.py # PIS score calculator
│   │       └── llm_explainer.py        # Explainable AI narrative generator
│   ├── tests/
│   │   ├── __init__.py
│   │   └── test_pipeline.py            # Pytest test suite for clean vs fraud runs
│   └── requirements.txt
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
    │   │   ├── reports/page.tsx        # Payroll Firewall Controls & Audit PDF Exporter
    │   │    font/
    │   │   └── globals.css             # Glassmorphism dark UI theme
    │   ├── components/                 # Component Library
    │   │   └── layout/
    │   │       ├── Header.tsx
    │   │       └── Sidebar.tsx
    │   └── lib/                        # API Client & Types
    │       ├── api.ts                  # Axios/Fetch client with offline fallback
    │       └── types.ts                # TypeScript interfaces
    ├── package.json
    ├── tailwind.config.ts
    └── next.config.mjs
```

---

## 🛠️ Technology Stack & Dependencies

| Layer | Component | Technology |
| :--- | :--- | :--- |
| **Frontend** | Framework | Next.js 14+, React 18, TypeScript |
| | UI & Styling | Tailwind CSS, Glassmorphism Vanilla CSS, Lucide Icons |
| | Data Visualization | Recharts (Trend & Bar Charts), Interactive HTML5 Canvas Graph |
| **Backend** | API Server | Python FastAPI (Async ASGI framework) |
| | ORM & Database | SQLAlchemy, SQLite (Development) / PostgreSQL (Production) |
| | Data Validation | Pydantic v2, Pydantic-Settings |
| **Analytics & ML** | ML Anomaly Models | Scikit-learn (`IsolationForest`), Pandas, NumPy |
| | Graph Engine | NetworkX (In-Memory Graph Topology & Centrality) |
| | AI Explainer | Modular LLM Provider (OpenAI / Gemini / Template Engine) |
| **Testing** | Unit & Integration | Pytest |

---

## 🚀 Quickstart & Setup Guide

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### 2. Backend Setup & Local Server Execution
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
npm run dev
```
- Web Application URL: `http://localhost:3000`

---

## 🧪 Running Automated Unit Tests

Run the backend 5-layer pipeline test suite directly from the root repository directory:

```powershell
$env:PYTHONPATH="backend"; python -m pytest backend/tests
```

**Expected Output:**
```text
collected 2 items
backend\tests\test_pipeline.py ..                                        [100%]
============================== 2 passed in 1.70s ==============================
```

---

## 🎮 Recommended Interactive Demo Walkthrough

Once both servers are running (`localhost:8000` and `localhost:3000`):

1. **Executive Dashboard** (`http://localhost:3000`): Observe the live Payroll Integrity Score (PIS) gauge and KPI metrics.
2. **Upload & Ingest** (`/upload`): Click **⚡ Load Fraud Ring Alert Preset**.
3. **Payroll Batches & Employee Risk Table** (`/overview`): Inspect employee risk scores (0-100), overtime pay, and flagged policy breaches.
4. **Enterprise Trust Graph Workspace** (`/trust-graph`): Explore the interactive 2D graph canvas displaying connected employees, shared offshore bank accounts, and device rings. Click any node to open the Detail Inspector drawer.
5. **AI Investigation Hub** (`/investigation`): Read the AI-generated audit narrative and evidence payload.
6. **Payroll Firewall & Audit Reports** (`/reports`): Enforce a Firewall **Block** or click **Print / Export Audit Report** to generate a printable compliance PDF.

---

## 🔒 Security & Compliance Controls

- **Role-Based Access Control (RBAC)**: Strict role separation for HR Administrators, Finance Officers, Internal Auditors, and Security Administrators.
- **Immutable Audit Logging**: Every firewall action (`APPROVE`, `HOLD`, `BLOCK`) is cryptographically logged in the database audit history.
- **Data Protection**: Zero raw bank password retention; hashed payment account identifier matching.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
