from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from backend.database import get_supabase_client
from datetime import datetime, timedelta
import jwt

# Secret key for JWT authentication (update for production)
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Generate JWT token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# User Registration (Registers in `auth.users`)
@router.post("/register")
async def register(email: str, password: str):
    supabase = get_supabase_client()

    # Register user in Supabase Auth
    auth_response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })

    if auth_response.get("error"):
        raise HTTPException(status_code=400, detail="Error registering user")

    user_id = auth_response.get("data", {}).get("user", {}).get("id")

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID not returned from Supabase")

    return {"message": "User registered successfully. Please confirm your email before signing in."}

# User Login (Checks if email is confirmed before allowing access)
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    supabase = get_supabase_client()

    # Authenticate user
    auth_response = supabase.auth.sign_in_with_password({
        "email": form_data.username,
        "password": form_data.password
    })

    if auth_response.get("error"):
        raise HTTPException(status_code=400, detail="Invalid credentials or email not confirmed.")

    user_id = auth_response.get("data", {}).get("user", {}).get("id")

    # Check if user profile is completed in public.users
    user_info = supabase.table("users").select("*").eq("id", user_id).execute()

    if not user_info.get("data"):
        return {"message": "Profile incomplete. Please complete your profile."}

    token = create_access_token(data={"sub": form_data.username})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_info["data"][0]
    }

# Complete User Profile (After First Login)
@router.post("/complete-profile")
async def complete_profile(
    email: str, full_name: str, role: str, company_id: str, 
    industry: str, company_size: str, company_name: str
):
    supabase = get_supabase_client()

    # Verify user exists in `auth.users`
    user_query = supabase.auth.admin.list_users()
    user_data = next((user for user in user_query["data"]["users"] if user["email"] == email), None)

    if not user_data:
        raise HTTPException(status_code=400, detail="User not found.")

    user_id = user_data["id"]

    # Update or Insert into `public.users`
    profile_update = supabase.table("users").upsert({
        "id": user_id,
        "email": email,
        "full_name": full_name,
        "role": role,
        "company_id": company_id,
        "industry": industry,
        "company_size": company_size,
        "company_name": company_name
    }).execute()

    if profile_update.get("error"):
        raise HTTPException(status_code=400, detail="Error updating profile.")

    return {"message": "Profile updated successfully. Redirecting to dashboard."}
