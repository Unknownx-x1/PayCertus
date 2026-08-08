import uuid
import pandas as pd
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models.payroll_models import PayrollBatch, SalaryTransaction, RiskFinding, Employee
from app.services.rule_engine import RuleEngineService
from app.services.ml_anomaly_engine import MLAnomalyEngineService
from app.services.trust_graph_service import TrustGraphService
from app.services.risk_scoring_service import RiskScoringService
from app.services.llm_explainer import LLMExplainerService

class IngestionService:
    """
    Ingestion Engine & Orchestrator
    Cleans incoming data, triggers Rule Engine, ML Anomaly Engine, Trust Graph Engine,
    calculates PIS, and saves output into SQLAlchemy database.
    """

    @staticmethod
    def process_payroll_data(raw_records: List[Dict[str, Any]], batch_name: str, db: Session) -> Tuple[PayrollBatch, Dict[str, Any], str]:
        batch_id = f"batch-{uuid.uuid4().hex[:8]}"
        
        # 1. Cleanse & Normalize Records
        cleaned_records = []
        for idx, r in enumerate(raw_records):
            emp_id = str(r.get("id") or r.get("employee_id") or f"EMP-{101+idx}")
            base_sal = float(r.get("base_salary") or r.get("salary") or 50000.0)
            gross = float(r.get("gross_salary") or base_sal + float(r.get("overtime_pay") or 0.0))
            net = float(r.get("net_salary") or gross * 0.8)
            
            record = {
                "id": emp_id,
                "first_name": str(r.get("first_name") or "Employee"),
                "last_name": str(r.get("last_name") or f"{idx+1}"),
                "email": str(r.get("email") or f"emp{emp_id.lower()}@company.com"),
                "department": str(r.get("department") or "Engineering"),
                "job_title": str(r.get("job_title") or "Staff"),
                "base_salary": base_sal,
                "gross_salary": gross,
                "net_salary": net,
                "bank_account_no": str(r.get("bank_account_no") or f"ACC-{9000+idx}"),
                "bank_name": str(r.get("bank_name") or "Chase"),
                "overtime_hours": float(r.get("overtime_hours") or 0.0),
                "overtime_pay": float(r.get("overtime_pay") or 0.0),
                "reimbursements": float(r.get("reimbursements") or 0.0),
                "attendance_days": int(r.get("attendance_days") or 22),
                "manager_id": str(r.get("manager_id") or "MGR-101") if r.get("manager_id") else None,
                "device_id": str(r.get("device_id") or f"DEV-{idx%3+1}"),
                "ip_address": str(r.get("ip_address") or f"192.168.1.{10+idx%3}"),
                "is_recently_hired": bool(r.get("is_recently_hired") or False)
            }
            cleaned_records.append(record)

        # 2. Run Layer 1: Rule Engine
        rule_findings = RuleEngineService.evaluate(cleaned_records, batch_id)
        
        # 3. Run Layer 2: ML Anomaly Engine
        ml_findings = MLAnomalyEngineService.evaluate(cleaned_records, batch_id)
        
        # 4. Run Layer 3: Trust Graph Engine
        graph_payload, graph_findings = TrustGraphService.build_graph_and_detect(cleaned_records, batch_id)
        
        # Combine all findings
        all_findings = rule_findings + ml_findings + graph_findings
        
        # 5. Run Layer 4: Risk Scoring & PIS Score
        pis_score, batch_status = RiskScoringService.calculate_batch_integrity(all_findings, len(cleaned_records))
        scored_records = RiskScoringService.calculate_employee_risk_scores(cleaned_records, all_findings)
        
        # 6. Run Layer 5: Explainable LLM Narrative
        llm_narrative = LLMExplainerService.generate_narrative(batch_name, pis_score, all_findings)
        
        # 7. Persist to Database
        total_amount = sum(r["gross_salary"] for r in scored_records)
        
        batch = PayrollBatch(
            id=batch_id,
            batch_name=batch_name,
            period_start="2026-08-01",
            period_end="2026-08-31",
            total_amount=total_amount,
            total_employees=len(scored_records),
            integrity_score=pis_score,
            status=batch_status
        )
        db.add(batch)
        
        # Save Employees & Salary Transactions
        for r in scored_records:
            # Employee master record
            existing_emp = db.query(Employee).filter(Employee.id == r["id"]).first()
            if not existing_emp:
                emp = Employee(
                    id=r["id"],
                    first_name=r["first_name"],
                    last_name=r["last_name"],
                    email=r["email"],
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
                
            tx = SalaryTransaction(
                id=f"tx-{uuid.uuid4().hex[:8]}",
                batch_id=batch_id,
                employee_id=r["id"],
                employee_name=f"{r['first_name']} {r['last_name']}",
                department=r["department"],
                gross_salary=r["gross_salary"],
                net_salary=r["net_salary"],
                overtime_hours=r["overtime_hours"],
                overtime_pay=r["overtime_pay"],
                reimbursements=r["reimbursements"],
                attendance_days=r["attendance_days"],
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
        
        return batch, graph_payload, llm_narrative
