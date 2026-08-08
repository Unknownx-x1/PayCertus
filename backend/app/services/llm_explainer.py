from typing import List, Dict, Any

class LLMExplainerService:
    """
    Layer 5: Explainable AI Narrative Engine
    Produces clear, audit-ready natural language explanations for findings.
    """
    
    @staticmethod
    def generate_narrative(batch_name: str, score: int, findings: List[Dict[str, Any]]) -> str:
        if not findings:
            return f"Payroll Batch '{batch_name}' passed all multi-layer integrity checks with an Integrity Score of {score}/100. No policy violations or anomalous behavior detected."
            
        critical_count = sum(1 for f in findings if f.get("severity") == "CRITICAL")
        high_count = sum(1 for f in findings if f.get("severity") == "HIGH")
        
        narrative_parts = [
            f"Payroll Integrity Evaluation for '{batch_name}' assigned a score of {score}/100.",
            f"A total of {len(findings)} risk findings were detected ({critical_count} Critical, {high_count} High)."
        ]
        
        narrative_parts.append("\nKey Investigation Findings:")
        for idx, f in enumerate(findings[:5], 1):
            name_str = f" for {f.get('employee_name')}" if f.get('employee_name') else ""
            narrative_parts.append(f"{idx}. [{f.get('severity')}] {f.get('title')}{name_str}: {f.get('description')}")
            
        if score < 40:
            narrative_parts.append("\nRECOMMENDATION: AUTOMATIC PAYROLL FIREWALL BLOCK. Immediate internal audit required before releasing funds.")
        elif score < 70:
            narrative_parts.append("\nRECOMMENDATION: PAYROLL ON HOLD. Manual review required by Finance Officer.")
        else:
            narrative_parts.append("\nRECOMMENDATION: PROCEED WITH CAUTION. Resolve minor warnings prior to approval.")
            
        return "\n".join(narrative_parts)
