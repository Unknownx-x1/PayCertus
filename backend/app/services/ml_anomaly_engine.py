import uuid
import numpy as np
import pandas as pd
from typing import List, Dict, Any
from sklearn.ensemble import IsolationForest

class MLAnomalyEngineService:
    """
    Layer 2: Machine Learning & Statistical Anomaly Engine
    Uses Isolation Forest and Z-Score statistics to identify multivariate numerical outliers.
    IMPORTANT CORE PRINCIPLE: ANOMALY ≠ FRAUD.
    Flags statistical deviation from baseline without falsely asserting fraud unless supported by rule or graph evidence.
    """
    
    @staticmethod
    def evaluate(records: List[Dict[str, Any]], batch_id: str) -> List[Dict[str, Any]]:
        findings = []
        if len(records) < 3:
            return findings
            
        df = pd.DataFrame(records)
        
        # Prepare feature matrix for anomaly detection
        features = ["gross_salary", "overtime_hours", "reimbursements", "attendance_days"]
        for feat in features:
            if feat not in df.columns:
                df[feat] = 0.0
            else:
                df[feat] = df[feat].fillna(0.0).astype(float)
                
        X = df[features].values
        
        # Calculate batch baselines for comparison
        salary_mean = df["gross_salary"].mean()
        ot_mean = df["overtime_hours"].mean()
        claims_mean = df["reimbursements"].mean()
        att_mean = df["attendance_days"].mean()

        has_dept = "department" in df.columns and df["department"].dropna().count() > 0

        # 1. Isolation Forest Model
        try:
            clf = IsolationForest(contamination=0.1, random_state=42)
            preds = clf.fit_predict(X)
            scores = clf.decision_function(X) # lower score = more anomalous
            
            for idx, pred in enumerate(preds):
                if pred == -1: # Outlier detected
                    row = df.iloc[idx]
                    emp_id = row["id"]
                    name = f"{row.get('first_name', '')} {row.get('last_name', '')}".strip() or emp_id
                    
                    # Scale decision score to 0-100 anomaly score
                    raw_score = scores[idx]
                    anomaly_score = float(np.round(min(100.0, max(10.0, (0.5 - raw_score) * 100)), 1))
                    
                    # Compute feature deviations against baseline
                    sal_val = float(row["gross_salary"])
                    ot_val = float(row["overtime_hours"])
                    claims_val = float(row["reimbursements"])
                    att_val = float(row["attendance_days"])

                    baseline_label = f"Department '{row.get('department')}' Baseline" if (has_dept and row.get("department")) else "Batch-Level Baseline"

                    deviations = []
                    if ot_val > ot_mean + 10:
                        deviations.append(f"Overtime ({ot_val}h) significantly above baseline average ({ot_mean:.1f}h)")
                    if claims_val > claims_mean + 1000:
                        deviations.append(f"Reimbursement (${claims_val:,.2f}) significantly above baseline average (${claims_mean:,.2f})")
                    if att_val < att_mean - 5:
                        deviations.append(f"Attendance ({att_val} days) significantly below baseline average ({att_mean:.1f} days)")
                    if sal_val > salary_mean * 1.8:
                        deviations.append(f"Gross salary (${sal_val:,.2f}) significantly above baseline average (${salary_mean:,.2f})")

                    if not deviations:
                        deviations.append("Multivariate numerical feature combination deviates from peer distribution vector.")

                    findings.append({
                        "id": f"rf-{uuid.uuid4().hex[:8]}",
                        "batch_id": batch_id,
                        "employee_id": emp_id,
                        "employee_name": name,
                        "layer": "ANOMALY",
                        "rule_code": "ML_ISOLATION_FOREST_OUTLIER",
                        "severity": "HIGH" if anomaly_score >= 65 else "MEDIUM",
                        "title": "Multivariate Statistical Outlier (ML)",
                        "description": f"Employee {name} exhibits statistical deviation from baseline (ML Anomaly Score: {anomaly_score}/100). NOTE: Statistical anomaly does not constitute proof of fraud.",
                        "evidence_json": {
                            "model": "Isolation Forest (Multivariate Anomaly Detection)",
                            "anomaly_score": anomaly_score,
                            "classification": "HIGH STATISTICAL OUTLIER" if anomaly_score >= 65 else "MEDIUM STATISTICAL OUTLIER",
                            "baseline_type": baseline_label,
                            "observed_features": {
                                "gross_salary": sal_val,
                                "overtime_hours": ot_val,
                                "reimbursements": claims_val,
                                "attendance_days": att_val
                            },
                            "baseline_averages": {
                                "gross_salary": round(salary_mean, 2),
                                "overtime_hours": round(ot_mean, 2),
                                "reimbursements": round(claims_mean, 2),
                                "attendance_days": round(att_mean, 2)
                            },
                            "major_deviations": deviations
                        }
                    })
        except Exception as e:
            print(f"ML Anomaly Engine IsolationForest Error: {e}")

        # 2. Departmental Z-Score Outlier Analysis (ONLY if department is explicitly populated)
        if has_dept:
            try:
                for dept, group in df.groupby("department"):
                    if dept and str(dept).strip() != "" and len(group) >= 3:
                        sal_std = group["gross_salary"].std()
                        sal_mean = group["gross_salary"].mean()
                        if sal_std > 0:
                            for idx, row in group.iterrows():
                                z = (row["gross_salary"] - sal_mean) / sal_std
                                if abs(z) > 2.5:
                                    emp_id = row["id"]
                                    name = f"{row.get('first_name', '')} {row.get('last_name', '')}".strip() or emp_id
                                    findings.append({
                                        "id": f"rf-{uuid.uuid4().hex[:8]}",
                                        "batch_id": batch_id,
                                        "employee_id": emp_id,
                                        "employee_name": name,
                                        "layer": "ANOMALY",
                                        "rule_code": "STAT_DEPARTMENT_ZSCORE_OUTLIER",
                                        "severity": "MEDIUM",
                                        "title": f"Department Salary Variance ({dept})",
                                        "description": f"Gross salary for {name} (${row['gross_salary']:,.2f}) deviates from {dept} department baseline average (${sal_mean:,.2f}, Z-score: {z:.2f}).",
                                        "evidence_json": {
                                            "model": "Departmental Z-Score Distribution",
                                            "z_score": round(float(z), 2),
                                            "department": dept,
                                            "department_mean": round(float(sal_mean), 2),
                                            "baseline_type": f"Department '{dept}' Peer Baseline",
                                            "major_deviations": [f"Salary ${row['gross_salary']:,.2f} is {z:.1f} std deviations from department mean ${sal_mean:,.2f}"]
                                        }
                                    })
            except Exception as e:
                print(f"ML Anomaly Engine Z-Score Error: {e}")
            
        return findings
