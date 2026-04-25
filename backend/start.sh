#!/bin/bash 
echo "Running database migrations..."
cd /app/backend
alembic upgrade head
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port $PORT
