from sqlalchemy import text
from app.core.db import SessionLocal
from cachetools import  TTLCache

cache = TTLCache(maxsize=100, ttl=300)

class DashboardService:

    @staticmethod
    def get_summary():
        if "dashboard" in cache:
            return cache ["dashboard"]
            
    db = SessionLocal()

        top_companies = db.execute(text("""
            SELECT c.name, SUM(f.amount) as total_spend
            FROM companies c
            JOIN filings f ON c.id = f.company_id
            GROUP BY c.name
            ORDER BY total_spend DESC
            LIMIT 5
        """)).fetchall()

        issues = db.execute(text("""
            SELECT i.issue_name, SUM(f.amount) as total_spend
            FROM issues i
            JOIN filings f ON i.id = f.issue_id
            GROUP BY i.issue_name
            ORDER BY total_spend DESC
            LIMIT 5
        """)).fetchall()

       result = {
           "success" : True,
           "top_companies": {
               "labels": [c["name"] for c in companies],
               "data": [c["total_spend"] for c in companies]
           },
           "top_issues": {
               "labels": [i["issue_name"] for i in issues],
               "data": [i["total_spend"] for i in issues]
           }
       }
cache["dashboard"] = result
return result

    
