from pydantic import BaseModel


class YearAmount(BaseModel):
    year: int
    amount: float


class CompanySpendingOut(BaseModel):
    company_id: int
    company_name: str
    total_spending: float
    by_year: list[YearAmount]