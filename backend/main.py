from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth_routes
from backend.database import get_supabase_client, get_assets  # ✅ Ensure correct import
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth_routes.router)

@app.get("/")
async def home():
    return {"message": "Backend running"}

@app.get("/assets")
async def get_all_assets():
    try:
        logger.info("Fetching assets from Supabase...")
        data = get_assets()
        logger.info(f"Retrieved assets: {data}")
        return data or []
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/metrics")
async def get_metrics():
    try:
        assets = get_assets()
        total_assets = len(assets)

        locations = set()
        for asset in assets:
            if "location" in asset and asset["location"]:
                locations.add(asset["location"])

        return {
            "totalAssets": total_assets,
            "activePMPlans": 5,  # Placeholder (Replace with actual logic)
            "nextPMTask": "2024-06-15",
            "locations": list(locations)
        }
    except Exception as e:
        logger.error(f"Error fetching metrics: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve metrics")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
