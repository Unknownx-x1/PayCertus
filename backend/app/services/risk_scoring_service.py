from typing import List, Dict, Any, Tuple

class RiskScoringService:
    """
    Layer 4: Risk Scoring Engine & Payroll Integrity Score (PIS) Computation
    Calculates overall composite batch score (0-100) and per-employee risk scores.
    """
    
    @staticmethod
    def calculate_batch_integrity(findings: List[Dict[str, Any]], total_employees: int) -> Tuple[int, str]:
        if not findings or total_employees == 0:
            return 100, "APPROVED"
            
        penalty = 0.0
        
        # Severity Weights
        weights = {
            "CRITICAL": 25.0,
            "HIGH": 12.0,
            "MEDIUM": 5.0,
            "LOW": 2.0
        }
        
        for f in findings:
            sev = f.get("severity", "LOW")
            penalty += weights.get(sev, 2.0)
            
        # Normalize score
        raw_score = max(0, int(100 - penalty))
        
        # Determine Batch Firewall Status based on PIS
        if raw_score >= 90:
            status = "APPROVED"
        elif raw_score >= 70:
            status = "PENDING_REVIEW"
        elif raw_score >= 40:
            status = "HELD"
        else:
            status = "BLOCKED"
            
        return raw_score, status

    @staticmethod
    def calculate_employee_risk_scores(records: List[Dict[str, Any]], findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Map findings by employee ID
        emp_penalty_map: Dict[str, float] = {}
        
        for f in findings:
            emp_id = f.get("employee_id")
            sev = f.get("severity", "LOW")
            pts = {"CRITICAL": 45, "HIGH": 30, "MEDIUM": 15, "LOW": 5}.get(sev, 5)
            
            if emp_id:
                emp_penalty_map[emp_id] = emp_penalty_map.get(emp_id, 0) + pts
            elif f.get("evidence_json", {}).get("connected_employees"):
                # Distribute graph ring penalty
                for e_label in f.get("evidence_json", {}).get("connected_employees", []):
                    for r in records:
                        if f"{r.get('first_name')} {r.get('last_name')}" in e_label:
                            eid = r.get("id")
                            emp_penalty_map[eid] = emp_penalty_map.get(eid, 0) + pts

        # Assign risk scores & individual status
        updated_records = []
        for r in records:
            eid = r.get("id")
            pen = emp_penalty_map.get(eid, 0)
            risk_score = min(100, pen)
            r["risk_score"] = risk_score
            
            if risk_score >= 60:
                r["status"] = "BLOCKED"
            elif risk_score >= 35:
                r["status"] = "FLAG_REVIEW"
            else:
                r["status"] = "APPROVED"
                
            updated_records.append(r)
            
        return updated_records
