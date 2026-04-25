from data_pipeline.scripts.transform.issue_codes import ISSUE_CODE_MAP


def extract_issue_codes(item: dict) -> list[str]:
    possible_fields = [
        "issues",
        "issue_areas",
        "lobbying_activities",
        "lobbying_issues",
    ]

    codes = []

    for field in possible_fields:
        value = item.get(field)

        if isinstance(value, list):
            for entry in value:
                if isinstance(entry, dict):
                    code = (
                        entry.get("code")
                        or entry.get("issue_code")
                        or entry.get("general_issue_code")
                        or entry.get("name")
                    )
                    if code:
                        codes.append(str(code).strip().upper())
                elif isinstance(entry, str):
                    codes.append(entry.strip().upper())

        elif isinstance(value, dict):
            code = (
                value.get("code")
                or value.get("issue_code")
                or value.get("general_issue_code")
                or value.get("name")
            )
            if code:
                codes.append(str(code).strip().upper())

    cleaned = []
    for code in codes:
        if code in ISSUE_CODE_MAP:
            cleaned.append(code)

    return list(dict.fromkeys(cleaned))


def normalize_filings(api_payload: dict) -> list[dict]:
    results = api_payload.get("results", [])
    normalized = []

    quarter_map = {
        "first_quarter": "Q1",
        "second_quarter": "Q2",
        "third_quarter": "Q3",
        "fourth_quarter": "Q4",
        "q1": "Q1",
        "q2": "Q2",
        "q3": "Q3",
        "q4": "Q4",
    }

    for item in results:
        client = item.get("client") or {}
        registrant = item.get("registrant") or {}

        company_name = (
            client.get("name")
            or registrant.get("name")
            or "Unknown"
        )

        year = item.get("filing_year")
        if not year:
            continue

        filing_period = str(item.get("filing_period", "")).lower()
        quarter = quarter_map.get(filing_period, "Q1")

        amount = item.get("income")
        if amount in (None, "", 0):
            amount = item.get("expenses")

        if amount in (None, ""):
            amount = 0

        issue_codes = extract_issue_codes(item)

        if not issue_codes:
            issue_codes = ["GOV"]

        normalized.append(
            {
                "company": company_name,
                "year": int(year),
                "quarter": quarter,
                "amount": amount,
                "issues": [
                    {
                        "code": code,
                        "name": ISSUE_CODE_MAP.get(code, code),
                    }
                    for code in issue_codes
                ],
            }
        )

    return normalized