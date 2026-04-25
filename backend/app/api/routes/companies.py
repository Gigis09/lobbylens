from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.db import get_db
from app.models.company import Company
from app.schemas.company import CompanyOut

router = APIRouter(prefix="/companies")

@router.get("", response_model=list[CompanyOut])
@router.get("", response_model=list[CompanyOut])
def search_companies(
    query: str = Query("", min_length=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    stmt = select(Company)

    if query.strip():
        stmt = stmt.where(Company.name.ilike(f"%{query.strip()}%"))
        stmt = stmt.limit(limit)
    else:
        stmt = stmt.limit(200)  # bigger default for homepage

    stmt = stmt.order_by(Company.name)

    return db.execute(stmt).scalars().all()
@router.get("/{company_id}", response_model=CompanyOut)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company