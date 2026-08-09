from typing import List, Dict, Any, Union

# Centralized Risk Threshold Constants
RISK_THRESHOLD_LOW = 34       # 0 - 34: APPROVED
RISK_THRESHOLD_MEDIUM = 59    # 35 - 59: FLAG_REVIEW
RISK_THRESHOLD_HIGH = 74      # 60 - 74: HOLD
                              # 75 - 100: BLOCKED

class BatchIntegrityResult:
    """Polymorphic result object supporting 2-element unpacking (pis_score, status) and financial attributes."""
    def __init__(self, pis_score: int, status: str, approved_amount: float = 0.0, held_amount: float = 0.0, blocked_amount: float = 0.0):
        self.pis_score = pis_score
        self.status = status
        self.approved_amount = approved_amount
        self.held_amount = held_amount
        self.blocked_amount = blocked_amount

    def __iter__(self):
        return iter((self.pis_score, self.status))

    def __getitem__(self, item):
        if item == 0:
            return self.pis_score
        if item == 1:
            return self.status
        if item == 2:
            return self.approved_amount
        if item == 3:
            return self.held_amount
        if item == 4:
            return self.blocked_amount
        raise IndexError("BatchIntegrityResult index out of range")

    def __len__(self):
        return 2

class RiskScoringService:
    """
    Layer 4: Risk Scoring Engine & Payroll Integrity Score (PIS) Computation
    Calculates overall composite batch score (0-100 PIS), per-employee risk breakdown,
    and financial risk exposure amounts (Approved, Held, Blocked).
    """

    @staticmethod
    def calculate_employee_risk_scores(records: List[Dict[str, Any]], findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Map contributions by employee ID
        rule_contrib: Dict[str, float] = {}
        ml_contrib: Dict[str, float] = {}
        graph_contrib: Dict[str, float] = {}

        for f in findings:
            emp_id = f.get("employee_id")
            layer = f.get("layer", "RULE")
            sev = f.get("severity", "LOW")
            
            # Layer severity point assignments
            pts = {"CRITICAL": 50, "HIGH": 30, "MEDIUM": 15, "LOW": 5}.get(sev, 5)

            if emp_id:
                if layer == "RULE":
                    rule_contrib[emp_id] = rule_contrib.get(emp_id, 0) + pts
                elif layer == "ANOMALY":
                    ml_contrib[emp_id] = ml_contrib.get(emp_id, 0) + pts
                elif layer == "GRAPH":
                    graph_contrib[emp_id] = graph_contrib.get(emp_id, 0) + pts
            elif f.get("evidence_json", {}).get("connected_employees"):
                # Distribute graph ring penalty to all connected employees in the cluster
                for e_name in f.get("evidence_json", {}).get("connected_employees", []):
                    for r in records:
                        full_name = f"{r.get('first_name', '')} {r.get('last_name', '')}".strip()
                        if full_name and full_name in e_name:
                            eid = r.get("id")
                            graph_contrib[eid] = graph_contrib.get(eid, 0) + pts

        updated_records = []
        for r in records:
            eid = r.get("id")
            r_pts = rule_contrib.get(eid, 0)
            m_pts = ml_contrib.get(eid, 0)
            g_pts = graph_contrib.get(eid, 0)

            total_risk = min(100, int(r_pts + m_pts + g_pts))
            
            r["rule_contribution"] = int(r_pts)
            r["ml_contribution"] = int(m_pts)
            r["graph_contribution"] = int(g_pts)
            r["risk_score"] = total_risk

            # Assign individual decision status based on centralized thresholds
            if total_risk > RISK_THRESHOLD_HIGH:
                r["status"] = "BLOCKED"
            elif total_risk > RISK_THRESHOLD_MEDIUM:
                r["status"] = "HOLD"
            elif total_risk > RISK_THRESHOLD_LOW:
                r["status"] = "FLAG_REVIEW"
            else:
                r["status"] = "APPROVED"

            updated_records.append(r)

        return updated_records

    @staticmethod
    def calculate_batch_integrity(findings: List[Dict[str, Any]], records: Union[List[Dict[str, Any]], int]) -> BatchIntegrityResult:
        if isinstance(records, int):
            rec_list = []
            total_employees = records
        else:
            rec_list = records
            total_employees = len(rec_list)

        if total_employees == 0:
            return BatchIntegrityResult(100, "APPROVED", 0.0, 0.0, 0.0)

        approved_amount = sum(float(r.get("gross_salary", 0.0)) for r in rec_list if r.get("status") == "APPROVED")
        held_amount = sum(float(r.get("gross_salary", 0.0)) for r in rec_list if r.get("status") in ["FLAG_REVIEW", "HOLD"])
        blocked_amount = sum(float(r.get("gross_salary", 0.0)) for r in rec_list if r.get("status") == "BLOCKED")

        # Compute Batch PIS (100 = perfect integrity, 0 = critical fraud breach)
        penalty = 0.0
        weights = {"CRITICAL": 25.0, "HIGH": 12.0, "MEDIUM": 5.0, "LOW": 2.0}
        for f in findings:
            sev = f.get("severity", "LOW")
            penalty += weights.get(sev, 2.0)

        pis_score = max(0, int(100 - penalty))

        # Determine Batch Firewall Status
        has_critical_finding = any(f.get("severity") == "CRITICAL" for f in findings)

        if rec_list:
            has_blocked_emp = any(r.get("status") == "BLOCKED" for r in rec_list) or has_critical_finding
            has_held_emp = any(r.get("status") in ["FLAG_REVIEW", "HOLD"] for r in rec_list)

            if has_blocked_emp and approved_amount > 0:
                batch_status = "PARTIAL_HOLD" if pis_score >= 20 else "BLOCKED"
            elif has_blocked_emp:
                batch_status = "BLOCKED"
            elif has_held_emp:
                batch_status = "FLAGGED"
            else:
                batch_status = "APPROVED"
        else:
            has_high_finding = any(f.get("severity") == "HIGH" for f in findings)
            if has_critical_finding:
                batch_status = "BLOCKED"
            elif has_high_finding:
                batch_status = "FLAGGED"
            else:
                batch_status = "APPROVED"

        return BatchIntegrityResult(pis_score, batch_status, approved_amount, held_amount, blocked_amount)
