import io
import json
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.ingestion_service import IngestionService
from app.mock_data import MockDataGenerator

router = APIRouter(prefix="/ingest", tags=["Ingestion & Pipeline Execution"])

@router.post("/upload-csv")
def upload_payroll_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload CSV payroll batch file, run multi-layer fraud pipeline, and return result."""
    try:
        content = file.file.read()
        df = pd.read_csv(io.BytesIO(content))
        records = df.to_dict(orient="records")
        
        batch, graph_payload, narrative = IngestionService.process_payroll_data(records, file.filename, db)
        
        return {
            "message": "Payroll batch processed successfully",
            "batch_id": batch.id,
            "batch_name": batch.batch_name,
            "total_employees": batch.total_employees,
            "integrity_score": batch.integrity_score,
            "status": batch.status,
            "graph": graph_payload,
            "narrative": narrative
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV payroll file: {str(e)}")

@router.post("/sample-clean")
def load_sample_clean(db: Session = Depends(get_db)):
    """Seed & process clean demo payroll run."""
    records = MockDataGenerator.get_clean_payroll()
    batch, graph_payload, narrative = IngestionService.process_payroll_data(records, "Aug 2026 Regular Payroll (Clean)", db)
    return {
        "message": "Clean sample payroll batch processed",
        "batch_id": batch.id,
        "batch_name": batch.batch_name,
        "integrity_score": batch.integrity_score,
        "status": batch.status,
        "graph": graph_payload,
        "narrative": narrative
    }

@router.post("/sample-fraud")
def load_sample_fraud(db: Session = Depends(get_db)):
    """Seed & process high-risk fraud ring demo payroll run."""
    records = MockDataGenerator.get_fraud_ring_payroll()
    batch, graph_payload, narrative = IngestionService.process_payroll_data(records, "Aug 2026 Executive Payroll (Fraud Ring Alert)", db)
    return {
        "message": "Fraud sample payroll batch processed",
        "batch_id": batch.id,
        "batch_name": batch.batch_name,
        "integrity_score": batch.integrity_score,
        "status": batch.status,
        "graph": graph_payload,
        "narrative": narrative
    }
