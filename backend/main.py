from fastapi import FastAPI
from database import get_assets

app = FastAPI()

@app.get("/")
async def home():
    return {"message": "AF-PM Planner Backend Running with FastAPI!"}

# New route: Fetch assets from Supabase
@app.get("/assets")
async def assets():
    return get_assets()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
