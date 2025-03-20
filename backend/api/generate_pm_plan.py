import logging
from fastapi import APIRouter, HTTPException
import openai
import json
from dotenv import load_dotenv
import os

# ✅ Load environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise RuntimeError("🚨 ERROR: OPENAI_API_KEY is missing! Check .env file.")

openai.api_key = api_key

# ✅ Set up FastAPI router
router = APIRouter()

# ✅ Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.post("/generate_pm_plan")
async def generate_pm_plan(asset: dict):
    try:
        logger.info("📩 Received API request with asset data: %s", asset)

        if not openai.api_key:
            logger.error("🚨 OpenAI API Key is missing!")
            raise HTTPException(status_code=500, detail="OpenAI API key is missing!")

        # ✅ Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": f"Create a PM plan for {asset['name']}"}]
        )

        logger.info("✅ OpenAI API responded successfully.")

        pm_plan_text = response["choices"][0]["message"]["content"].strip()
        logger.debug("📄 OpenAI Response: %s", pm_plan_text)

        try:
            pm_plan = json.loads(pm_plan_text)
        except json.JSONDecodeError:
            logger.error("🚨 OpenAI returned invalid JSON!")
            raise HTTPException(status_code=500, detail="Invalid JSON response from OpenAI.")

        # ✅ Ensure response structure is correct
        if not isinstance(pm_plan, dict) or "maintenance_plan" not in pm_plan:
            logger.error("🚨 API returned incorrect format!")
            raise HTTPException(status_code=500, detail="Invalid API response structure.")

        return {"success": True, "data": pm_plan}

    except openai.error.OpenAIError as oe:
        logger.error("🚨 OpenAI API Error: %s", str(oe))
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(oe)}")

    except Exception as e:
        logger.error("❌ Internal Server Error: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
