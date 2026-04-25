from fastapi import APIRouter
from app.services.comparison_service import ComparisonService

router = APIRouter()

@router.get("/compare")
def compare(companyA: int, companyB: int):
    return ComparisonService.compare_companies(companyA, companyB)
