from sqlalchemy import text
from app.core.db import SessionLocal

class ComparisonService:

    @staticmethod
    def compare_companies(companyA, companyB):
        db = SessionLocal()

        query = text("""
            SELECT c.id, c.name, SUM(f.amount) as total_spend
            FROM companies c
            JOIN filings f ON c.id = f.company_id
            WHERE c.id IN (:a, :b)
            GROUP BY c.id, c.name
        """)

      rows = [dict(r) for r in db.execute(query, {"a": companyA, "b": companyB})]

        if len(rows) < 2:
            return {"success": False, "error": "Companies not found"}

        a, b = rows

        diff = a["total_spend"] - b["total_spend"]
        percent = (diff / b["total_spend"] * 100) if b["total_spend"] else 0

        return {
            "success": True,
            "labels": [a["name"], b["name"]],
            "data": [a["total_spend"], b["total_spend"]],
            "difference": diff,
            "percent_difference": round(percent, 2)
        }
