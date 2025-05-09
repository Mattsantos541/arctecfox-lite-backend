import logging
import sys
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.pm_routes import router as pm_router

# Ensure current directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Logging config
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware first!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://lite.arctecfox.ai"],  # <-- your exact frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optionally, other routers:
# from routes.auth_routes import router as auth_router  

# Now include routers
app.include_router(pm_router, prefix="/api")
# app.include_router(auth_router, prefix="/auth")

logger.info("🚀 FastAPI Server is Starting...")

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=9000, reload=True)
