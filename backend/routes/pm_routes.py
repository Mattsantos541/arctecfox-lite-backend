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

    # Construct the prompt for OpenAI using the asset details.
    prompt = f"""Generate a detailed preventive maintenance (PM) plan for the following asset:

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

The plan should be easy for a technician to follow, with helpful notes and context when needed."""

    try:
        # Set your OpenAI API key from the environment (make sure it's set in your Replit secrets)
        openai.api_key = os.getenv("OPENAI_API_KEY")

        # Call OpenAI's ChatCompletion API with the prompt.
        ai_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert in preventive maintenance planning."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500  # Adjust the token size as required
        )

        # Extract the generated maintenance plan text.
        maintenance_plan_text = ai_response['choices'][0]['message']['content']

        # Return the response in a JSON format that the frontend expects.
        return {"data": {"maintenance_plan": maintenance_plan_text}}
    except Exception as e:
        print("⚠️ Failed to generate maintenance plan:", e)
        return {"status": "error", "message": str(e)}
