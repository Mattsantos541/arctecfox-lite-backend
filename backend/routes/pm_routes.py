import os
import json
from datetime import datetime, date
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI  # new client

router = APIRouter()
# Initialize the OpenAI v1.x client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class AssetData(BaseModel):
    name: str
    model: str
    serial: str
    category: str
    hours: int
    cycles: int
    environment: str
    date_of_plan_start: Optional[date] = None
    email: Optional[str] = None
    company: Optional[str] = None

def clean_json(raw_text: str) -> str:
    if raw_text.startswith("```") and raw_text.endswith("```"):
        raw_text = raw_text.strip("`").strip()
    return raw_text

@router.post("/generate_pm_plan")
def generate_pm_plan(data: AssetData):
    print("📥 New PM Plan Request")
    print("Asset Data:", data.dict())

    # Write a log entry
    try:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "input": data.dict()
        }
        with open("pm_lite_logs.txt", "a") as f:
            f.write(json.dumps(log_entry) + "\n")
    except Exception as e:
        print("⚠️ Failed to write to log file:", e)

    plan_start = data.date_of_plan_start.isoformat() if data.date_of_plan_start else datetime.utcnow().date().isoformat()

    prompt = f"""
Generate a detailed preventive maintenance (PM) plan for the following asset:

- Asset Name: {data.name}
- Model: {data.model}
- Serial Number: {data.serial}
- Asset Category: {data.category}
- Usage Hours: {data.hours} hours
- Usage Cycles: {data.cycles} cycles
- Environmental Conditions: {data.environment}
- Date of Plan Start: {plan_start}

Use the manufacturer's user manual to determine recommended maintenance tasks and intervals. If the manual is not available, infer recommendations from best practices for similar assets in the same category.

For each PM task:
1. Clearly describe the task.
2. Provide step-by-step instructions.
3. Include safety precautions.
4. Note any relevant government regulations or compliance checks.
5. Highlight common failure points this task is designed to prevent.
6. Tailor instructions based on usage data and environmental conditions.
7. Include an "engineering_rationale" field explaining why this task and interval were selected.
8. Based on the plan start date, return a list of future dates when this task should be performed over the next 12 months.

**IMPORTANT:** Return only a valid JSON object with no markdown or explanation. The JSON must have a key "maintenance_plan" whose value is an array of objects. Each object must include:

- "task_name" (string)
- "maintenance_interval" (string, e.g., "Every 30 days")
- "instructions" (array of strings)
- "reason" (string)
- "engineering_rationale" (string)
- "safety_precautions" (string)
- "common_failures_prevented" (string)
- "scheduled_dates" (array of strings in YYYY-MM-DD format)

Do not include anything else in the response.
"""

    try:
        # Call the new v1.x client
        ai_resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert in preventive maintenance planning."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )

        # Extract the content
        response_text = ai_resp.choices[0].message.content
        print("OpenAI raw response:", response_text)

        clean_response = clean_json(response_text)
        try:
            parsed = json.loads(clean_response)
            maintenance_plan = parsed.get("maintenance_plan", [])
        except Exception as parse_error:
            print("⚠️ JSON parse error:", parse_error)
            maintenance_plan = []

        return {"data": {"maintenance_plan": maintenance_plan}}

    except Exception as e:
        print("⚠️ Failed to generate maintenance plan:", e)
        return {"status": "error", "message": str(e)}
