import pytest
import pandas as pd
from app.mock_data import MockDataGenerator
from app.services.ingestion_service import IngestionService
from app.services.rule_engine import RuleEngineService
from app.services.ml_anomaly_engine import MLAnomalyEngineService
from app.services.trust_graph_service import TrustGraphService
from app.services.risk_scoring_service import RiskScoringService

def test_clean_payroll_pipeline():
    records = MockDataGenerator.get_clean_payroll()
    batch_id = "test-clean-batch"
    
    rule_findings = RuleEngineService.evaluate(records, batch_id)
    ml_findings = MLAnomalyEngineService.evaluate(records, batch_id)
    graph_payload, graph_findings = TrustGraphService.build_graph_and_detect(records, batch_id)
    
    all_findings = rule_findings + ml_findings + graph_findings
    pis_score, status = RiskScoringService.calculate_batch_integrity(all_findings, len(records))
    
    assert pis_score >= 75
    assert status == "APPROVED"

def test_benchmark_fraud_test_batch_csv():
    """Verify strict data integrity and exact graph topology for payroll_sentinel_fraud_test_batch.csv."""
    df = pd.read_csv("payroll_sentinel_fraud_test_batch.csv")
    raw_records = df.to_dict(orient="records")
    
    # 1. Cleanse & Normalize Records
    cleaned_records = []
    for idx, r in enumerate(raw_records):
        emp_id = str(r.get("employee_id"))
        full_name = str(r.get("employee_name"))
        parts = full_name.split()
        first_name = parts[0]
        last_name = " ".join(parts[1:])
        salary = float(r.get("salary"))
        ot = float(r.get("overtime"))
        att = int(r.get("attendance"))
        bank = str(r.get("bank_account"))
        
        cleaned_records.append({
            "id": emp_id,
            "first_name": first_name,
            "last_name": last_name,
            "department": None,
            "base_salary": salary,
            "gross_salary": salary,
            "overtime_hours": ot,
            "attendance_days": att,
            "bank_account_no": bank,
            "manager_id": None,
            "device_id": None,
            "ip_address": None
        })

    # 2. Run Pipeline & Graph Builder
    rule_findings = RuleEngineService.evaluate(cleaned_records, "batch-bench")
    graph_payload, graph_findings = TrustGraphService.build_graph_and_detect(cleaned_records, "batch-bench")
    all_findings = rule_findings + graph_findings
    
    scored_records = RiskScoringService.calculate_employee_risk_scores(cleaned_records, all_findings)
    pis_score, status = RiskScoringService.calculate_batch_integrity(all_findings, len(cleaned_records))

    # 3. Assertions matching user specification
    assert len(scored_records) == 10
    total_payroll = sum(r["gross_salary"] for r in scored_records)
    assert total_payroll == 769000.0
    
    # Graph Node Assertions
    nodes = graph_payload["nodes"]
    edges = graph_payload["edges"]
    assert len(nodes) == 16, f"Expected 16 nodes, got {len(nodes)}"
    assert len(edges) == 10, f"Expected 10 edges, got {len(edges)}"
    
    emp_nodes = [n for n in nodes if n["type"] == "Employee"]
    bank_nodes = [n for n in nodes if n["type"] == "BankAccount"]
    dept_nodes = [n for n in nodes if n["type"] == "Department"]
    dev_nodes = [n for n in nodes if n["type"] == "Device"]
    ip_nodes = [n for n in nodes if n["type"] == "IPAddress"]
    mgr_nodes = [n for n in nodes if n["type"] == "Manager"]
    
    assert len(emp_nodes) == 10
    assert len(bank_nodes) == 6
    assert len(dept_nodes) == 0, "Device/Department nodes must NOT exist when unpopulated"
    assert len(dev_nodes) == 0, "Device nodes must NOT exist when unpopulated"
    assert len(ip_nodes) == 0, "IP nodes must NOT exist when unpopulated"
    assert len(mgr_nodes) == 0, "Manager nodes must NOT exist when unpopulated"
    
    # Check Fraud Ring Cluster AC9001
    ac9001_node = next(n for n in bank_nodes if n["label"] == "AC9001")
    assert ac9001_node["risk_level"] == "CRITICAL"
    assert ac9001_node["details"]["used_by_count"] == 5
    
    # Check Clean vs Fraud Risk Scores
    clean_ids = ["E001", "E002", "E003", "E004", "E010"]
    fraud_ids = ["E005", "E006", "E007", "E008", "E009"]
    
    for r in scored_records:
        if r["id"] in clean_ids:
            assert r["risk_score"] < 35, f"Employee {r['id']} should be LOW risk, got {r['risk_score']}"
        elif r["id"] in fraud_ids:
            assert r["risk_score"] >= 70, f"Employee {r['id']} should be CRITICAL risk, got {r['risk_score']}"

    assert graph_payload["fraud_rings_count"] == 1
    assert status == "BLOCKED"
