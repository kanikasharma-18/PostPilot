from fastapi import FastAPI

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
