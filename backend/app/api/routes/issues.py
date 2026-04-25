from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.company import Company
from app.models.filing import Filing
from app.models.issue import Issue
from app.models.filing_issue import FilingIssue

router = APIRouter(prefix="/issues", tags=["issues"])


@router.get("/breakdown")
def get_issue_breakdown(db: Session = Depends(get_db)):
    stmt = (
        select(
            Issue.name.label("issue_name"),
            Company.name.label("company_name"),
            func.coalesce(func.sum(Filing.amount), 0).label("total_spent"),
        )
        .join(FilingIssue, FilingIssue.issue_id == Issue.id)
        .join(Filing, Filing.id == FilingIssue.filing_id)
        .join(Company, Company.id == Filing.company_id)
        .group_by(Issue.name, Company.name)
    )

    rows = db.execute(stmt).all()

    if not rows:
        total = db.execute(
            select(func.coalesce(func.sum(Filing.amount), 0))
        ).scalar_one()

        top = db.execute(
            select(Company.name, func.sum(Filing.amount).label("total"))
            .join(Filing, Filing.company_id == Company.id)
            .group_by(Company.name)
            .order_by(func.sum(Filing.amount).desc())
            .limit(1)
        ).first()

        return [
            {
                "name": "General Lobbying",
                "totalValue": float(total),
                "topSpender": top.name if top else "N/A",
                "color": "teal.6",
            }
        ]

    issue_data = {}

    for row in rows:
        issue_name = row.issue_name
        company_name = row.company_name
        spent = float(row.total_spent)

        if issue_name not in issue_data:
            issue_data[issue_name] = {
                "name": issue_name,
                "totalValue": 0,
                "topSpender": company_name,
                "maxSpend": spent,
            }

        issue_data[issue_name]["totalValue"] += spent

        if spent > issue_data[issue_name]["maxSpend"]:
            issue_data[issue_name]["maxSpend"] = spent
            issue_data[issue_name]["topSpender"] = company_name

    colors = [
        "teal.6",
        "blue.6",
        "grape.6",
        "orange.6",
        "cyan.6",
        "pink.6",
        "lime.6",
        "violet.6",
    ]

    sorted_issues = sorted(
        [i for i in issue_data.values() if i["totalValue"] > 0],
        key=lambda x: x["totalValue"],
        reverse=True
    )

    return [
        {
            "name": issue["name"],
            "totalValue": issue["totalValue"],
            "topSpender": issue["topSpender"],
            "color": colors[i % len(colors)],
        }
        for i, issue in enumerate(sorted_issues)
    ]