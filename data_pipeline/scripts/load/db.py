import psycopg
from data_pipeline.scripts.common import load_env, database_url_psycopg

def get_conn():
    load_env()
    return psycopg.connect(database_url_psycopg())