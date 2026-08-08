import uuid
import numpy as np
import pandas as pd
from typing import List, Dict, Any
from sklearn.ensemble import IsolationForest

class MLAnomalyEngineService:
    """
    Layer 2: Machine Learning & Statistical Anomaly Engine
    Uses Isolation Forest and Z-Score statistics to identify multivariate numerical outliers.
    """
    
    @staticmethod
    def evaluate(records: List[Dict[str, Any]], batch_id: str) -> List[Dict[str, Any]]:
        findings = []
        if len(records) < 3:
            return findings
            
        df = pd.DataFrame(records)
        
        # Prepare feature matrix for anomaly detection
        features = ["gross_salary", "overtime_pay", "reimbursements", "attendance_days"]
        for feat in features:
            if feat not in df.columns:
                df[feat] = 0.0
            else:
                df[feat] = df[feat].fillna(0.0).astype(float)
                
        X = df[features].values
        
        # 1. Isolation Forest Model
        try:
            clf = IsolationForest(contamination=0.1, random_state=42)
            preds = clf.fit_predict(X)
            scores = clf.decision_function(X) # lower score = more anomalous
            
            for idx, pred in enumerate(preds):
                if pred == -1: # Outlier detected
                    row = df.iloc[idx]
                    emp_id = row["id"]
                    name = f"{row['first_name']} {row['last_name']}"
                    anomaly_score = float(np.round((1.0 - scores[idx]) * 50, 1))
                    
                    findings.append({
                        "id": f"rf-{uuid.uuid4().hex[:8]}",
                        "batch_id": batch_id,
                        "employee_id": emp_id,
                        "employee_name": name,
                        "layer": "ANOMALY",
                        "rule_code": "ML_ISOLATION_FOREST_OUTLIER",
                        "severity": "HIGH" if anomaly_score > 60 else "MEDIUM",
                        "title": "Multivariate Payroll Anomaly (ML)",
                        "description": f"Employee {name} exhibits abnormal salary, overtime, and reimbursement behavior (Anomaly Score: {anomaly_score}/100).",
                        "evidence_json": {
                            "anomaly_score": anomaly_score,
                            "gross_salary": float(row["gross_salary"]),
                            "overtime_pay": float(row["overtime_pay"]),
                            "reimbursements": float(row["reimbursements"])
                        }
                    })
        except Exception as e:
            print(f"ML Anomaly Engine IsolationForest Error: {e}")

        # 2. Departmental Z-Score Outlier Analysis
        try:
            for dept, group in df.groupby("department"):
                if len(group) >= 3:
                    sal_std = group["gross_salary"].std()
                    sal_mean = group["gross_salary"].mean()
                    if sal_std > 0:
                        group["z_score"] = (group["gross_salary"] - sal_mean) / sal_std
                        for idx, row in group.iterrows():
                            z = row["z_score"]
                            if abs(z) > 2.5:
                                emp_id = row["id"]
                                name = f"{row['first_name']} {row['last_name']}"
                                findings.append({
                                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                                    "batch_id": batch_id,
                                    "employee_id": emp_id,
                                    "employee_name": name,
                                    "layer": "ANOMALY",
                                    "rule_code": "STAT_DEPARTMENT_ZSCORE_OUTLIER",
                                    "severity": "HIGH",
                                    "title": f"Significant Department Salary Outlier ({dept})",
                                    "description": f"Gross salary for {name} (${row['gross_salary']:,.2f}) deviates significantly from {dept} department average (${sal_mean:,.2f}, Z-score: {z:.2f}).",
                                    "evidence_json": {
                                        "z_score": round(float(z), 2),
                                        "department": dept,
                                        "department_mean": round(float(sal_mean), 2)
                                    }
                                })
        except Exception as e:
            print(f"ML Anomaly Engine Z-Score Error: {e}")
            
        return findings
