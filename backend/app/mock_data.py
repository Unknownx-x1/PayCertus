from typing import List, Dict, Any

class MockDataGenerator:
    """
    Generates high-fidelity demonstration datasets including:
    1. Clean Payroll Run (Score ~ 98, Status: APPROVED)
    2. Critical Fraud Ring & Anomaly Run (Score ~ 35, Status: BLOCKED)
    """

    @staticmethod
    def get_clean_payroll() -> List[Dict[str, Any]]:
        return [
            {
                "id": "E101",
                "first_name": "Alice",
                "last_name": "Smith",
                "email": "alice.smith@acme.com",
                "department": "Engineering",
                "job_title": "Senior Engineer",
                "base_salary": 95000.0,
                "gross_salary": 95000.0,
                "net_salary": 76000.0,
                "bank_account_no": "US4481029301",
                "bank_name": "JPMorgan Chase",
                "overtime_hours": 2.0,
                "overtime_pay": 150.0,
                "reimbursements": 120.0,
                "attendance_days": 22,
                "manager_id": "M401",
                "device_id": "DEV-IPHONE-101",
                "ip_address": "10.0.1.15"
            },
            {
                "id": "E102",
                "first_name": "Bob",
                "last_name": "Johnson",
                "email": "bob.johnson@acme.com",
                "department": "Engineering",
                "job_title": "Software Engineer",
                "base_salary": 80000.0,
                "gross_salary": 80000.0,
                "net_salary": 64000.0,
                "bank_account_no": "US4481029302",
                "bank_name": "Bank of America",
                "overtime_hours": 0.0,
                "overtime_pay": 0.0,
                "reimbursements": 45.0,
                "attendance_days": 22,
                "manager_id": "M401",
                "device_id": "DEV-MAC-102",
                "ip_address": "10.0.1.18"
            },
            {
                "id": "E103",
                "first_name": "Carol",
                "last_name": "Williams",
                "email": "carol.williams@acme.com",
                "department": "Finance",
                "job_title": "Financial Analyst",
                "base_salary": 75000.0,
                "gross_salary": 75000.0,
                "net_salary": 60000.0,
                "bank_account_no": "US4481029303",
                "bank_name": "Wells Fargo",
                "overtime_hours": 5.0,
                "overtime_pay": 300.0,
                "reimbursements": 300.0,
                "attendance_days": 21,
                "manager_id": "M402",
                "device_id": "DEV-DELL-103",
                "ip_address": "10.0.2.11"
            }
        ]

    @staticmethod
    def get_fraud_ring_payroll() -> List[Dict[str, Any]]:
        return [
            # Legitimate Employee
            {
                "id": "E201",
                "first_name": "David",
                "last_name": "Miller",
                "email": "david.miller@acme.com",
                "department": "Sales",
                "job_title": "Account Executive",
                "base_salary": 70000.0,
                "gross_salary": 70000.0,
                "net_salary": 56000.0,
                "bank_account_no": "US9912001101",
                "bank_name": "Citibank",
                "overtime_hours": 0.0,
                "overtime_pay": 0.0,
                "reimbursements": 150.0,
                "attendance_days": 22,
                "manager_id": "M403",
                "device_id": "DEV-HP-201",
                "ip_address": "172.16.0.41"
            },
            # Fraud Ring Member A (Ghost Employee - Shared Bank Account)
            {
                "id": "E202",
                "first_name": "Victor",
                "last_name": "Ghost",
                "email": "v.ghost@temp-domain.com",
                "department": "Operations",
                "job_title": "Operations Consultant",
                "base_salary": 115000.0,
                "gross_salary": 145000.0, # Spike & zero attendance
                "net_salary": 116000.0,
                "bank_account_no": "FRAUD-ACCOUNT-9988", # Shared Account!
                "bank_name": "Offshore Trust Bank",
                "overtime_hours": 48.0, # Excessive Overtime
                "overtime_pay": 30000.0,
                "reimbursements": 3500.0,
                "attendance_days": 0, # Zero Attendance!
                "manager_id": None, # Unassigned Manager
                "device_id": "DEV-SUSPICIOUS-X1", # Shared Device
                "ip_address": "198.51.100.99",
                "is_recently_hired": True
            },
            # Fraud Ring Member B (Collusion - Shared Bank Account & Shared Device)
            {
                "id": "E203",
                "first_name": "Marcus",
                "last_name": "Vance",
                "email": "marcus.vance@acme.com",
                "department": "Operations",
                "job_title": "Contract Specialist",
                "base_salary": 90000.0,
                "gross_salary": 125000.0,
                "net_salary": 100000.0,
                "bank_account_no": "FRAUD-ACCOUNT-9988", # Shared Account!
                "bank_name": "Offshore Trust Bank",
                "overtime_hours": 42.0, # Excessive Overtime
                "overtime_pay": 35000.0,
                "reimbursements": 4200.0,
                "attendance_days": 4, # Suspiciously low attendance
                "manager_id": "M404",
                "device_id": "DEV-SUSPICIOUS-X1", # Shared Device!
                "ip_address": "198.51.100.99"
            },
            # Fraud Ring Member C (Third Linked Account)
            {
                "id": "E204",
                "first_name": "Elena",
                "last_name": "Rostova",
                "email": "elena.rostova@acme.com",
                "department": "Operations",
                "job_title": "Field Coordinator",
                "base_salary": 85000.0,
                "gross_salary": 110000.0,
                "net_salary": 88000.0,
                "bank_account_no": "FRAUD-ACCOUNT-9988", # Shared Account!
                "bank_name": "Offshore Trust Bank",
                "overtime_hours": 35.0,
                "overtime_pay": 25000.0,
                "reimbursements": 1800.0,
                "attendance_days": 8,
                "manager_id": "M404",
                "device_id": "DEV-SUSPICIOUS-X1", # Shared Device!
                "ip_address": "198.51.100.99"
            }
        ]
