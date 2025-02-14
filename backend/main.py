from fastapi import FastAPI, HTTPException
from database import get_assets  # Ensure this is correctly importing from your database module
from fastapi.middleware.cors import CORSMiddleware
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": "AF-PM Planner Backend Running with FastAPI!"}

@app.get("/assets")
async def get_all_assets():
    """Fetch assets from Supabase"""
    try:
        logger.info("Fetching assets from Supabase...")
        data = get_assets()
        logger.info(f"Supabase API Response: {data}")

        if not data:
            logger.warning("No assets found in the database.")
            raise HTTPException(status_code=404, detail="No assets found")
        return data
    except Exception as e:
        logger.error(f"Error fetching assets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000, reload=True)
