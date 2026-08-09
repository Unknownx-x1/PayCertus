from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import MongoDBManager, init_db_indexes
from app.api.router import api_router
from app.mock_data import MockDataGenerator
from app.services.ingestion_service import IngestionService
from app.models.payroll_models import PAYROLL_BATCHES_COLLECTION

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
    """Ensure MongoDB indexes and pre-seed demo dataset on server startup."""
    # Mask password for secure logging
    raw_url = settings.MONGODB_URL
    masked_url = raw_url.split("@")[-1] if "@" in raw_url else raw_url
    print(f"🔌 PayCertus Database Engine: Connecting to user-defined MongoDB target ({masked_url})...")
    
    try:
        db = MongoDBManager.get_database()
        init_db_indexes(db)
        
        # Auto-seed sample datasets if MongoDB collection is empty
        count = db[PAYROLL_BATCHES_COLLECTION].count_documents({})
        if count == 0:
            print("🌱 Empty MongoDB database detected. Seeding initial demonstration datasets...")
            clean_records = MockDataGenerator.get_clean_payroll()
            IngestionService.process_payroll_data(clean_records, "Jul 2026 Regular Payroll (Clean)", db)
            
            fraud_records = MockDataGenerator.get_fraud_ring_payroll()
            IngestionService.process_payroll_data(fraud_records, "Aug 2026 Executive Payroll (Fraud Ring Alert)", db)
            print("✅ MongoDB database initialized & pre-seeded successfully!")
        else:
            print(f"✅ Connected to MongoDB! Found {count} existing payroll batches.")
    except Exception as e:
        print(f"⚠️ MongoDB connection note: {e}")
        print("💡 Hint: Ensure MONGODB_URL is set in backend/.env to your MongoDB Atlas or local MongoDB connection string.")

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "PayCertus AI Engine (MongoDB Document Store)",
        "docs_url": "/docs",
        "version": settings.VERSION
    }
