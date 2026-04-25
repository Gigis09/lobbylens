from decimal import Decimal
from data_pipeline.scripts.load.db import get_conn


def upsert_company(cur, name: str) -> int:
    cur.execute(
        """
        INSERT INTO companies (name)
        VALUES (%s)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id;
        """,
        (name.strip(),),
    )
    return cur.fetchone()[0]


def upsert_issue(cur, name: str) -> int:
    cur.execute(
        """
        INSERT INTO issues (name)
        VALUES (%s)
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id;
        """,
        (name.strip(),),
    )
    return cur.fetchone()[0]


def insert_filing(cur, company_id: int, year: int, quarter: str, amount, source: str) -> int:
    cur.execute(
        """
        INSERT INTO filings (company_id, year, quarter, amount, source)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
        """,
        (
            company_id,
            int(year),
            str(quarter),
            Decimal(str(amount)),
            str(source),
        ),
    )
    return cur.fetchone()[0]


def link_filing_issue(cur, filing_id: int, issue_id: int):
    cur.execute(
        """
        INSERT INTO filing_issues (filing_id, issue_id)
        VALUES (%s, %s)
        ON CONFLICT DO NOTHING;
        """,
        (filing_id, issue_id),
    )


def load_records(records, source_name: str) -> int:
    count = 0

    with get_conn() as conn:
        with conn.cursor() as cur:
            for record in records:
                company_id = upsert_company(cur, record["company"])

                filing_id = insert_filing(
                    cur,
                    company_id=company_id,
                    year=record["year"],
                    quarter=record["quarter"],
                    amount=record["amount"],
                    source=source_name,
                )

                for issue in record.get("issues", []):
                    issue_id = upsert_issue(cur, issue["name"])
                    link_filing_issue(cur, filing_id, issue_id)

                count += 1

        conn.commit()

    return count