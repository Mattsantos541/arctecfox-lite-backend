
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json
import openai
import os

router = APIRouter()

# Make sure to set your OpenAI API key in your environment
openai.api_key = os.getenv("OPENAI_API_KEY")

class AssetData(BaseModel):
    name: str
    model: str
    serial: str
    category: str
    hours: int
    cycles: int
    environment: str
    email: Optional[str] = None
    company: Optional[str] = None

def build_prompt(data: AssetData) -> str:
    return f"""
Generate a detailed preventive maintenance (PM) plan for the following asset:

- **Asset Name**: {data.name}
- **Model**: {data.model}
- **Serial Number**: {data.serial}
- **Asset Category**: {data.category}
- **Usage Hours**: {data.hours} hours
- **Usage Cycles**: {data.cycles} cycles
- **Environmental Conditions**: {data.environment}

Use the manufacturer's user manual to determine recommended maintenance tasks and intervals. If the manual is not available, infer from similar equipment in the same category.

For each PM task:
1. Clearly describe the task.
2. Provide step-by-step instructions.
3. Include safety precautions.
4. Note any relevant government regulations or compliance checks.
5. Highlight common failure points this task prevents.
6. Tailor instructions based on the provided usage and environmental conditions.

The plan should be easy for a technician to follow, with helpful notes and context when needed.
"""

@router.post("/")
def generate_pm_plan(data: AssetData):
    print("📥 New PM Plan Request")
    print("Asset Data:", data.dict())

    try:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "input": data.dict()
        }
        with open("pm_lite_logs.txt", "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        print("⚠️ Failed to write to log file:", e)

    # 🔥 Call OpenAI
    try:
        prompt = build_prompt(data)
        print("🧠 Sending prompt to OpenAI")

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert industrial maintenance planner."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1200
        )

        # Safely access the response content
        if response and isinstance(response, dict):
            choices = response.get('choices', [])
            if choices and len(choices) > 0:
                message = choices[0].get('message', {})
                pm_plan_text = message.get('content', '')
                if pm_plan_text:
                    return {
                        "status": "success",
                        "data": {
                            "maintenance_plan_text": pm_plan_text
                        }
                    }
        
        raise ValueError("Invalid response format from OpenAI API")

    except Exception as e:
        print("❌ OpenAI API error:", e)
        return {
            "status": "error",
            "message": str(e)
        }
