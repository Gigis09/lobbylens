from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.company import Company
from app.models.filing import Filing
from app.models.issue import Issue
from app.models.filing_issue import FilingIssue
from app.schemas.dashboard import DashboardOut, RecentFilingOut

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardOut)
def get_dashboard(db: Session = Depends(get_db)):

    # -------------------------
    # TOTAL + COUNT
    # -------------------------
    total_tracked = db.execute(
        select(func.coalesce(func.sum(Filing.amount), 0))
    ).scalar_one()

    active_filings = db.execute(
        select(func.count(Filing.id))
    ).scalar_one()

    # -------------------------
    # TOP ISSUE AREA (REAL)
    # -------------------------
    top_issue_row = db.execute(
        select(
            Issue.name,
            func.sum(Filing.amount).label("total")
        )
        .join(FilingIssue, FilingIssue.issue_id == Issue.id)
        .join(Filing, Filing.id == FilingIssue.filing_id)
        .group_by(Issue.name)
        .order_by(func.sum(Filing.amount).desc())
        .limit(1)
    ).first()

    top_issue_area = top_issue_row.name if top_issue_row else "N/A"

    # -------------------------
    # RECENT DISCLOSURES (REAL ISSUES)
    # -------------------------
    recent_rows = db.execute(
        select(
            Company.name,
            Filing.amount,
            Filing.year,
            Filing.quarter,
            Filing.source,
            func.min(Issue.name).label("issue_name")  # pick one issue
        )
        .join(Filing, Filing.company_id == Company.id)
        .join(FilingIssue, FilingIssue.filing_id == Filing.id)
        .join(Issue, Issue.id == FilingIssue.issue_id)
        .where(Filing.amount > 0)
        .group_by(
            Filing.id,
            Company.name,
            Filing.amount,
            Filing.year,
            Filing.quarter,
            Filing.source
        )
        .order_by(Filing.id.desc())
        .limit(6)
    ).all()
    
    recent_disclosures = [
        RecentFilingOut(
            company=row.name,
            amount_spent=float(row.amount),
            primary_issue=row.issue_name,
            lobbying_firm=row.source or "Unknown",
            date_filed=f"{row.year} {row.quarter}",
        )
        for row in recent_rows
    ]

    # -------------------------
    # RETURN
    # -------------------------
    return DashboardOut(
        total_tracked=float(total_tracked),
        active_filings=int(active_filings),
        top_issue_area=top_issue_area,
        recent_disclosures=recent_disclosures,
    )