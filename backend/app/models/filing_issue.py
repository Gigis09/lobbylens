from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class FilingIssue(Base):
    __tablename__ = "filing_issues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    filing_id: Mapped[int] = mapped_column(
        ForeignKey("filings.id", ondelete="CASCADE"),
        nullable=False,
    )
    issue_id: Mapped[int] = mapped_column(
        ForeignKey("issues.id", ondelete="CASCADE"),
        nullable=False,
    )

    filing = relationship("Filing", back_populates="issue_links")
    issue = relationship("Issue", back_populates="filing_links")