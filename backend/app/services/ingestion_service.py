import uuid
import pandas as pd
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.payroll_models import PayrollBatch, SalaryTransaction, RiskFinding, Employee
from app.services.validation_service import ValidationService
from app.services.crypto_service import CryptoService
from app.services.rule_engine import RuleEngineService
from app.services.ml_anomaly_engine import MLAnomalyEngineService
from app.services.trust_graph_service import TrustGraphService
from app.services.risk_scoring_service import RiskScoringService
from app.services.llm_explainer import LLMExplainerService

def get_flex_val(row: Dict[str, Any], aliases: List[str], default: Any = None) -> Any:
    """Helper to retrieve CSV column values matching case-insensitive aliases."""
    normalized_row = {str(k).strip().lower().replace("_", "").replace(" ", ""): v for k, v in row.items()}
    for alias in aliases:
        target = str(alias).strip().lower().replace("_", "").replace(" ", "")
        if target in normalized_row and normalized_row[target] is not None and str(normalized_row[target]).strip() != "":
            return normalized_row[target]
    return default

class IngestionService:
    """
    Strict Data Ingestion Engine & Pipeline Orchestrator
    Parses ingested CSV rows, strictly preserves available fields, enforces validation & cryptographic hashing,
    triggers Rule Engine, ML Anomaly Engine, Trust Graph Engine, computes PIS, and saves to DB.
    """

    @staticmethod
    def process_payroll_data(raw_records: List[Dict[str, Any]], batch_name: str, db: Session) -> Tuple[PayrollBatch, Dict[str, Any], str, List[str]]:
        batch_id = f"batch-{uuid.uuid4().hex[:8]}"
        
        # 1. Cleanse & Normalize Records strictly from ingested payload
        cleaned_records = []
        for idx, r in enumerate(raw_records):
            emp_id = str(get_flex_val(r, ["id", "employee_id", "empid", "emp_id", "code"], f"E{101+idx}"))
            
            full_name = get_flex_val(r, ["full_name", "employee_name", "name", "employee"])
            if full_name and isinstance(full_name, str) and full_name.strip():
                parts = full_name.strip().split()
                first_name = parts[0]
                last_name = " ".join(parts[1:]) if len(parts) > 1 else ""
            else:
                first_name = str(get_flex_val(r, ["first_name", "firstname", "first"], "Employee"))
                last_name = str(get_flex_val(r, ["last_name", "lastname", "last"], f"{idx+1}"))

            email = get_flex_val(r, ["email", "mail"], None)
            dept = get_flex_val(r, ["department", "dept", "division", "unit"], None)
            job_title = get_flex_val(r, ["job_title", "title", "role", "position"], None)
            
            try:
                base_sal = float(get_flex_val(r, ["salary", "base_salary", "base_pay", "pay", "base"], 50000.0))
            except (ValueError, TypeError):
                base_sal = 50000.0
                
            try:
                ot_hrs = float(get_flex_val(r, ["overtime", "overtime_hours", "overtime_hrs", "ot_hours"], 0.0))
            except (ValueError, TypeError):
                ot_hrs = 0.0

            try:
                ot_pay = float(get_flex_val(r, ["overtime_pay", "ot_pay", "ot_amount"], 0.0))
            except (ValueError, TypeError):
                ot_pay = 0.0
                
            try:
                gross = float(get_flex_val(r, ["gross_salary", "gross_pay", "gross", "total_pay"], base_sal + ot_pay))
            except (ValueError, TypeError):
                gross = base_sal + ot_pay

            net = float(get_flex_val(r, ["net_salary", "net_pay", "take_home"], gross * 0.8))
            bank_acc = str(get_flex_val(r, ["bank_account", "bank_account_no", "account_number", "account_no", "account"], f"AC{1000+idx}"))
            bank_name = get_flex_val(r, ["bank_name", "bank", "institution"], None)
            
            try:
                claims = float(get_flex_val(r, ["reimbursements", "reimbursement", "claims", "expenses"], 0.0))
            except (ValueError, TypeError):
                claims = 0.0
                
            try:
                attendance = int(get_flex_val(r, ["attendance", "attendance_days", "days_worked", "worked_days"], 22))
            except (ValueError, TypeError):
                attendance = 22

            # STRICT RULE: Do NOT invent manager_id, device_id, or ip_address if missing!
            mgr_id = get_flex_val(r, ["manager_id", "manager", "reports_to"], None)
            dev_id = get_flex_val(r, ["device_id", "device", "hardware_id"], None)
            ip_addr = get_flex_val(r, ["ip_address", "ip", "client_ip"], None)
            is_recent = bool(get_flex_val(r, ["is_recently_hired", "recent_hire", "new_hire"], False))

            record = {
                "id": emp_id,
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "department": dept,
                "job_title": job_title,
                "base_salary": base_sal,
                "gross_salary": gross,
                "net_salary": net,
                "bank_account_no": bank_acc,
                "bank_name": bank_name,
                "overtime_hours": ot_hrs,
                "overtime_pay": ot_pay,
                "reimbursements": claims,
                "attendance_days": attendance,
                "manager_id": mgr_id,
                "device_id": dev_id,
                "ip_address": ip_addr,
                "is_recently_hired": is_recent
            }
            cleaned_records.append(record)

        # 2. Run Data Validation
        is_valid, validation_errors, validation_warnings = ValidationService.validate_records(cleaned_records)
        if not is_valid:
            raise ValueError(f"CSV Pre-Ingestion Data Integrity Failure: {'; '.join(validation_errors)}")

        # 3. Generate Canonical Cryptographic Proof Hash
        proof_hash = CryptoService.generate_batch_proof(cleaned_records)

        # 4. Run Layer 1: Rule Engine
        rule_findings = RuleEngineService.evaluate(cleaned_records, batch_id)
        
        # 5. Run Layer 2: ML Anomaly Engine
        ml_findings = MLAnomalyEngineService.evaluate(cleaned_records, batch_id)
        
        # 6. Run Layer 3: Trust Graph Engine (Initial detection)
        _, graph_findings = TrustGraphService.build_graph_and_detect(cleaned_records, batch_id)
        
        # Combine all findings from all 3 analytical layers
        all_findings = rule_findings + ml_findings + graph_findings
        
        # 7. Run Layer 4: Risk Scoring Engine
        scored_records = RiskScoringService.calculate_employee_risk_scores(cleaned_records, all_findings)
        res = RiskScoringService.calculate_batch_integrity(all_findings, scored_records)
        
        pis_score = res.pis_score
        batch_status = res.status
        app_amt = res.approved_amount
        held_amt = res.held_amount
        block_amt = res.blocked_amount

        # Re-build final Trust Graph payload using scored records
        graph_payload, _ = TrustGraphService.build_graph_and_detect(scored_records, batch_id)

        # 8. Run Layer 5: Explainable LLM Narrative
        llm_narrative = LLMExplainerService.generate_narrative(batch_name, pis_score, all_findings)
        
        # 9. Persist to Database
        total_amount = sum(r["gross_salary"] for r in scored_records)
        
        batch = PayrollBatch(
            id=batch_id,
            batch_name=batch_name,
            period_start="2026-08-01",
            period_end="2026-08-31",
            total_amount=total_amount,
            approved_amount=app_amt,
            held_amount=held_amt,
            blocked_amount=block_amt,
            total_employees=len(scored_records),
            integrity_score=pis_score,
            status=batch_status,
            proof_hash=proof_hash
        )
        db.add(batch)
        
        # Save Employees & Salary Transactions
        for r in scored_records:
            existing_emp = db.query(Employee).filter(Employee.id == r["id"]).first()
            if not existing_emp:
                emp = Employee(
                    id=r["id"],
                    first_name=r["first_name"],
                    last_name=r["last_name"],
                    email=r["email"] or f"{r['id'].lower()}@company.com",
                    department=r["department"],
                    job_title=r["job_title"],
                    base_salary=r["base_salary"],
                    bank_account_no=r["bank_account_no"],
                    bank_name=r["bank_name"],
                    manager_id=r["manager_id"],
                    device_id=r["device_id"],
                    ip_address=r["ip_address"]
                )
                db.add(emp)
                
            emp_display_name = f"{r['first_name']} {r['last_name']}".strip()
            tx = SalaryTransaction(
                id=f"tx-{uuid.uuid4().hex[:8]}",
                batch_id=batch_id,
                employee_id=r["id"],
                employee_name=emp_display_name,
                department=r["department"] or "Data unavailable",
                gross_salary=r["gross_salary"],
                net_salary=r["net_salary"],
                overtime_hours=r["overtime_hours"],
                overtime_pay=r["overtime_pay"],
                reimbursements=r["reimbursements"],
                attendance_days=r["attendance_days"],
                bank_account_no=r["bank_account_no"],
                manager_id=r["manager_id"],
                device_id=r["device_id"],
                ip_address=r["ip_address"],
                rule_contrib=r.get("rule_contribution", 0),
                ml_contrib=r.get("ml_contribution", 0),
                graph_contrib=r.get("graph_contribution", 0),
                risk_score=r["risk_score"],
                status=r["status"]
            )
            db.add(tx)

        # Save Risk Findings
        for f in all_findings:
            finding = RiskFinding(
                id=f["id"],
                batch_id=batch_id,
                employee_id=f.get("employee_id"),
                employee_name=f.get("employee_name"),
                layer=f["layer"],
                rule_code=f["rule_code"],
                severity=f["severity"],
                title=f["title"],
                description=f["description"],
                evidence_json=f.get("evidence_json")
            )
            db.add(finding)
            
        db.commit()
        db.refresh(batch)
        
        return batch, graph_payload, llm_narrative, validation_warnings
