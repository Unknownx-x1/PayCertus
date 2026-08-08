from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api.router import api_router
from app.mock_data import MockDataGenerator
from app.services.ingestion_service import IngestionService
from app.models.payroll_models import PayrollBatch

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API V1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    """Create DB tables and pre-seed demo dataset on server startup."""
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed sample datasets if DB is empty
    db = SessionLocal()
    try:
        count = db.query(PayrollBatch).count()
        if count == 0:
            print("Seeding initial demonstration datasets into Payroll Sentinel DB...")
            # Seed Clean Payroll
            clean_records = MockDataGenerator.get_clean_payroll()
            IngestionService.process_payroll_data(clean_records, "Jul 2026 Regular Payroll (Clean)", db)
            
            # Seed Fraud Ring Payroll
            fraud_records = MockDataGenerator.get_fraud_ring_payroll()
            IngestionService.process_payroll_data(fraud_records, "Aug 2026 Executive Payroll (Fraud Ring Alert)", db)
            print("Database pre-seeded successfully!")
    except Exception as e:
        print(f"Startup DB seeding exception: {e}")
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "PayCertus AI Engine",
        "docs_url": "/docs",
        "version": settings.VERSION
    }
