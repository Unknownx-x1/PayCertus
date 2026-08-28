from typing import List, Dict, Any, Tuple

class ValidationService:
    """
    Data Integrity & CSV Validation Engine
    Enforces strict pre-ingestion validation on raw payroll records.
    Detects invalid numeric types, negative values, missing required fields, and duplicate IDs.
    """

    @staticmethod
    def validate_records(records: List[Dict[str, Any]]) -> Tuple[bool, List[str], List[str]]:
        errors: List[str] = []
        warnings: List[str] = []
        seen_emp_ids = set()

        if not records or len(records) == 0:
            return False, ["Payroll dataset is completely empty."], []

        for idx, r in enumerate(records):
            row_num = idx + 1
            
            # 1. Employee ID Validation
            emp_id = r.get("id") or r.get("employee_id") or r.get("empid") or r.get("code")
            if not emp_id or str(emp_id).strip() == "":
                errors.append(f"Row {row_num}: Missing required field 'employee_id'.")
            else:
                emp_id_str = str(emp_id).strip()
                if emp_id_str in seen_emp_ids:
                    warnings.append(f"Row {row_num}: Duplicate employee_id '{emp_id_str}' detected in batch.")
                seen_emp_ids.add(emp_id_str)

            # 2. Employee Name Validation
            emp_name = r.get("employee_name") or r.get("full_name") or r.get("name") or r.get("first_name")
            if not emp_name or str(emp_name).strip() == "":
                errors.append(f"Row {row_num}: Missing required field 'employee_name'.")

            # 3. Bank Account Validation
            bank_acc = r.get("bank_account") or r.get("bank_account_no") or r.get("account_number") or r.get("account")
            if not bank_acc or str(bank_acc).strip() == "":
                errors.append(f"Row {row_num}: Missing required field 'bank_account'.")

            # 4. Salary Numeric Validation
            salary_raw = r.get("salary") or r.get("gross_salary") or r.get("base_salary") or r.get("pay")
            if salary_raw is not None:
                try:
                    sal_val = float(salary_raw)
                    if sal_val < 0:
                        errors.append(f"Row {row_num}: Negative gross salary value (${sal_val}) is invalid.")
                except (ValueError, TypeError):
                    errors.append(f"Row {row_num}: Gross salary '{salary_raw}' is not a valid numeric amount.")

            # 5. Overtime Hours Validation
            ot_raw = r.get("overtime") or r.get("overtime_hours") or r.get("ot_hours")
            if ot_raw is not None:
                try:
                    ot_val = float(ot_raw)
                    if ot_val < 0:
                        errors.append(f"Row {row_num}: Negative overtime hours ({ot_val}h) is invalid.")
                    elif ot_val > 250:
                        warnings.append(f"Row {row_num}: Extreme overtime claim of {ot_val}h exceeds standard operational thresholds.")
                except (ValueError, TypeError):
                    errors.append(f"Row {row_num}: Overtime hours '{ot_raw}' is not a valid numeric amount.")

            # 6. Attendance Days Validation
            att_raw = r.get("attendance") or r.get("attendance_days") or r.get("days_worked")
            if att_raw is not None:
                try:
                    att_val = int(att_raw)
                    if att_val < 0 or att_val > 31:
                        errors.append(f"Row {row_num}: Attendance days ({att_val}) must be within valid range 0 to 31.")
                except (ValueError, TypeError):
                    errors.append(f"Row {row_num}: Attendance days '{att_raw}' is not a valid integer.")

        is_valid = len(errors) == 0
        return is_valid, errors, warnings
