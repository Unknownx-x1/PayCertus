import csv
import random

# Generate a comprehensive 200-employee benchmark dataset with all 12 anomaly types planted
records = []

first_names = ["Arjun", "Neha", "Rohan", "Priya", "Vikram", "Ananya", "Karan", "Sneha", "Aditya", "Ishita",
               "Siddharth", "Meera", "Kabir", "Riya", "Aarav", "Tanvi", "Dev", "Pooja", "Varun", "Simran",
               "Rahul", "Deepika", "Amit", "Kavya", "Manish", "Sonam", "Gaurav", "Nisha", "Rajesh", "Swati"]
last_names = ["Sharma", "Verma", "Kapoor", "Singh", "Gupta", "Mehta", "Patel", "Joshi", "Bose", "Rao",
              "Reddy", "Nair", "Deshmukh", "Chopra", "Saxena", "Malhotra", "Trivedi", "Iyer", "Choudhury", "Bhatnagar"]
departments = ["Engineering", "Sales", "Finance", "HR", "Operations", "Marketing", "Legal", "Customer Support"]

random.seed(42)

for i in range(1, 201):
    emp_id = f"EMP-{1000 + i}"
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    dept = random.choice(departments)
    email = f"{fn.lower()}.{ln.lower()}{i}@company.com"
    base_sal = float(random.randint(45000, 95000))
    ot_hrs = float(random.choice([0, 0, 0, 2, 4, 6, 8]))
    ot_pay = ot_hrs * 45.0
    claims = float(random.choice([0, 0, 0, 150, 300, 450]))
    gross = base_sal + ot_pay
    net = round(gross * 0.82, 2)
    bank_acc = f"XXXXXX{1000 + i}"
    status = "active"
    bonus = 0.0
    prev_sal = base_sal
    sal_inc_pct = 0.0
    bank_changed = False
    is_ghost = False
    attendance = 22

    # Plant 12 distinct anomaly vectors into specific records
    if i == 5:
        # Anomaly 1: Unusually High Salary
        base_sal = 320000.0
        gross = 320000.0
        net = 262400.0

    elif i == 12:
        # Anomaly 2: Large Salary Increase
        prev_sal = 60000.0
        base_sal = 85000.0
        sal_inc_pct = 41.6
        gross = base_sal
        net = 69700.0

    elif i == 18:
        # Anomaly 3: Terminated Employee Still Paid
        status = "terminated"
        gross = 75000.0
        net = 61500.0

    elif i == 25:
        # Anomaly 4: Recent Bank Account Change
        bank_changed = True
        bank_acc = "XXXXXX9888"

    elif i == 32:
        # Anomaly 5: Excessive Unexplained Bonus
        bonus = 15000.0
        gross = base_sal + bonus
        net = round(gross * 0.82, 2)

    elif i == 40:
        # Anomaly 6: Suspicious Round-Number Payment
        gross = 30000.0
        base_sal = 30000.0
        net = 24600.0

    elif i == 48:
        # Anomaly 7: Ghost Employee ID with Zero Attendance
        emp_id = "EMP-GHOST-909"
        status = "ghost"
        is_ghost = True
        attendance = 0
        gross = 65000.0
        net = 53300.0

    elif i in [55, 56, 57, 58, 59]:
        # Anomaly 8: Shared Bank Account Cluster 1 (XXXXXX4821 shared across 5 employees)
        bank_acc = "XXXXXX4821"

    elif i in [70, 71, 72, 73, 74, 75, 76, 77, 78]:
        # Anomaly 9: Shared Bank Account Cluster 2 (XXXXXX1182 shared across 9 employees)
        bank_acc = "XXXXXX1182"

    elif i == 90:
        # Anomaly 10: Triple-Threat Compound (Account Change + Salary Spike + Bonus)
        bank_changed = True
        prev_sal = 50000.0
        base_sal = 75000.0
        sal_inc_pct = 50.0
        bonus = 8000.0
        gross = base_sal + bonus
        net = round(gross * 0.82, 2)

    elif i == 105:
        # Anomaly 11: Ghost Employee + Excessive Payment
        status = "ghost"
        is_ghost = True
        attendance = 0
        bonus = 12000.0
        gross = 90000.0
        net = 73800.0

    elif i == 120:
        # Anomaly 12: Terminated Employee + Shared Account
        status = "terminated"
        bank_acc = "XXXXXX4821" # Joins the shared cluster!
        gross = 70000.0
        net = 57400.0

    records.append({
        "employee_id": emp_id,
        "first_name": fn,
        "last_name": ln,
        "email": email,
        "department": dept,
        "base_salary": base_sal,
        "gross_salary": gross,
        "net_salary": net,
        "bonus": bonus,
        "previous_salary": prev_sal,
        "salary_increase_pct": sal_inc_pct,
        "bank_account_no": bank_acc,
        "bank_account_changed": bank_changed,
        "employment_status": status,
        "is_ghost": is_ghost,
        "overtime_hours": ot_hrs,
        "reimbursements": claims,
        "attendance_days": attendance
    })

# Add 1 Duplicate Payment Entry (Anomaly 13) for EMP-1042
dup_record = dict(records[41])
dup_record["gross_salary"] = 62000.0
records.append(dup_record)

headers = list(records[0].keys())

file_path = "c:/Users/SHIVANSH/payroll_fintech/frontend/public/payroll_sentinel_200_multi_signal_batch.csv"
with open(file_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerows(records)

print(f"Generated 200-record benchmark dataset with all 12 anomaly types at {file_path}")
