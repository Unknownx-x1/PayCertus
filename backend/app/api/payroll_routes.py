import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from app.models.payroll_models import (
    PAYROLL_BATCHES_COLLECTION,
    SALARY_TRANSACTIONS_COLLECTION,
    RISK_FINDINGS_COLLECTION,
    AUDIT_LOGS_COLLECTION
)
from app.schemas.payroll_schemas import PayrollBatchSchema, FirewallActionSchema
from app.services.trust_graph_service import TrustGraphService

router = APIRouter(prefix="/payroll", tags=["Payroll & Investigation"])

@router.get("/batches", response_model=List[PayrollBatchSchema])
def get_payroll_batches(db = Depends(get_db)):
    """Fetch all processed payroll batches from MongoDB."""
    cursor = db[PAYROLL_BATCHES_COLLECTION].find({}, {"_id": 0}).sort("processed_at", -1)
    batches = list(cursor)
    
    for batch in batches:
        b_id = batch["id"]
        txs = list(db[SALARY_TRANSACTIONS_COLLECTION].find({"batch_id": b_id}, {"_id": 0}))
        findings = list(db[RISK_FINDINGS_COLLECTION].find({"batch_id": b_id}, {"_id": 0}))
        batch["transactions"] = txs
        batch["risk_findings"] = findings
        
    return batches

@router.get("/batches/{batch_id}", response_model=PayrollBatchSchema)
def get_payroll_batch_by_id(batch_id: str, db = Depends(get_db)):
    """Fetch specific payroll batch details with transactions & risk findings from MongoDB."""
    batch = db[PAYROLL_BATCHES_COLLECTION].find_one({"id": batch_id}, {"_id": 0})
    if not batch:
        raise HTTPException(status_code=404, detail="Payroll batch not found")
        
    txs = list(db[SALARY_TRANSACTIONS_COLLECTION].find({"batch_id": batch_id}, {"_id": 0}))
    findings = list(db[RISK_FINDINGS_COLLECTION].find({"batch_id": batch_id}, {"_id": 0}))
    batch["transactions"] = txs
    batch["risk_findings"] = findings
    
    return batch

@router.get("/batches/{batch_id}/graph")
def get_batch_trust_graph(batch_id: str, db = Depends(get_db)):
    """Get Enterprise Trust Graph JSON structure constructed strictly from ingested batch fields."""
    batch = db[PAYROLL_BATCHES_COLLECTION].find_one({"id": batch_id}, {"_id": 0})
    if not batch:
        raise HTTPException(status_code=404, detail="Payroll batch not found")
        
    txs = list(db[SALARY_TRANSACTIONS_COLLECTION].find({"batch_id": batch_id}, {"_id": 0}))
    records = []
    for tx in txs:
        emp_name = tx.get("employee_name", "")
        parts = emp_name.split() if emp_name else []
        records.append({
            "id": tx.get("employee_id"),
            "first_name": parts[0] if parts else "Emp",
            "last_name": " ".join(parts[1:]) if len(parts) > 1 else "",
            "department": tx.get("department") if tx.get("department") != "Data unavailable" else None,
            "job_title": None,
            "gross_salary": tx.get("gross_salary", 0.0),
            "overtime_hours": tx.get("overtime_hours", 0.0),
            "attendance_days": tx.get("attendance_days", 22),
            "bank_account_no": tx.get("bank_account_no"),
            "bank_name": None,
            "manager_id": tx.get("manager_id"),
            "device_id": tx.get("device_id"),
            "ip_address": tx.get("ip_address"),
            "risk_score": tx.get("risk_score", 0)
        })
        
    graph_payload, _ = TrustGraphService.build_graph_and_detect(records, batch_id)
    return graph_payload

@router.post("/firewall/action")
def execute_firewall_action(action_data: FirewallActionSchema, db = Depends(get_db)):
    """Execute Payroll Firewall decision (APPROVE, HOLD, BLOCK)."""
    batch = db[PAYROLL_BATCHES_COLLECTION].find_one({"id": action_data.batch_id})
    if not batch:
        raise HTTPException(status_code=404, detail="Payroll batch not found")
        
    status_map = {
        "APPROVE": "APPROVED",
        "HOLD": "HELD",
        "BLOCK": "BLOCKED"
    }
    
    new_status = status_map.get(action_data.action, "HELD")
    db[PAYROLL_BATCHES_COLLECTION].update_one(
        {"id": action_data.batch_id},
        {"$set": {"status": new_status}}
    )
    
    audit_doc = {
        "id": f"audit-{uuid.uuid4().hex[:8]}",
        "batch_id": action_data.batch_id,
        "actor_name": action_data.actor_name,
        "actor_role": action_data.actor_role,
        "action": action_data.action,
        "notes": action_data.notes,
        "timestamp": datetime.utcnow()
    }
    db[AUDIT_LOGS_COLLECTION].insert_one(audit_doc)
    
    return {
        "message": f"Payroll Batch status updated to {new_status}",
        "batch_id": action_data.batch_id,
        "new_status": new_status
    }
