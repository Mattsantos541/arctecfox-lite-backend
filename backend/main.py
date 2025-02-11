from fastapi import FastAPI, HTTPException
from database import get_assets  # Ensure this is correct
from fastapi.middleware.cors import CORSMiddleware


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
    allow_origins=["*"],  # You can specify your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
