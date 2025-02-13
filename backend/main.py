from fastapi import FastAPI, HTTPException
from database import get_assets  # Ensure this is correct
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
    "https://8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev",
    "https://8e765ae3-27d1-4c38-8a73-eaf9fff7b365-00-2nscoe9m1740v.spock.replit.dev:8000"
]

app = FastAPI()

@app.get("/")
async def home():
    return {"message": "AF-PM Planner Backend Running with FastAPI!"}

@app.get("/assets")
async def assets():
    """API route to fetch assets from Supabase"""
    try:
        data = get_assets()
        if not data:
            raise HTTPException(status_code=404, detail="No assets found")
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
