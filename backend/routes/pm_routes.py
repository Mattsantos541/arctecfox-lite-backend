import os
import json
import openai
from datetime import datetime
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

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

def clean_json(raw_text: str) -> str:
    """Strip markdown formatting from the raw text if present."""
    # Remove triple backticks if they exist
    if raw_text.startswith("```") and raw_text.endswith("```"):
        raw_text = raw_text.strip("`").strip()
    return raw_text

@router.post("/generate_pm_plan")
def generate_pm_plan(data: AssetData):
    # Log the incoming request
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

    # Build the detailed prompt including strict JSON output instructions.
    prompt = f"""Generate a detailed preventive maintenance (PM) plan for the following asset:

- **Asset Name**: {data.name}
- **Model**: {data.model}
- **Serial Number**: {data.serial}
- **Asset Category**: {data.category}
- **Usage Hours**: {data.hours} hours
- **Usage Cycles**: {data.cycles} cycles
- **Environmental Conditions**: {data.environment}

Use the manufacturer's user manual to determine recommended maintenance tasks and intervals. If the manual is not available, infer from similar equipment in the same category.

For each PM task, do the following:
1. Clearly describe the task.
2. Provide step-by-step instructions.
3. Include safety precautions.
4. Note any relevant government regulations or compliance checks.
5. Highlight common failure points this task prevents.
6. Tailor instructions based on the provided usage and environmental conditions.

**IMPORTANT:** Return only a valid JSON object without any markdown formatting or extra text. The JSON must have a key "maintenance_plan" whose value is an array of objects. Each object must include the following keys:
- "task_name" (string)
- "maintenance_interval" (string)
- "instructions" (array of strings)
- "reason" (string)
- "safety_precautions" (string)
Do not include any other keys or commentary.
"""

    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        ai_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert in preventive maintenance planning."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )

        response_text = ai_response['choices'][0]['message']['content']
        print("OpenAI raw response:", response_text)

        # Clean and attempt to parse the raw response
        clean_response = clean_json(response_text)
        try:
            parsed_json = json.loads(clean_response)
            maintenance_plan = parsed_json.get("maintenance_plan", [])
        except Exception as parse_error:
            print("⚠️ JSON parse error:", parse_error)
            maintenance_plan = []  # fallback

        return {"data": {"maintenance_plan": maintenance_plan}}
    except Exception as e:
        print("⚠️ Failed to generate maintenance plan:", e)
        return {"status": "error", "message": str(e)}
