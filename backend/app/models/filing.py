from sqlalchemy import Integer, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Filing(Base):
    __tablename__ = "filings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), index=True)

    year: Mapped[int] = mapped_column(Integer, index=True)
    quarter: Mapped[str] = mapped_column(String(2))  # Q1..Q4
    amount: Mapped[float] = mapped_column(Numeric(14, 2))
    source: Mapped[str] = mapped_column(String(200), default="unknown")

    issue_links = relationship(
        "FilingIssue",
        back_populates="filing",
        cascade="all, delete-orphan",
    )