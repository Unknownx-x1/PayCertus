from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class EmployeeSchema(BaseModel):
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

class RiskFindingSchema(BaseModel):
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
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SalaryTransactionSchema(BaseModel):
    id: str
    batch_id: str
    employee_id: str
    employee_name: str
    department: Optional[str] = "Data unavailable"
    gross_salary: float
    net_salary: float
    overtime_hours: float
    overtime_pay: float
    reimbursements: float
    attendance_days: int
    bank_account_no: Optional[str] = None
    manager_id: Optional[str] = None
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    rule_contrib: Optional[int] = 0
    ml_contrib: Optional[int] = 0
    graph_contrib: Optional[int] = 0
    risk_score: int
    status: str

    class Config:
        from_attributes = True

class PayrollBatchSchema(BaseModel):
    id: str
    batch_name: str
    period_start: str
    period_end: str
    total_amount: float
    approved_amount: Optional[float] = 0.0
    held_amount: Optional[float] = 0.0
    blocked_amount: Optional[float] = 0.0
    total_employees: int
    integrity_score: int
    status: str
    proof_hash: Optional[str] = None
    processed_at: Optional[datetime] = None
    transactions: Optional[List[SalaryTransactionSchema]] = []
    risk_findings: Optional[List[RiskFindingSchema]] = []

    class Config:
        from_attributes = True

class GraphNodeSchema(BaseModel):
    id: str
    label: str
    type: str  # Employee, Manager, BankAccount, Device, Department, IPAddress
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    details: Dict[str, Any]

class GraphEdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    label: str  # REPORTS_TO, PAID_TO, USES_DEVICE, LOGGED_FROM_IP
    risk_level: Optional[str] = "LOW"

class GraphResponseSchema(BaseModel):
    nodes: List[GraphNodeSchema]
    edges: List[GraphEdgeSchema]
    fraud_rings_count: int

class FirewallActionSchema(BaseModel):
    batch_id: str
    action: str  # APPROVE, HOLD, BLOCK
    actor_name: str
    actor_role: str
    notes: Optional[str] = ""

class AuditLogSchema(BaseModel):
    id: str
    batch_id: Optional[str]
    actor_name: str
    actor_role: str
    action: str
    notes: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True
