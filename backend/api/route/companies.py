from fastapi import APIRouter, Query
from app.services.aggregation_service import AggregationService

router = APIRouter()

@router.get("/companies/{company_id}/trend")

@router.get("/companies/{company_id}/issues")

@router.get("/companies/filter")
def filter_companies(
    industry: str | None = None,
    year: int | None = None,
    min_spend: float | None = None
):
    return AggregationService.filter_companies(industry, year, min_spend)
