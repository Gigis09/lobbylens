from pydantic import BaseModel


class RecentFilingOut(BaseModel):
    company: str
    amount_spent: float
    primary_issue: str
    lobbying_firm: str
    date_filed: str


class DashboardOut(BaseModel):
    total_tracked: float
    active_filings: int
    top_issue_area: str
    recent_disclosures: list[RecentFilingOut]