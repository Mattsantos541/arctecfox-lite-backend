from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai

app = FastAPI()

class AssetData(BaseModel):
    name: str
    model: str
    serial: str
    category: str
    hours: int
    cycles: int
    environment: str

@app.post("/api/generate_pm_plan")
async def generate_pm_plan(asset: AssetData):
    hidden_prompt = f"""
    Create a detailed preventive maintenance plan for the {asset.name}, which is a {asset.category} manufactured by {asset.model}. 
    The asset operates in a {asset.environment} environment and has a usage profile of {asset.hours} hours/year and {asset.cycles} cycles/year.
    Ensure the plan includes step-by-step maintenance tasks, recommended frequency, and AI confidence scores.
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": hidden_prompt}]
        )
        pm_plan = response["choices"][0]["message"]["content"]

        # Dummy data parsing for PM plan table
        tasks = [
            {"task": "Lubricate Parts", "interval": "Weekly", "confidence": 95},
            {"task": "Inspect Tools", "interval": "Monthly", "confidence": 90},
            {"task": "Clean Coolant", "interval": "Quarterly", "confidence": 85},
            {"task": "Full Calibration", "interval": "Annual", "confidence": 80}
        ]

        return {"pm_plan": tasks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
