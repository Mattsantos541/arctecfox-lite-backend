import os
import openai
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# Validate API key
if not api_key:
    raise RuntimeError("🚨 ERROR: OPENAI_API_KEY is missing! Please check your .env file.")

# Set OpenAI API key
openai.api_key = api_key

# Define FastAPI Router (instead of creating another FastAPI app)
router = APIRouter()

class AssetData(BaseModel):
    name: str
    model: str
    serial: str
    category: str
    hours: int
    cycles: int
    environment: str

@router.post("/api/generate_pm_plan")
async def generate_pm_plan(asset: AssetData):
    """
    Generates a Preventive Maintenance (PM) plan using OpenAI based on asset details.
    """
    try:
        # Format asset details safely
        asset_data = {
            "name": asset.name,
            "model": asset.model,
            "serial": asset.serial,
            "category": asset.category,
            "hours": asset.hours,
            "cycles": asset.cycles,
            "environment": asset.environment,
        }

        # Use json.dumps() to prevent formatting issues
        hidden_prompt = f"""
        Create a detailed preventive maintenance plan for the following asset:

        {json.dumps(asset_data, indent=2)}

        **Instructions:**
        - Provide structured **JSON output** with a list of maintenance tasks.
        - Each task must include:
          1. **Task Name**
          2. **Maintenance Interval** (Daily, Weekly, Monthly, Quarterly, Annual)
          3. **Step-by-step Instructions**
          4. **Reason for the Task**

        Output the plan in **valid JSON format**, ready for direct API consumption.
        """

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": hidden_prompt}],
            temperature=0.7
        )

        # Extract AI-generated text
        pm_plan_text = response["choices"][0]["message"]["content"].strip()

        # Validate JSON format
        try:
            pm_plan = json.loads(pm_plan_text)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI response could not be parsed as JSON.")

        return {"success": True, "data": pm_plan}

    except openai.error.OpenAIError as oe:
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(oe)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
