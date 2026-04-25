from pathlib import Path
from dotenv import load_dotenv
import os

def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]

def load_env() -> None:
    load_dotenv(repo_root() / ".env")

def database_url_psycopg() -> str:
    url = os.environ.get("DATABASE_URL", "").strip()
    if not url:
        raise RuntimeError("DATABASE_URL missing in repo-root .env")
    return url.replace("postgresql+psycopg://", "postgresql://")