import time

from data_pipeline.scripts.sources.lda_api import fetch_quarterly_reports
from data_pipeline.scripts.transform.normalize_lda import normalize_filings
from data_pipeline.scripts.load.upsert import load_records

FILING_YEAR = 2024
MAX_PAGES = 40


def main():
    print(f"Fetching LDA data for {FILING_YEAR}...")

    all_records = []

    for page in range(1, MAX_PAGES + 1):
        payload = fetch_quarterly_reports(page=page, filing_year=FILING_YEAR)
        raw_results = payload.get("results", [])

        if not raw_results:
            print(f"Page {page}: no results, stopping")
            break

        records = normalize_filings(payload)
        print(f"Page {page}: kept {len(records)} records")
        all_records.extend(records)

        time.sleep(1.5)

    deduped = []
    seen = set()

    for r in all_records:
        key = (r["company"], r["year"], r["quarter"], r["amount"])
        if key not in seen:
            seen.add(key)
            deduped.append(r)

    print(f"Total normalized records: {len(deduped)}")

    loaded = load_records(deduped, source_name="lda_api")
    print(f"Loaded {loaded} filing rows.")


if __name__ == "__main__":
    main()