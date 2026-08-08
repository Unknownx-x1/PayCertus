import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.payroll_models import PayrollBatch, SalaryTransaction, RiskFinding, AuditLog
from app.schemas.payroll_schemas import PayrollBatchSchema, SalaryTransactionSchema, FirewallActionSchema
from app.services.trust_graph_service import TrustGraphService
from app.services.llm_explainer import LLMExplainerService

router = APIRouter(prefix="/payroll", tags=["Payroll & Investigation"])

@router.get("/batches", response_model=List[PayrollBatchSchema])
def get_payroll_batches(db: Session = Depends(get_db)):
    """Fetch all processed payroll batches."""
    batches = db.query(PayrollBatch).order_by(PayrollBatch.processed_at.desc()).all()
    return batches

@router.get("/batches/{batch_id}", response_model=PayrollBatchSchema)
def get_payroll_batch_by_id(batch_id: str, db: Session = Depends(get_db)):
    """Fetch specific payroll batch details with transactions & risk findings."""
    batch = db.query(PayrollBatch).filter(PayrollBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Payroll batch not found")
    return batch

@router.get("/batches/{batch_id}/graph")
def get_batch_trust_graph(batch_id: str, db: Session = Depends(get_db)):
    """Get Enterprise Trust Graph JSON structure constructed strictly from ingested batch fields."""
    batch = db.query(PayrollBatch).filter(PayrollBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Payroll batch not found")
        
    txs = db.query(SalaryTransaction).filter(SalaryTransaction.batch_id == batch_id).all()
    records = []
    for tx in txs:
        records.append({
            "id": tx.employee_id,
            "first_name": tx.employee_name.split()[0] if tx.employee_name else "Emp",
            "last_name": " ".join(tx.employee_name.split()[1:]) if len(tx.employee_name.split()) > 1 else "",
            "department": tx.department if tx.department != "Data unavailable" else None,
            "job_title": tx.employee.job_title if tx.employee else None,
            "gross_salary": tx.gross_salary,
            "overtime_hours": tx.overtime_hours,
            "attendance_days": tx.attendance_days,
            "bank_account_no": tx.employee.bank_account_no if (tx.employee and tx.employee.bank_account_no) else f"AC{tx.employee_id}",
            "bank_name": tx.employee.bank_name if tx.employee else None,
            "manager_id": tx.employee.manager_id if tx.employee else None,
            "device_id": tx.employee.device_id if tx.employee else None,
            "ip_address": tx.employee.ip_address if tx.employee else None,
            "risk_score": tx.risk_score
        })
        
    graph_payload, _ = TrustGraphService.build_graph_and_detect(records, batch_id)
    return graph_payload

@router.post("/firewall/action")
def execute_firewall_action(action_data: FirewallActionSchema, db: Session = Depends(get_db)):
    """Execute Payroll Firewall decision (APPROVE, HOLD, BLOCK)."""
    batch = db.query(PayrollBatch).filter(PayrollBatch.id == action_data.batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Payroll batch not found")
        
    status_map = {
        "APPROVE": "APPROVED",
        "HOLD": "HELD",
        "BLOCK": "BLOCKED"
    }
    
    new_status = status_map.get(action_data.action, "HELD")
    batch.status = new_status
    
    audit = AuditLog(
        id=f"audit-{uuid.uuid4().hex[:8]}",
        batch_id=action_data.batch_id,
        actor_name=action_data.actor_name,
        actor_role=action_data.actor_role,
        action=action_data.action,
        notes=action_data.notes
    )
    db.add(audit)
    db.commit()
    
    return {
        "message": f"Payroll Batch status updated to {new_status}",
        "batch_id": batch.id,
        "new_status": new_status
    }
