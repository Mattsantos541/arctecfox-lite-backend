import os
import json
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import openai

# ✅ Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

# ✅ Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# ✅ Validate API key
if not api_key:
    raise RuntimeError("🚨 ERROR: OPENAI_API_KEY is missing! Please check your .env file.")

# ✅ Set the API key for OpenAI
openai.api_key = api_key

# ✅ Define FastAPI Router
router = APIRouter()

# ✅ Define Asset Data Model
class AssetData(BaseModel):
    name: str
    model: str
    serial: str
    category: str
    hours: int
    cycles: int
    environment: str

@router.post("/generate_pm_plan")
async def generate_pm_plan(asset: AssetData):
    """
    Generates a Preventive Maintenance (PM) plan using OpenAI based on asset details.
    """
    try:
        # ✅ Log received asset data
        logger.info(f"📩 Received API request with asset data: {asset.dict()}")

        # ✅ Format asset details safely
        asset_data = {
            "name": asset.name,
            "model": asset.model,
            "serial": asset.serial,
            "category": asset.category,
            "hours": asset.hours,
            "cycles": asset.cycles,
            "environment": asset.environment,
        }

        # ✅ Construct prompt for OpenAI
        prompt = f"""
        Create a detailed preventive maintenance plan for the following asset:

        {json.dumps(asset_data, indent=2)}

        **Instructions:**
        - Provide structured **JSON output** with a list of maintenance tasks.
        - Each task must include:
          1. **Task Name**
          2. **Maintenance Interval** (Daily, Weekly, Monthly, Quarterly, Annual)
          3. **Step-by-step Instructions**
          4. **Reason for the Task**
          5. **Safety Precautions**

        **Output Format (JSON Example):**
        {{
            "maintenance_plan": [
                {{
                    "task_name": "Visual Inspection",
                    "maintenance_interval": "Daily",
                    "instructions": [
                        "Inspect for any leaks or unusual noises",
                        "Check for any visible damage or wear",
                        "Ensure proper alignment and mounting"
                    ],
                    "reason": "To identify potential issues early and prevent breakdowns",
                    "safety_precautions": "Ensure the pump is turned off before inspecting"
                }},
                {{
                    "task_name": "Lubrication",
                    "maintenance_interval": "Monthly",
                    "instructions": [
                        "Apply lubricant to all moving parts as per manufacturer’s recommendations"
                    ],
                    "reason": "To reduce friction and wear on moving parts",
                    "safety_precautions": "Wear appropriate PPE when handling lubricants"
                }}
            ]
        }}
        """

        # ✅ Call OpenAI API using the updated syntax
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Change to "gpt-3.5-turbo" if you don't have GPT-4 access
            messages=[{"role": "system", "content": prompt}],
            temperature=0.7
        )

        # ✅ Extract AI-generated text
        pm_plan_text = response.choices[0].message.content.strip()

        # ✅ Validate JSON format
        try:
            pm_plan = json.loads(pm_plan_text)  # Ensure AI response is valid JSON
        except json.JSONDecodeError:
            logger.error("❌ AI response could not be parsed as JSON.")
            raise HTTPException(status_code=500, detail="AI response could not be parsed as JSON.")

        logger.info("✅ Successfully generated PM Plan")
        return {"success": True, "data": pm_plan}

    except openai.OpenAIError as oe:
        logger.error(f"❌ OpenAI API Error: {oe}")
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(oe)}")

    except Exception as e:
        logger.error(f"❌ Internal Server Error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
