import os
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.services.ingestion_service import IngestionService
from app.services.trust_graph_service import TrustGraphService
from app.models.payroll_models import PayrollBatch, SalaryTransaction

def test_100_employee_benchmark_batch():
    # Setup isolated in-memory DB session
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)
    db = TestingSessionLocal()

    csv_path = os.path.join(os.path.dirname(__file__), "..", "..", "payroll_sentinel_large_test_batch_100.csv")
    assert os.path.exists(csv_path), f"Benchmark CSV not found at {csv_path}"

    df = pd.read_csv(csv_path)
    records = df.to_dict(orient="records")
    assert len(records) == 100, f"Expected 100 CSV records, got {len(records)}"

    # Process payroll data through 5-layer engine
    batch, graph_payload, narrative, warnings = IngestionService.process_payroll_data(
        records, "payroll_sentinel_large_test_batch_100.csv", db
    )

    nodes = graph_payload["nodes"]
    edges = graph_payload["edges"]

    # 1. Verify Cryptographic Proof Hash
    assert batch.proof_hash is not None, "Batch proof_hash should not be None"
    assert batch.proof_hash.startswith("sha256:"), f"Expected proof_hash to start with sha256:, got {batch.proof_hash}"

    # 2. Verify NO Fabricated Entities (Manager, Device, IPAddress)
    manager_nodes = [n for n in nodes if n["type"] == "Manager"]
    device_nodes = [n for n in nodes if n["type"] == "Device"]
    ip_nodes = [n for n in nodes if n["type"] == "IPAddress"]

    assert len(manager_nodes) == 0, f"Expected 0 Manager nodes, found {len(manager_nodes)}: {manager_nodes}"
    assert len(device_nodes) == 0, f"Expected 0 Device nodes, found {len(device_nodes)}: {device_nodes}"
    assert len(ip_nodes) == 0, f"Expected 0 IP nodes, found {len(ip_nodes)}: {ip_nodes}"

    # 3. Verify Exact Dynamic Node Counts
    emp_nodes = [n for n in nodes if n["type"] == "Employee"]
    bank_nodes = [n for n in nodes if n["type"] == "BankAccount"]

    assert len(emp_nodes) == 100, f"Expected 100 Employee nodes, got {len(emp_nodes)}"
    assert len(bank_nodes) == 89, f"Expected 89 BankAccount nodes, got {len(bank_nodes)}"
    assert len(nodes) == 189, f"Expected 189 Total nodes, got {len(nodes)}"

    # 4. Verify Exact Dynamic Edge Counts
    paid_to_edges = [e for e in edges if e["label"] == "PAID_TO"]
    assert len(paid_to_edges) == 100, f"Expected 100 PAID_TO edges, got {len(paid_to_edges)}"
    assert len(edges) == 100, f"Expected 100 Total edges, got {len(edges)}"

    # 5. Verify AC9001 Cluster (5 Employees)
    ac9001_node = next((n for n in bank_nodes if n["label"] == "AC9001"), None)
    assert ac9001_node is not None, "AC9001 node not found in graph"
    ac9001_count = ac9001_node["details"]["used_by_count"]
    ac9001_emps = ac9001_node["details"]["employees"]

    assert ac9001_count == 5, f"Expected AC9001 used_by_count == 5, got {ac9001_count}"
    assert len(ac9001_emps) == 5, f"Expected 5 employees on AC9001, got {len(ac9001_emps)}"
    expected_ac9001_names = ["Arjun Verma", "Ishita Singh", "Dev Malhotra", "Mira Shah", "Rahul Jain"]
    for name in expected_ac9001_names:
        assert name in ac9001_emps, f"Expected {name} in AC9001 cluster, got {ac9001_emps}"

    # 6. Verify AC9100 Cluster (3 Employees)
    ac9100_node = next((n for n in bank_nodes if n["label"] == "AC9100"), None)
    assert ac9100_node is not None, "AC9100 node not found in graph"
    ac9100_count = ac9100_node["details"]["used_by_count"]
    ac9100_emps = ac9100_node["details"]["employees"]

    assert ac9100_count == 3, f"Expected AC9100 used_by_count == 3, got {ac9100_count}"
    assert len(ac9100_emps) == 3, f"Expected 3 employees on AC9100, got {len(ac9100_emps)}"
    expected_ac9100_names = ["Vikram Sethi", "Sana Kapoor", "Manav Rao"]
    for name in expected_ac9100_names:
        assert name in ac9100_emps, f"Expected {name} in AC9100 cluster, got {ac9100_emps}"

    # 7. Verify Risk Scoring & Deterministic Breakdown for Clean vs Fraud Employees
    clean_emp = next((n for n in emp_nodes if "E001" in n["id"]), None)
    assert clean_emp is not None
    assert clean_emp["risk_level"] == "LOW", f"Expected E001 risk level LOW, got {clean_emp['risk_level']}"

    fraud_emp = next((n for n in emp_nodes if "E086" in n["id"]), None)
    assert fraud_emp is not None
    assert fraud_emp["risk_level"] == "CRITICAL", f"Expected E086 risk level CRITICAL, got {fraud_emp['risk_level']}"

    # 8. Verify Financial Amounts Breakdown
    assert batch.blocked_amount > 0, "Blocked financial amount should be > 0"
    assert batch.approved_amount > 0, "Approved financial amount should be > 0"

    print("\n✅ 100-EMPLOYEE BENCHMARK PIPELINE VERIFICATION PASSED PERFECTLY!")
    print(f"Proof Hash: {batch.proof_hash}")
    print(f"Nodes: {len(nodes)} (100 Emps + 89 Banks)")
    print(f"Edges: {len(edges)} (100 PAID_TO)")
    print(f"AC9001 Cluster: {ac9001_count} Employees -> {ac9001_emps}")
    print(f"AC9100 Cluster: {ac9100_count} Employees -> {ac9100_emps}")
    print(f"Financials: Approved ${batch.approved_amount:,.2f} | Held ${batch.held_amount:,.2f} | Blocked ${batch.blocked_amount:,.2f}")

if __name__ == "__main__":
    test_100_employee_benchmark_batch()
