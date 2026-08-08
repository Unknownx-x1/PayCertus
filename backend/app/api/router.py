from fastapi import APIRouter
from app.api.ingestion_routes import router as ingestion_router
from app.api.payroll_routes import router as payroll_router
from app.api.audit_routes import router as audit_router

api_router = APIRouter()
api_router.include_router(ingestion_router)
api_router.include_router(payroll_router)
api_router.include_router(audit_router)
