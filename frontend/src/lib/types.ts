export interface RiskFinding {
  id: str;
  batch_id: string;
  employee_id?: string;
  employee_name?: string;
  layer: 'RULE' | 'ANOMALY' | 'GRAPH';
  rule_code: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  evidence_json?: any;
  created_at?: string;
}

export interface SalaryTransaction {
  id: string;
  batch_id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  gross_salary: number;
  net_salary: number;
  overtime_hours: number;
  overtime_pay: number;
  reimbursements: number;
  attendance_days: number;
  risk_score: number;
  status: 'APPROVED' | 'FLAG_REVIEW' | 'HOLD' | 'BLOCKED';
}

export interface PayrollBatch {
  id: string;
  batch_name: string;
  period_start: string;
  period_end: string;
  total_amount: number;
  total_employees: number;
  integrity_score: number;
  status: 'APPROVED' | 'PENDING_REVIEW' | 'HELD' | 'BLOCKED';
  processed_at?: string;
  transactions?: SalaryTransaction[];
  risk_findings?: RiskFinding[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'Employee' | 'Manager' | 'BankAccount' | 'Device' | 'Department' | 'IPAddress';
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: any;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  risk_level?: string;
}

export interface GraphPayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
  fraud_rings_count: number;
}
