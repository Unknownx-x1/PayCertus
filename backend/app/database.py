from pymongo import MongoClient, ASCENDING, DESCENDING
from app.config import settings

class MongoDBManager:
    _client = None

    @classmethod
    def get_client(cls) -> MongoClient:
        if cls._client is None:
            # Initialize MongoDB Client connection pool
            cls._client = MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=5000)
        return cls._client

    @classmethod
    def get_database(cls):
        client = cls.get_client()
        return client[settings.MONGODB_DB_NAME]

def get_db():
    """FastAPI dependency for accessing MongoDB database instance."""
    db = MongoDBManager.get_database()
    try:
        yield db
    finally:
        pass  # Connection pooling is handled automatically by PyMongo

def init_db_indexes(db=None):
    """Ensure indexes on MongoDB collections for optimal query performance."""
    if db is None:
        db = MongoDBManager.get_database()
        
    try:
        # Create indexes
        db.employees.create_index([("id", ASCENDING)], unique=True)
        db.payroll_batches.create_index([("id", ASCENDING)], unique=True)
        db.payroll_batches.create_index([("processed_at", DESCENDING)])
        db.salary_transactions.create_index([("id", ASCENDING)], unique=True)
        db.salary_transactions.create_index([("batch_id", ASCENDING)])
        db.risk_findings.create_index([("id", ASCENDING)], unique=True)
        db.risk_findings.create_index([("batch_id", ASCENDING)])
        db.audit_logs.create_index([("id", ASCENDING)], unique=True)
        db.audit_logs.create_index([("timestamp", DESCENDING)])
    except Exception as e:
        print(f"MongoDB index setup note: {e}")
