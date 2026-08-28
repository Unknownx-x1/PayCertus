import uuid
import numpy as np
from typing import List, Dict, Any

class RuleEngineService:
    """
    Layer 1: Multi-Signal Deterministic Policy & Rule Engine
    Evaluates 12 distinct payroll fraud & compliance anomaly vectors across CSV batch records:
    1. Shared Bank Accounts / Reused Payment Destinations
    2. Terminated Employees Still Receiving Salary Payments
    3. Duplicate Payments / Multi-Entry Payroll Records
    4. Unusually High Salaries / Executive Salary Threshold Breaches
    5. Large Salary Increases / Salary Spikes (>20% Increase)
    6. Excessive Unexplained Bonus Payments
    7. Recent Bank Account Changes
    8. Suspicious Round-Number Payments (Off-System Manual Adjustments)
    9. Ghost Employees / Unauthorized Payroll Profiles
    10. Excessive Overtime Hours Spikes (>40h)
    11. Unauthorized High-Value Expense Reimbursements (> $2,500)
    12. Cross-Signal Compound Risk Combinations (e.g. Account Change + Salary Spike + Bonus)
    """

    @staticmethod
    def evaluate(records: List[Dict[str, Any]], batch_id: str) -> List[Dict[str, Any]]:
        findings = []
        if not records:
            return findings

        # 1. SHARED BANK ACCOUNT CHECK
        bank_map: Dict[str, List[Dict[str, Any]]] = {}
        for r in records:
            bank = str(r.get("bank_account_no", "")).strip()
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
                        "title": "Shared Bank Account Destination",
                        "description": f"Multiple employees ({len(emps)}) share bank account destination {bank}: {emp_names}.",
                        "evidence_json": {
                            "shared_bank_account": bank,
                            "count": len(emps),
                            "linked_employees": [e.get("id") for e in emps]
                        }
                    })

        # 2. DUPLICATE PAYMENT / MULTI-ENTRY CHECK
        emp_id_counts: Dict[str, List[Dict[str, Any]]] = {}
        for r in records:
            eid = str(r.get("id", "")).strip()
            if eid:
                emp_id_counts.setdefault(eid, []).append(r)

        for eid, dups in emp_id_counts.items():
            if len(dups) > 1:
                name = f"{dups[0].get('first_name')} {dups[0].get('last_name')}"
                total_dup_pay = sum(float(d.get("gross_salary", 0.0)) for d in dups)
                for d in dups:
                    findings.append({
                        "id": f"rf-{uuid.uuid4().hex[:8]}",
                        "batch_id": batch_id,
                        "employee_id": eid,
                        "employee_name": name,
                        "layer": "RULE",
                        "rule_code": "R3_DUPLICATE_PAYMENT_RECORD",
                        "severity": "CRITICAL",
                        "title": "Duplicate Employee Payment Entry",
                        "description": f"Employee {name} ({eid}) appears {len(dups)} times in single payroll batch totaling ${total_dup_pay:,.2f}.",
                        "evidence_json": {
                            "duplicate_count": len(dups),
                            "total_duplicate_payout": total_dup_pay
                        }
                    })

        # Calculate batch median for salary anomaly baselines
        salaries = [float(r.get("base_salary", r.get("gross_salary", 0))) for r in records if float(r.get("base_salary", r.get("gross_salary", 0))) > 0]
        batch_median_salary = float(np.median(salaries)) if salaries else 50000.0

        # Per-Record Rule & Cross-Signal Evaluation
        for r in records:
            emp_id = str(r.get("id", ""))
            name = f"{r.get('first_name', '')} {r.get('last_name', '')}".strip() or emp_id
            gross = float(r.get("gross_salary", 0.0))
            base = float(r.get("base_salary", gross))
            bonus = float(r.get("bonus", 0.0))
            prev_sal = float(r.get("previous_salary", base))
            sal_inc_pct = float(r.get("salary_increase_pct", 0.0))
            if sal_inc_pct == 0 and prev_sal > 0 and base > prev_sal:
                sal_inc_pct = ((base - prev_sal) / prev_sal) * 100.0

            bank_changed = bool(r.get("bank_account_changed", False))
            is_terminated = bool(r.get("is_terminated", False)) or str(r.get("employment_status", "")).strip().lower() in ["terminated", "inactive", "fired", "exit"]
            is_ghost = bool(r.get("is_ghost", False)) or str(r.get("employment_status", "")).strip().lower() == "ghost" or "ghost" in emp_id.lower() or "ghost" in name.lower()
            attendance = int(r.get("attendance_days", 22))
            ot_hrs = float(r.get("overtime_hours", 0.0))
            claims = float(r.get("reimbursements", 0.0))
            has_manager = bool(r.get("manager_id"))
            is_recent = bool(r.get("is_recently_hired", False))
            bank = str(r.get("bank_account_no", "")).strip()
            is_shared_bank = len(bank_map.get(bank, [])) > 1

            # 3. TERMINATED EMPLOYEE PAYMENT CHECK
            if is_terminated and gross > 0:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R2_TERMINATED_EMPLOYEE_PAYMENT",
                    "severity": "CRITICAL",
                    "title": "Payment to Terminated Employee",
                    "description": f"Employee {name} marked as TERMINATED still received gross salary payment of ${gross:,.2f}.",
                    "evidence_json": {
                        "employment_status": "TERMINATED",
                        "gross_salary": gross
                    }
                })

            # 4. GHOST EMPLOYEE RECORD CHECK
            if is_ghost or (attendance == 0 and gross > 0) or (is_recent and not has_manager):
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R9_UNAUTHORIZED_GHOST_EMPLOYEE",
                    "severity": "CRITICAL",
                    "title": "Unauthorized Ghost Employee Profile",
                    "description": f"Employee {name} exhibits ghost employee traits (0 recorded attendance / missing manager approval).",
                    "evidence_json": {
                        "attendance_days": attendance,
                        "has_manager": has_manager,
                        "is_ghost_flagged": is_ghost
                    }
                })

            # 5. UNUSUALLY HIGH SALARY CHECK
            if gross > 250000 or (batch_median_salary > 0 and base > 3.0 * batch_median_salary):
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R4_UNUSUALLY_HIGH_SALARY",
                    "severity": "HIGH",
                    "title": "Unusually High Executive Salary Threshold Breach",
                    "description": f"Gross salary for {name} (${gross:,.2f}) significantly exceeds executive benchmark limit (${batch_median_salary * 3:,.2f}).",
                    "evidence_json": {
                        "gross_salary": gross,
                        "batch_median_salary": round(batch_median_salary, 2),
                        "multiple_of_median": round(base / batch_median_salary, 2) if batch_median_salary > 0 else 0.0
                    }
                })

            # 6. LARGE SALARY INCREASE / SPIKE CHECK
            if sal_inc_pct >= 20.0 or (prev_sal > 0 and base >= 1.25 * prev_sal):
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R5_LARGE_SALARY_INCREASE_SPIKE",
                    "severity": "HIGH",
                    "title": "Abnormal Base Salary Increase Spike",
                    "description": f"Employee {name} received a {sal_inc_pct:.1f}% salary increase (from ${prev_sal:,.2f} to ${base:,.2f}), exceeding 20% limit.",
                    "evidence_json": {
                        "previous_salary": prev_sal,
                        "current_base_salary": base,
                        "increase_percentage": round(sal_inc_pct, 1)
                    }
                })

            # 7. EXCESSIVE UNEXPLAINED BONUS CHECK
            if bonus >= 5000.0 or (base > 0 and bonus >= 0.4 * base):
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R6_EXCESSIVE_UNEXPLAINED_BONUS",
                    "severity": "HIGH",
                    "title": "Excessive Unexplained Bonus Payment",
                    "description": f"Employee {name} claimed a bonus payout of ${bonus:,.2f} without policy justification.",
                    "evidence_json": {
                        "bonus_amount": bonus,
                        "base_salary": base,
                        "bonus_ratio_pct": round((bonus / base) * 100, 1) if base > 0 else 0.0
                    }
                })

            # 8. RECENT BANK ACCOUNT CHANGE CHECK
            if bank_changed:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R7_RECENT_BANK_ACCOUNT_CHANGE",
                    "severity": "MEDIUM",
                    "title": "Recent Bank Destination Account Modification",
                    "description": f"Bank account for {name} was updated within 30 days prior to payroll execution.",
                    "evidence_json": {
                        "bank_account_no": bank,
                        "recent_change": True
                    }
                })

            # 9. SUSPICIOUS ROUND-NUMBER PAYMENT CHECK
            if gross >= 10000.0 and gross.is_integer() and (int(gross) % 5000 == 0):
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R8_SUSPICIOUS_ROUND_NUMBER_PAYMENT",
                    "severity": "MEDIUM",
                    "title": "Suspicious Round-Number Payment",
                    "description": f"Employee {name} received high round-number payout of ${gross:,.2f}, indicating off-system manual override.",
                    "evidence_json": {
                        "gross_salary": gross,
                        "round_increment": 5000
                    }
                })

            # 10. EXCESSIVE OVERTIME HOURS CHECK
            if ot_hrs > 40:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R10_EXCESSIVE_OVERTIME_SPIKE",
                    "severity": "HIGH",
                    "title": "Excessive Overtime Claimed",
                    "description": f"Employee {name} claimed {ot_hrs} hours of overtime, breaching company policy threshold of 40h.",
                    "evidence_json": {
                        "overtime_hours": ot_hrs,
                        "threshold": 40
                    }
                })

            # 11. LARGE REIMBURSEMENT CLAIM CHECK
            if claims > 2500:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "RULE",
                    "rule_code": "R11_UNAUTHORIZED_LARGE_REIMBURSEMENT",
                    "severity": "MEDIUM",
                    "title": "High-Value Expense Reimbursement Claim",
                    "description": f"Employee {name} submitted expense reimbursement of ${claims:,.2f}.",
                    "evidence_json": {
                        "reimbursements": claims,
                        "threshold": 2500.0
                    }
                })

            # =========================================================================
            # LAYER 4: CROSS-SIGNAL COMPOUND ANOMALY DETECTORS
            # =========================================================================
            # C1: Account Change + Salary Spike + Bonus (Triple-Threat Fraud)
            if bank_changed and (sal_inc_pct >= 20.0 or gross > 1.25 * prev_sal) and bonus >= 2500.0:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "CROSS_SIGNAL",
                    "rule_code": "CROSS_ACCOUNT_CHANGE_SPIKE_BONUS",
                    "severity": "CRITICAL",
                    "title": "Compound Anomaly: Account Change + Salary Spike + Bonus",
                    "description": f"CRITICAL COMPOUND FRAUD RISK: Employee {name} changed bank account, received {sal_inc_pct:.1f}% salary spike, and claimed ${bonus:,.2f} bonus in single run.",
                    "evidence_json": {
                        "signals_combined": ["Bank Account Changed", "Salary Increase Spike", "Excessive Bonus"],
                        "bank_account": bank,
                        "salary_increase_pct": round(sal_inc_pct, 1),
                        "bonus_amount": bonus
                    }
                })

            # C2: Ghost Employee + High Payment
            if is_ghost and (gross >= 7500.0 or bonus >= 2500.0):
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "CROSS_SIGNAL",
                    "rule_code": "CROSS_GHOST_EMPLOYEE_HIGH_PAYMENT",
                    "severity": "CRITICAL",
                    "title": "Compound Anomaly: Ghost Employee + Excessive Payment",
                    "description": f"CRITICAL GHOST PAYOUT: Unverified employee {name} scheduled for high payment of ${gross:,.2f}.",
                    "evidence_json": {
                        "signals_combined": ["Ghost Employee Profile", "High Salary Payment"],
                        "gross_salary": gross,
                        "attendance_days": attendance
                    }
                })

            # C3: Terminated Employee + Shared Account
            if is_terminated and is_shared_bank:
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": emp_id,
                    "employee_name": name,
                    "layer": "CROSS_SIGNAL",
                    "rule_code": "CROSS_TERMINATED_SHARED_ACCOUNT",
                    "severity": "CRITICAL",
                    "title": "Compound Anomaly: Terminated Employee + Shared Account",
                    "description": f"CRITICAL SYPHON RISK: Terminated employee {name} sharing bank account {bank} with active employees.",
                    "evidence_json": {
                        "signals_combined": ["Terminated Status", "Shared Bank Account Cluster"],
                        "bank_account": bank,
                        "gross_salary": gross
                    }
                })

        return findings
