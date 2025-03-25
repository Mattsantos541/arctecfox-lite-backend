import logging
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.generate_pm_plan import router as pm_router
from routes.auth_routes import router as auth_router
from database import get_assets
from backend.api.generate_pm_plan import router as pm_router



# ✅ Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

app.include_router(pm_router, prefix="/api")  # ✅ ADD prefix here

# ✅ Log API Startup Event
logger.info("🚀 FastAPI Server is Starting...")

# ✅ Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 Change this to specific frontend URL in productiona
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("✅ CORS Middleware Configured")

# ✅ Register API Routes
app.include_router(auth_router)
app.include_router(pm_router)  # Register PM Planner API
logger.info("✅ API Routes Registered")

# ✅ Middleware to Log Incoming Requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"📩 Incoming Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"📤 Response: {response.status_code}")
    return response

# ✅ Home Route - Health Check
@app.get("/")
async def home():
    logger.info("🏠 Home Route Accessed")
    return {"message": "Backend running"}

# ✅ Fetch Assets Route
@app.get("/assets")
async def get_all_assets():
    try:
        logger.info("🔍 Fetching assets from Supabase...")
        data = get_assets()
        logger.info(f"✅ Retrieved {len(data) if data else 0} assets")
        return data or []
    except Exception as e:
        logger.error(f"❌ Error Fetching Assets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
