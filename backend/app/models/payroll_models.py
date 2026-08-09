from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(String, primary_key=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    department = Column(String, index=True)
    job_title = Column(String)
    base_salary = Column(Float, nullable=False)
    bank_account_no = Column(String, index=True)
    bank_name = Column(String)
    manager_id = Column(String, nullable=True)
    device_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PayrollBatch(Base):
    __tablename__ = "payroll_batches"
    
    id = Column(String, primary_key=True, index=True)
    batch_name = Column(String, nullable=False)
    period_start = Column(String, nullable=False)
    period_end = Column(String, nullable=False)
    total_amount = Column(Float, default=0.0)
    approved_amount = Column(Float, default=0.0)
    held_amount = Column(Float, default=0.0)
    blocked_amount = Column(Float, default=0.0)
    total_employees = Column(Integer, default=0)
    integrity_score = Column(Integer, default=100)
    status = Column(String, default="PENDING_REVIEW") # PENDING_REVIEW, HELD, BLOCKED, APPROVED, PARTIAL_HOLD
    proof_hash = Column(String, nullable=True)
    processed_at = Column(DateTime, default=datetime.utcnow)
    
    transactions = relationship("SalaryTransaction", back_populates="batch", cascade="all, delete-orphan")
    risk_findings = relationship("RiskFinding", back_populates="batch", cascade="all, delete-orphan")

class SalaryTransaction(Base):
    __tablename__ = "salary_transactions"
    
    id = Column(String, primary_key=True, index=True)
    batch_id = Column(String, ForeignKey("payroll_batches.id"))
    employee_id = Column(String, ForeignKey("employees.id"))
    employee_name = Column(String)
    department = Column(String)
    gross_salary = Column(Float, nullable=False)
    net_salary = Column(Float, nullable=False)
    overtime_hours = Column(Float, default=0.0)
    overtime_pay = Column(Float, default=0.0)
    reimbursements = Column(Float, default=0.0)
    attendance_days = Column(Integer, default=22)
    bank_account_no = Column(String, nullable=True)
    manager_id = Column(String, nullable=True)
    device_id = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    rule_contrib = Column(Integer, default=0)
    ml_contrib = Column(Integer, default=0)
    graph_contrib = Column(Integer, default=0)
    risk_score = Column(Integer, default=0) # 0-100 individual risk
    status = Column(String, default="APPROVED") # APPROVED, FLAG_REVIEW, BLOCKED, HOLD
    
    batch = relationship("PayrollBatch", back_populates="transactions")
    employee = relationship("Employee")

class RiskFinding(Base):
    __tablename__ = "risk_findings"
    
    id = Column(String, primary_key=True, index=True)
    batch_id = Column(String, ForeignKey("payroll_batches.id"))
    employee_id = Column(String, nullable=True)
    employee_name = Column(String, nullable=True)
    layer = Column(String, nullable=False) # RULE, ANOMALY, GRAPH
    rule_code = Column(String, nullable=False)
    severity = Column(String, nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    evidence_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    batch = relationship("PayrollBatch", back_populates="risk_findings")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String, primary_key=True, index=True)
    batch_id = Column(String, nullable=True)
    actor_name = Column(String, nullable=False)
    actor_role = Column(String, nullable=False)
    action = Column(String, nullable=False) # APPROVE, HOLD, BLOCK, OVERRIDE
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
