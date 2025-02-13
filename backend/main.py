
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_assets

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def home():
    return {"message": "AF-PM Planner Backend Running!"}

@app.get("/assets")
async def assets():
    try:
        data = get_assets()
        print("🔹 Fetched assets:", data)
        if not data:
            return []
        return data
    except Exception as e:
        print("❌ Error in /assets:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting server on http://0.0.0.0:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
