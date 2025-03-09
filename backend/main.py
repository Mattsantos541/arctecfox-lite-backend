
from fastapi import FastAPI, HTTPException
from database import get_assets
from fastapi.middleware.cors import CORSMiddleware
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    assets = get_assets()
    return {
        "totalAssets": len(assets),
        "activePMPlans": 5,  # Placeholder (Replace with actual logic)
        "nextPMTask": "2024-06-15",
        "locations": list(set(asset["location"] for asset in assets if "location" in asset))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
