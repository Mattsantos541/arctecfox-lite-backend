import os
import openai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load API Key from .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

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
    # OpenAI Prompt for Structured Preventive Maintenance Plan
    hidden_prompt = f"""
    Create a detailed preventive maintenance plan for the {asset.name} ({asset.model}).

    - **Category**: {asset.category}
    - **Serial Number**: {asset.serial}
    - **Usage**: {asset.hours} hours/year, {asset.cycles} cycles/year
    - **Operating Environment**: {asset.environment}

    **Instructions:**
    - Provide a **structured table format** listing maintenance tasks.
    - Each row should have:
        1. **Task Name**
        2. **Maintenance Interval (Daily, Weekly, Monthly, Quarterly, Annual)**
        3. **Step-by-step instructions**
        4. **Reason for the task**
    - Output in a structured JSON format.
    """

    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": hidden_prompt}]
        )

        # Extract AI-generated text
        pm_plan_text = response["choices"][0]["message"]["content"]

        # Simulated structured PM Plan (To be replaced with dynamic parsing from AI)
        tasks = [
            {"interval": "Monthly", "task": "Inspect the cutting system", "steps": "Thoroughly inspect the cutting system, focusing on blade wear, and sharpen or replace blades as necessary.", "reason": "Dull or damaged blades reduce cutting accuracy and increase strain on the machine."},
            {"interval": "Monthly", "task": "Verify the control panel and sensors", "steps": "Test the control panel's responsiveness and calibrate any sensors if necessary.", "reason": "Ensures the machine operates within its specifications and improves cut quality."},
            {"interval": "Quarterly", "task": "Perform full machine calibration", "steps": "Recalibrate all systems to ensure that measurements and movements are accurate.", "reason": "Accurate calibration improves cutting precision and reduces errors."},
            {"interval": "Quarterly", "task": "Inspect hydraulic system", "steps": "Check the hydraulic fluid levels and inspect hoses, cylinders, and pumps for any signs of leaks or damage.", "reason": "Proper hydraulic function is critical for the machine's pressure and cutting capabilities."},
        ]

        return {"pm_plan": tasks, "ai_explanation": pm_plan_text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
