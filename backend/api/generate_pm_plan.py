import os
import openai
import json
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
    - Provide a **structured JSON output** listing maintenance tasks.
    - Each row should have:
        1. **Task Name**
        2. **Maintenance Interval (Daily, Weekly, Monthly, Quarterly, Annual)**
        3. **Step-by-step instructions**
        4. **Reason for the task**
    - Output in valid **JSON format**, ready for parsing.

    **Example JSON output:**
    {{
        "pm_plan": [
            {{
                "interval": "Monthly",
                "task": "Inspect the cutting system",
                "steps": "Thoroughly inspect the cutting system, focusing on blade wear, and sharpen or replace blades as necessary.",
                "reason": "Dull or damaged blades reduce cutting accuracy and increase strain on the machine."
            }},
            {{
                "interval": "Quarterly",
                "task": "Calibrate the control panel",
                "steps": "Ensure all controls respond accurately and recalibrate sensors if necessary.",
                "reason": "Prevents inaccuracies and maintains optimal operation."
            }}
        ]
    }}
    """

    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "system", "content": hidden_prompt}],
            temperature=0.7
        )

        # Extract AI-generated text
        pm_plan_text = response["choices"][0]["message"]["content"]

        # Convert AI response to structured JSON
        try:
            pm_plan = json.loads(pm_plan_text)  # Ensure AI output is valid JSON
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI response could not be parsed as JSON.")

        return pm_plan

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
