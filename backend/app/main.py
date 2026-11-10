from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

app = FastAPI(
    title="PostPilot API",
    description="Backend API for PostPilot",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to PostPilot API!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


@app.get("/health/database")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "status": "healthy"
        }

    except Exception:
        return {
            "database": "disconnected",
            "status": "unhealthy"
        }
