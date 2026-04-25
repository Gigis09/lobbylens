from sqlalchemy import text
from app.core.db import SessionLocal

class AggregationService:
 @staticmethod
def filter_companies(industry=None, year=None, min_spend=None,page=1, limit=10, sort_by="total_spend", order="desc"):

db = SessionLocal()

offset = (page - 1) * limit
allowed_sort_fields = ["total_spend", "name"]
 if sort_by not in allowed_sort_fields:
    sort_by = "total_spend"

  if order.lower() not in ["asc", "desc"]:
     order = "desc"

query = text(f"""
SELECT c.name, SUM(f.amount) as total_spend
FROM companies c
JOIN filings f ON c.id = f.company_id
WHERE 1=1
AND (:industry IS NULL OR c.industry = :industry)
AND (:year IS NULL OR f.year = :year)
GROUP BY c.name
HAVING (:min_spend IS NULL OR SUM(f.amount) >= :min_spend)
ORDER BY {sort_by} {order}
LIMIT :limit OFFSET :offset; """)

result = db.execute(query, { 
        "industry": industry,
        "year": year,
        "min_spend": min_spend,
        "limit": limit,
        "offset": offset
    })
rows = [dict(row) for row in result.fetchall()]

    return {
         "success": True,
         "data": rows,
         "count": len(rows),
         "page": page
    }
