import uuid
import networkx as nx
from typing import List, Dict, Any, Tuple

class TrustGraphService:
    """
    Layer 3: Enterprise Trust Graph Engine
    Builds graph entities (Employees, Bank Accounts, Managers, Devices, IPs, Departments)
    and executes graph algorithms to discover coordinated fraud rings & shared infrastructure.
    """

    @staticmethod
    def build_graph_and_detect(records: List[Dict[str, Any]], batch_id: str) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        G = nx.Graph()
        nodes_dict: Dict[str, Dict[str, Any]] = {}
        edges_list: List[Dict[str, Any]] = []
        findings: List[Dict[str, Any]] = []

        # Build Graph Elements from Records
        for r in records:
            emp_id = r.get("id")
            emp_name = f"{r.get('first_name')} {r.get('last_name')}"
            dept = r.get("department", "General")
            bank = r.get("bank_account_no", "").strip()
            manager_id = r.get("manager_id")
            device = r.get("device_id")
            ip = r.get("ip_address")
            risk_score = r.get("risk_score", 0)

            # 1. Add Employee Node
            emp_node_id = f"EMP-{emp_id}"
            nodes_dict[emp_node_id] = {
                "id": emp_node_id,
                "label": emp_name,
                "type": "Employee",
                "risk_level": "CRITICAL" if risk_score > 70 else ("HIGH" if risk_score > 40 else "LOW"),
                "details": {
                    "employee_id": emp_id,
                    "title": r.get("job_title"),
                    "department": dept,
                    "gross_salary": r.get("gross_salary")
                }
            }
            G.add_node(emp_node_id, type="Employee", label=emp_name)

            # 2. Add Department Edge
            dept_node_id = f"DEPT-{dept}"
            if dept_node_id not in nodes_dict:
                nodes_dict[dept_node_id] = {
                    "id": dept_node_id,
                    "label": f"{dept} Dept",
                    "type": "Department",
                    "risk_level": "LOW",
                    "details": {"name": dept}
                }
                G.add_node(dept_node_id, type="Department", label=dept)
            G.add_edge(emp_node_id, dept_node_id, label="BELONGS_TO")
            edges_list.append({"id": f"e-{len(edges_list)}", "source": emp_node_id, "target": dept_node_id, "label": "BELONGS_TO", "risk_level": "LOW"})

            # 3. Add Bank Account Entity
            if bank:
                bank_node_id = f"BANK-{bank}"
                if bank_node_id not in nodes_dict:
                    nodes_dict[bank_node_id] = {
                        "id": bank_node_id,
                        "label": f"Bank: ...{bank[-4:]}",
                        "type": "BankAccount",
                        "risk_level": "LOW",
                        "details": {"account_no": bank, "bank_name": r.get("bank_name", "Bank")}
                    }
                    G.add_node(bank_node_id, type="BankAccount", label=bank)
                G.add_edge(emp_node_id, bank_node_id, label="PAID_TO")
                edges_list.append({"id": f"e-{len(edges_list)}", "source": emp_node_id, "target": bank_node_id, "label": "PAID_TO", "risk_level": "LOW"})

            # 4. Add Manager Entity
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
                edges_list.append({"id": f"e-{len(edges_list)}", "source": emp_node_id, "target": mgr_node_id, "label": "REPORTS_TO", "risk_level": "LOW"})

            # 5. Add Device Entity
            if device:
                dev_node_id = f"DEV-{device}"
                if dev_node_id not in nodes_dict:
                    nodes_dict[dev_node_id] = {
                        "id": dev_node_id,
                        "label": f"Device: {device[:8]}",
                        "type": "Device",
                        "risk_level": "LOW",
                        "details": {"device_id": device}
                    }
                    G.add_node(dev_node_id, type="Device", label=device)
                G.add_edge(emp_node_id, dev_node_id, label="USES_DEVICE")
                edges_list.append({"id": f"e-{len(edges_list)}", "source": emp_node_id, "target": dev_node_id, "label": "USES_DEVICE", "risk_level": "LOW"})

            # 6. Add IP Address Entity
            if ip:
                ip_node_id = f"IP-{ip}"
                if ip_node_id not in nodes_dict:
                    nodes_dict[ip_node_id] = {
                        "id": ip_node_id,
                        "label": f"IP: {ip}",
                        "type": "IPAddress",
                        "risk_level": "LOW",
                        "details": {"ip_address": ip}
                    }
                    G.add_node(ip_node_id, type="IPAddress", label=ip)
                G.add_edge(emp_node_id, ip_node_id, label="LOGGED_FROM_IP")
                edges_list.append({"id": f"e-{len(edges_list)}", "source": emp_node_id, "target": ip_node_id, "label": "LOGGED_FROM_IP", "risk_level": "LOW"})

        # Graph Analytics: Detect Fraud Rings & Shared Risk Centrality
        fraud_rings_count = 0
        
        # Check high degree centrality on Bank Accounts, Devices, IPs
        for node, degree in G.degree():
            node_type = G.nodes[node].get("type")
            if node_type in ["BankAccount", "Device", "IPAddress"] and degree >= 2:
                fraud_rings_count += 1
                
                # Mark node as Critical Risk
                if node in nodes_dict:
                    nodes_dict[node]["risk_level"] = "CRITICAL"
                    
                # Find connected employees
                connected_emps = [n for n in G.neighbors(node) if G.nodes[n].get("type") == "Employee"]
                emp_names = ", ".join([nodes_dict[e]["label"] for e in connected_emps if e in nodes_dict])
                
                # Highlight edges as CRITICAL
                for edge in edges_list:
                    if edge["source"] == node or edge["target"] == node:
                        edge["risk_level"] = "CRITICAL"

                findings.append({
                    "id": f"rf-{uuid.uuid4().hex[:8]}",
                    "batch_id": batch_id,
                    "employee_id": None,
                    "employee_name": emp_names,
                    "layer": "GRAPH",
                    "rule_code": "GRAPH_FRAUD_RING_RING_CLUSTER",
                    "severity": "CRITICAL",
                    "title": f"Coordinated Fraud Ring Identified ({node_type})",
                    "description": f"Trust Graph analytics discovered {degree} connected employees sharing single infrastructure node {node} ({nodes_dict[node]['label']}): {emp_names}.",
                    "evidence_json": {
                        "infrastructure_node": node,
                        "node_type": node_type,
                        "connected_count": len(connected_emps),
                        "connected_employees": [nodes_dict[e]["label"] for e in connected_emps if e in nodes_dict]
                    }
                })

        graph_payload = {
            "nodes": list(nodes_dict.values()),
            "edges": edges_list,
            "fraud_rings_count": fraud_rings_count
        }

        return graph_payload, findings
