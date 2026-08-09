from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field

# Collection Names Constants
EMPLOYEES_COLLECTION = "employees"
PAYROLL_BATCHES_COLLECTION = "payroll_batches"
SALARY_TRANSACTIONS_COLLECTION = "salary_transactions"
RISK_FINDINGS_COLLECTION = "risk_findings"
AUDIT_LOGS_COLLECTION = "audit_logs"

class EmployeeDocument(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    department: Optional[str] = None
    job_title: Optional[str] = None
    base_salary: float
    bank_account_no: str
    bank_name: Optional[str] = None
    manager_id: Optional[str] = None
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SalaryTransactionDocument(BaseModel):
    id: str
    batch_id: str
    employee_id: str
    employee_name: str
    department: Optional[str] = "Data unavailable"
    gross_salary: float
    net_salary: float
    overtime_hours: float = 0.0
    overtime_pay: float = 0.0
    reimbursements: float = 0.0
    attendance_days: int = 22
    bank_account_no: Optional[str] = None
    manager_id: Optional[str] = None
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    rule_contrib: int = 0
    ml_contrib: int = 0
    graph_contrib: int = 0
    risk_score: int = 0
    status: str = "APPROVED"

class RiskFindingDocument(BaseModel):
    id: str
    batch_id: str
    employee_id: Optional[str] = None
    employee_name: Optional[str] = None
    layer: str
    rule_code: str
    severity: str
    title: str
    description: str
    evidence_json: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PayrollBatchDocument(BaseModel):
    id: str
    batch_name: str
    period_start: str = "2026-08-01"
    period_end: str = "2026-08-31"
    total_amount: float = 0.0
    approved_amount: float = 0.0
    held_amount: float = 0.0
    blocked_amount: float = 0.0
    total_employees: int = 0
    integrity_score: int = 100
    status: str = "PENDING_REVIEW"
    proof_hash: Optional[str] = None
    processed_at: datetime = Field(default_factory=datetime.utcnow)

class AuditLogDocument(BaseModel):
    id: str
    batch_id: Optional[str] = None
    actor_name: str
    actor_role: str
    action: str
    notes: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
