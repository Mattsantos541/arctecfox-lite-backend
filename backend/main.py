from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging
from backend.routes import auth_routes
from backend.database import get_assets, add_asset
from fastapi.security import OAuth2PasswordBearer
import uvicorn

# OAuth2 for authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize FastAPI
app = FastAPI()

# Configure CORS (Restrict to frontend domain in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourfrontend.com"],  # Replace with actual frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/")
async def home():
    return {"message": "Backend running"}

# Include authentication routes
app.include_router(auth_routes.router)

# Run the application
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
