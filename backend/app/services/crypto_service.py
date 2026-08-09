import json
import hashlib
from typing import List, Dict, Any

class CryptoService:
    """
    Cryptographic Payroll Integrity & Proof Generator
    Generates deterministic SHA-256 cryptographic proofs from canonicalized payroll batch records.
    Ensures immutable auditability for regulatory compliance.
    """

    @staticmethod
    def generate_batch_proof(records: List[Dict[str, Any]]) -> str:
        if not records:
            return "sha256:0000000000000000000000000000000000000000000000000000000000000000"

        # Canonicalize records by sorting keys and standardizing string representation
        canonical_records = []
        for r in records:
            cleaned_row = {
                "id": str(r.get("id", "")).strip(),
                "first_name": str(r.get("first_name", "")).strip(),
                "last_name": str(r.get("last_name", "")).strip(),
                "gross_salary": round(float(r.get("gross_salary", 0.0)), 2),
                "bank_account_no": str(r.get("bank_account_no", "")).strip(),
                "overtime_hours": round(float(r.get("overtime_hours", 0.0)), 2),
                "attendance_days": int(r.get("attendance_days", 22))
            }
            canonical_records.append(cleaned_row)

        # Sort array by employee id for deterministic ordering
        canonical_records.sort(key=lambda x: x["id"])
        
        # Serialize to canonical JSON format
        json_str = json.dumps(canonical_records, sort_keys=True, separators=(',', ':'))
        
        # Compute SHA-256 hash
        digest = hashlib.sha256(json_str.encode('utf-8')).hexdigest()
        return f"sha256:{digest}"
