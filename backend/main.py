import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes
from api.generate_pm_plan import router as pm_router
from database import get_assets

# ✅ Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()

# ✅ Log API Startup Event
logger.info("🚀 FastAPI Server is Starting...")

# ✅ Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 🔥 Change this to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info("✅ CORS Middleware Configured")

# ✅ Register API Routes
app.include_router(auth_routes.router)
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

# ✅ Metrics Route - Logging Asset Metrics
@app.get("/metrics")
async def get_metrics():
    try:
        logger.info("📊 Calculating asset metrics...")
        assets = get_assets()
        total_assets = len(assets)

        locations = set()
        for asset in assets:
            if "location" in asset and asset["location"]:
                locations.add(asset["location"])

        logger.info(f"📊 Metrics Computed: Total Assets = {total_assets}, Locations = {len(locations)}")
        return {
            "totalAssets": total_assets,
            "activePMPlans": 5,  # Placeholder (Replace with actual logic)
            "nextPMTask": "2024-06-15",
            "locations": list(locations)
        }
    except Exception as e:
        logger.error(f"❌ Error Fetching Metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve metrics")

# ✅ Server Startup
if __name__ == "__main__":
    logger.info("🚀 Starting Uvicorn Server on Port 8000")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

