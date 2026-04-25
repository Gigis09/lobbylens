from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[3]  # .../backend/app/core -> repo root
ENV_FILE = REPO_ROOT / ".env"

class Settings(BaseSettings):
    database_url: str

    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        extra="ignore",
    )

settings = Settings()