import uuid
from typing import List, Dict, Any

class RuleEngineService:
    """
    Layer 1: Deterministic Policy & Rule Engine
    Validates explicit compliance violations in payroll data.
    """
    
    @staticmethod
    def evaluate(records: List[Dict[str, Any]], batch_id: str) -> List[Dict[str, Any]]:
        findings = []
        
        # 1. Duplicate Bank Account Check
        bank_map: Dict[str, List[Dict[str, Any]]] = {}
        for r in records:
            bank = r.get("bank_account_no", "").strip()
            if bank:
                bank_map.setdefault(bank, []).append(r)
                
        for bank, emps in bank_map.items():
            if len(emps) > 1:
                emp_names = ", ".join([f"{e.get('first_name')} {e.get('last_name')} ({e.get('id')})" for e in emps])
                for e in emps:
                    findings.append({
                        "id": f"rf-{uuid.uuid4().hex[:8]}",
                        "batch_id": batch_id,
                        "employee_id": e.get("id"),
                        "employee_name": f"{e.get('first_name')} {e.get('last_name')}",
                        "layer": "RULE",
                        "rule_code": "R1_SHARED_BANK_ACCOUNT",
                        "severity": "CRITICAL",
                        "title": "Shared Bank Account Detected",
                        "description": f"Multiple employees share bank account {bank}: {emp_names}.",
                        "evidence_json": {
                            "shared_bank_account": bank,
                            "count": len(emps),
                            "linked_employees": [e.get("id") for e in emps]
                        }
                    })

        # 2. Ghost Employee & Zero Attendance Check
        for r in records:
            attendance = r.get("attendance_days", 22)
            gross = r.get("gross_salary", 0.0)
            base = r.get("base_salary", 0.0)
            emp_id = r.get("id")
            name = f"{r.get('first_name')} {r.get('last_name')}"
            
            if attendance == 0 and gross > 0:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R4_ZERO_ATTENDANCE_FULL_PAY",
                    "severity": "HIGH",
                    "title": "Full Pay with Zero Recorded Attendance",
                    "description": f"Employee {name} received full gross salary ${gross:,.2f} with 0 recorded attendance days.",
                    "evidence_json": {
                        "attendance_days": 0,
                        "gross_salary": gross
                    }
                })
                
            # Ghost employee indicator: hired recently, no manager, zero attendance
            is_recent = r.get("is_recently_hired", False)
            has_manager = bool(r.get("manager_id"))
            if is_recent and not has_manager:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R2_UNAUTHORIZED_GHOST_EMPLOYEE",
                    "severity": "CRITICAL",
                    "title": "Potential Ghost Employee Record",
                    "description": f"Employee {name} created 3 days before payroll run without an assigned manager or approval trail.",
                    "evidence_json": {
                        "recently_hired": True,
                        "manager_id": None
                    }
                })

            # 3. Unusually High Overtime Hours / Salary Increase (>15%)
            overtime_hrs = r.get("overtime_hours", 0)
            if overtime_hrs > 40:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R3_EXCESSIVE_OVERTIME_SPIKE",
                    "severity": "HIGH",
                    "title": "Excessive Overtime Claimed",
                    "description": f"Employee {name} claimed {overtime_hrs} hours of overtime, breaching company policy threshold of 40h.",
                    "evidence_json": {
                        "overtime_hours": overtime_hrs,
                        "threshold": 40
                    }
                })
                
            # 4. Duplicate Reimbursement Claim
            reimbursements = r.get("reimbursements", 0)
            if reimbursements > 2500:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R5_UNAUTHORIZED_LARGE_REIMBURSEMENT",
                    "severity": "MEDIUM",
                    "title": "High-Value Reimbursement Breach",
                    "description": f"Employee {name} submitted an unverified expense reimbursement of ${reimbursements:,.2f}.",
                    "evidence_json": {
                        "reimbursements": reimbursements,
                        "threshold": 2500.0
                    }
                })

        return findings
