import csv
import mongomock
from app.services.ingestion_service import IngestionService

def test_200_multi_signal_batch_detection():
    # Load 200-record multi-signal benchmark CSV
    file_path = "frontend/public/payroll_sentinel_200_multi_signal_batch.csv"
    records = []
    with open(file_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            records.append(r)

    assert len(records) >= 200, "Dataset must contain at least 200 records"

    # Mock MongoDB database instance
    db = mongomock.MongoClient()["payroll_test_db"]

    # Process payroll data through multi-signal ingestion engine
    batch, graph_payload, narrative, warnings = IngestionService.process_payroll_data(
        raw_records=records,
        batch_name="Benchmark 200 Multi-Signal Payroll Run",
        db=db
    )

    # Fetch stored risk findings from MongoDB mock
    findings = list(db["risk_findings"].find({"batch_id": batch.id}))
    rule_codes = set(f.get("rule_code") for f in findings)

    print("\n--- DETECTED ANOMALY RULE CODES ---")
    for rc in sorted(rule_codes):
        print(f"  [x] {rc}")

    # Verify detection of key anomaly types across all 4 analytical layers
    assert "R1_SHARED_BANK_ACCOUNT" in rule_codes, "Failed to detect shared bank accounts"
    assert "R2_TERMINATED_EMPLOYEE_PAYMENT" in rule_codes, "Failed to detect terminated employee payment"
    assert "R3_DUPLICATE_PAYMENT_RECORD" in rule_codes, "Failed to detect duplicate payment record"
    assert "R4_UNUSUALLY_HIGH_SALARY" in rule_codes, "Failed to detect unusually high salary"
    assert "R5_LARGE_SALARY_INCREASE_SPIKE" in rule_codes, "Failed to detect large salary increase spike"
    assert "R6_EXCESSIVE_UNEXPLAINED_BONUS" in rule_codes, "Failed to detect excessive unexplained bonus"
    assert "R7_RECENT_BANK_ACCOUNT_CHANGE" in rule_codes, "Failed to detect recent bank account change"
    assert "R8_SUSPICIOUS_ROUND_NUMBER_PAYMENT" in rule_codes, "Failed to detect suspicious round number payment"
    assert "R9_UNAUTHORIZED_GHOST_EMPLOYEE" in rule_codes, "Failed to detect ghost employee record"
    assert "CROSS_ACCOUNT_CHANGE_SPIKE_BONUS" in rule_codes, "Failed to detect compound cross-signal triple threat"
    assert "GRAPH_FRAUD_RING_CLUSTER" in rule_codes, "Failed to detect graph fraud ring cluster"

    # Verify batch status and PIS integrity score
    assert batch.integrity_score < 80, "Batch PIS score should reflect high multi-signal risk"
    assert batch.blocked_amount > 0, "Blocked amount should be > 0"

    print(f"\n200-Record Test Passed! Detected {len(findings)} total risk findings across {len(rule_codes)} rule codes.")
