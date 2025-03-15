import os
import openai
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

# Manually load .env variables
env_loaded = load_dotenv()

# Debugging: Print if .env was loaded
if env_loaded:
    print("✅ .env file loaded successfully")
else:
    print("❌ .env file NOT loaded")

# Check if API Key is loaded
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("🚨 ERROR: OPENAI_API_KEY is missing! Check your .env file.")

openai.api_key = api_key
print("✅ OpenAI API Key Loaded Successfully")

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
            model="gpt-3.5-turbo",
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
