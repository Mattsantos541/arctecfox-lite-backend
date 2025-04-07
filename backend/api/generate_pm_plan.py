from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json

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

    mock_plan = [
        {
            "task_name": "Inspect bearings",
            "maintenance_interval": "Every 3 months",
            "instructions": ["Check for wear", "Lubricate bearings"],
            "reason": "Prevent mechanical failure due to friction",
            "safety_precautions": "Lockout/tagout before inspection"
        },
        {
            "task_name": "Replace air filter",
            "maintenance_interval": "Every 6 months",
            "instructions": ["Turn off equipment", "Replace filter cartridge"],
            "reason": "Ensure clean airflow and optimal performance",
            "safety_precautions": "Wear mask and gloves"
        }
    ]
