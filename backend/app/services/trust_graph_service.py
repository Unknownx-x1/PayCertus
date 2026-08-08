import uuid
import networkx as nx
from typing import List, Dict, Any, Tuple

class TrustGraphService:
    """
    Layer 3: Enterprise Trust Graph Engine
    Dynamically builds graph entities strictly from ingested payroll batch fields.
    Does NOT fabricate missing entities (Manager, Device, IP, Department).
    Calculates exact dynamic nodes, edges, degree centralities, and fraud ring clusters.
    """

    @staticmethod
    def build_graph_and_detect(records: List[Dict[str, Any]], batch_id: str) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        G = nx.Graph()
        nodes_dict: Dict[str, Dict[str, Any]] = {}
        edges_list: List[Dict[str, Any]] = []
        findings: List[Dict[str, Any]] = []

        # 1. Build Dynamic Graph Topology strictly from available record fields
        for r in records:
            emp_id = str(r.get("id"))
            emp_name = f"{r.get('first_name', '')} {r.get('last_name', '')}".strip() or emp_id
            bank = str(r.get("bank_account_no", "")).strip()
            dept = r.get("department")
            manager_id = r.get("manager_id")
            device_id = r.get("device_id")
            ip_addr = r.get("ip_address")
            
            salary = float(r.get("gross_salary", 0.0))
            overtime = float(r.get("overtime_hours", 0.0))
            attendance = int(r.get("attendance_days", 22))
            risk_score = int(r.get("risk_score", 0))

            # Add Employee Node
            emp_node_id = f"EMP-{emp_id}"
            nodes_dict[emp_node_id] = {
                "id": emp_node_id,
                "label": f"{emp_id} {emp_name}",
                "type": "Employee",
                "risk_level": "CRITICAL" if risk_score >= 70 else ("HIGH" if risk_score >= 40 else "LOW"),
                "details": {
                    "employee_id": emp_id,
                    "name": emp_name,
                    "salary": f"${salary:,.2f}",
                    "overtime": f"{overtime} hrs",
                    "attendance": f"{attendance} days",
                    "bank_account": bank or "Data unavailable",
                    "risk_score": f"{risk_score} / 100"
                }
            }
            G.add_node(emp_node_id, type="Employee", label=emp_name)

            # Bank Account Node (Only if bank account exists)
            if bank:
                bank_node_id = f"BANK-{bank}"
                if bank_node_id not in nodes_dict:
                    nodes_dict[bank_node_id] = {
                        "id": bank_node_id,
                        "label": bank,
                        "type": "BankAccount",
                        "risk_level": "LOW",
                        "details": {
                            "account_number": bank,
                            "used_by_count": 0,
                            "employees": [],
                            "pattern": "Unique payment destination",
                            "evidence": ["Unique payment destination", "No shared-account anomaly detected"]
                        }
                    }
                    G.add_node(bank_node_id, type="BankAccount", label=bank)
                
                # Track connected employee
                nodes_dict[bank_node_id]["details"]["used_by_count"] += 1
                nodes_dict[bank_node_id]["details"]["employees"].append(emp_name)

                # Add PAID_TO Edge
                edge_id = f"e-paid-{emp_id}-{bank}"
                G.add_edge(emp_node_id, bank_node_id, label="PAID_TO")
                edges_list.append({
                    "id": edge_id,
                    "source": emp_node_id,
                    "target": bank_node_id,
                    "label": "PAID_TO",
                    "risk_level": "LOW"
                })

            # Department Node (ONLY if department is explicitly provided in CSV)
            if dept:
                dept_node_id = f"DEPT-{dept}"
                if dept_node_id not in nodes_dict:
                    nodes_dict[dept_node_id] = {
                        "id": dept_node_id,
                        "label": f"Dept: {dept}",
                        "type": "Department",
                        "risk_level": "LOW",
                        "details": {"department_name": dept}
                    }
                    G.add_node(dept_node_id, type="Department", label=dept)
                G.add_edge(emp_node_id, dept_node_id, label="BELONGS_TO")
                edges_list.append({
                    "id": f"e-dept-{emp_id}",
                    "source": emp_node_id,
                    "target": dept_node_id,
                    "label": "BELONGS_TO",
                    "risk_level": "LOW"
                })

            # Manager Node (ONLY if manager_id is explicitly provided in CSV)
            if manager_id:
                mgr_node_id = f"MGR-{manager_id}"
                if mgr_node_id not in nodes_dict:
                    nodes_dict[mgr_node_id] = {
                        "id": mgr_node_id,
                        "label": f"Manager ({manager_id})",
                        "type": "Manager",
                        "risk_level": "LOW",
                        "details": {"manager_id": manager_id}
                    }
                    G.add_node(mgr_node_id, type="Manager", label=manager_id)
                G.add_edge(emp_node_id, mgr_node_id, label="REPORTS_TO")
                edges_list.append({
                    "id": f"e-mgr-{emp_id}",
                    "source": emp_node_id,
                    "target": mgr_node_id,
                    "label": "REPORTS_TO",
                    "risk_level": "LOW"
                })

            # Device Node (ONLY if device_id is explicitly provided in CSV)
            if device_id:
                dev_node_id = f"DEV-{device_id}"
                if dev_node_id not in nodes_dict:
                    nodes_dict[dev_node_id] = {
                        "id": dev_node_id,
                        "label": f"Device: {device_id}",
                        "type": "Device",
                        "risk_level": "LOW",
                        "details": {"device_id": device_id}
                    }
                    G.add_node(dev_node_id, type="Device", label=device_id)
                G.add_edge(emp_node_id, dev_node_id, label="USES_DEVICE")
                edges_list.append({
                    "id": f"e-dev-{emp_id}",
                    "source": emp_node_id,
                    "target": dev_node_id,
                    "label": "USES_DEVICE",
                    "risk_level": "LOW"
                })

            # IP Address Node (ONLY if ip_address is explicitly provided in CSV)
            if ip_addr:
                ip_node_id = f"IP-{ip_addr}"
                if ip_node_id not in nodes_dict:
                    nodes_dict[ip_node_id] = {
                        "id": ip_node_id,
                        "label": f"IP: {ip_addr}",
                        "type": "IPAddress",
                        "risk_level": "LOW",
                        "details": {"ip_address": ip_addr}
                    }
                    G.add_node(ip_node_id, type="IPAddress", label=ip_addr)
                G.add_edge(emp_node_id, ip_node_id, label="LOGGED_FROM")
                edges_list.append({
                    "id": f"e-ip-{emp_id}",
                    "source": emp_node_id,
                    "target": ip_node_id,
                    "label": "LOGGED_FROM",
                    "risk_level": "LOW"
                })

        # 2. Graph Analytics: Fraud Ring & Shared Account Cluster Detection
        fraud_rings_count = 0
        
        for node in list(G.nodes()):
            node_type = G.nodes[node].get("type")
            neighbors = list(G.neighbors(node))
            emp_neighbors = [n for n in neighbors if G.nodes[n].get("type") == "Employee"]
            
            # Detect shared payment infrastructure (Degree >= 2 on Bank Account, Device, or IP)
            if node_type in ["BankAccount", "Device", "IPAddress"] and len(emp_neighbors) >= 2:
                fraud_rings_count += 1
                
                # Mark Node as CRITICAL Risk
                if node in nodes_dict:
                    nodes_dict[node]["risk_level"] = "CRITICAL"
                    connected_names = nodes_dict[node]["details"].get("employees", [nodes_dict[e]["details"]["name"] for e in emp_neighbors if e in nodes_dict])
                    
                    # Update inspector details for Shared Bank Account
                    nodes_dict[node]["details"]["pattern"] = "Shared payment destination (Coordinated Cluster)"
                    nodes_dict[node]["details"]["evidence"] = [
                        f"{len(connected_names)} employees share single payment destination {nodes_dict[node]['label']}",
                        f"Connected employees: {', '.join(connected_names)}",
                        "Coordinated payroll fraud cluster pattern detected"
                    ]

                # Elevate risk level for all connected Employee nodes and Edges
                for emp_node in emp_neighbors:
                    if emp_node in nodes_dict:
                        # Check if employee has other anomalies (e.g. 0 attendance)
                        emp_risk = nodes_dict[emp_node]["details"].get("risk_score", "0")
                        nodes_dict[emp_node]["risk_level"] = "CRITICAL"
                        
                    for edge in edges_list:
                        if (edge["source"] == emp_node and edge["target"] == node) or (edge["source"] == node and edge["target"] == emp_node):
                            edge["risk_level"] = "CRITICAL"

                emp_names_str = ", ".join([nodes_dict[e]["details"]["name"] for e in emp_neighbors if e in nodes_dict])
                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": None,
                    "employee_name": emp_names_str,
                    "layer": "GRAPH",
                    "rule_code": "GRAPH_FRAUD_RING_CLUSTER",
                    "severity": "CRITICAL",
                    "title": f"Coordinated Payroll Cluster ({nodes_dict[node]['label']})",
                    "description": f"Enterprise Trust Graph detected {len(emp_neighbors)} employees ({emp_names_str}) sharing single payment destination {nodes_dict[node]['label']}.",
                    "evidence_json": {
                        "shared_entity": nodes_dict[node]["label"],
                        "entity_type": node_type,
                        "cluster_size": len(emp_neighbors),
                        "connected_employees": [nodes_dict[e]["details"]["name"] for e in emp_neighbors if e in nodes_dict]
                    }
                })

        graph_payload = {
            "nodes": list(nodes_dict.values()),
            "edges": edges_list,
            "fraud_rings_count": fraud_rings_count
        }

        return graph_payload, findings
