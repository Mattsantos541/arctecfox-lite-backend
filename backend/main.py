import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth_routes  # ✅ Ensure correct import
from backend.api.generate_pm_plan import router as pm_router  # ✅ Corrected import
from backend.database import get_assets  # ✅ Ensure correct import

# ✅ Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

# ✅ Log API Startup Event
logger.info("🚀 FastAPI Server is Starting...")

# ✅ Configure CORS (Allow Frontend Requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ✅ Allow frontend (Update in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("✅ CORS Middleware Configured")

# ✅ Register API Routes
app.include_router(auth_routes.router, prefix="/auth")  # ✅ Authentication
app.include_router(pm_router, prefix="/api")  # ✅ PM Planner API (ensure "/api" prefix)

logger.info("✅ API Routes Registered")

# ✅ Middleware to Log Incoming Requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"📩 Incoming Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"📤 Response: {response.status_code}")
    return response

# ✅ Health Check Route
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
