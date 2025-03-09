import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# Get Supabase client
def get_supabase_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")

    if not url or not key:
        raise ValueError("Missing Supabase credentials")

    return create_client(url, key)

# Fetch user profile from public.users
def get_user_profile(user_id: str):
    supabase = get_supabase_client()
    response = supabase.table("users").select("*").eq("id", user_id).execute()

    if not response.get("data"):
        print(f"❌ User with ID {user_id} not found in public.users")
        return None

    return response.get("data", [])[0]
