import pytest
from app.mock_data import MockDataGenerator
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
    
    assert pis_score >= 90
    assert status == "APPROVED"

def test_fraud_ring_payroll_pipeline():
    records = MockDataGenerator.get_fraud_ring_payroll()
    batch_id = "test-fraud-batch"
    
    rule_findings = RuleEngineService.evaluate(records, batch_id)
    ml_findings = MLAnomalyEngineService.evaluate(records, batch_id)
    graph_payload, graph_findings = TrustGraphService.build_graph_and_detect(records, batch_id)
    
    all_findings = rule_findings + ml_findings + graph_findings
    pis_score, status = RiskScoringService.calculate_batch_integrity(all_findings, len(records))
    
    # Verify fraud ring detected
    assert len(all_findings) > 0
    assert pis_score < 70
    assert status in ["HELD", "BLOCKED"]
    assert graph_payload["fraud_rings_count"] >= 1
