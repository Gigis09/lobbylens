from fastapi import APIRouter
from app.services.dashboard_service import DashboardService

router = APIRouter()

@router.get("/dashboard/summary")
def dashboard_summary():
    return DashboardService.get_summary()
