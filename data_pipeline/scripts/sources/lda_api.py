import time
import requests

BASE_URL = "https://lda.senate.gov/api/v1"


def fetch_quarterly_reports(page=1, filing_year=2024, max_retries=5):
    url = f"{BASE_URL}/filings/"
    params = {
        "page": page,
        "filing_year": filing_year,
    }

    for attempt in range(max_retries):
        response = requests.get(url, params=params, timeout=30)

        if response.status_code == 429:
            wait_time = 2 ** attempt
            print(f"Rate limited on page {page}. Waiting {wait_time}s...")
            time.sleep(wait_time)
            continue

        response.raise_for_status()
        return response.json()

    raise RuntimeError(f"Failed after {max_retries} retries on page {page}")