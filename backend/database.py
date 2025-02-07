import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Debug: Print environment variables (DO NOT DO THIS IN PRODUCTION)
print(f"🔹 SUPABASE_URL: {SUPABASE_URL}")
print(f"🔹 SUPABASE_SERVICE_KEY: {SUPABASE_SERVICE_KEY[:5]}...[HIDDEN]")  # Hide most of the key for security

# Ensure credentials exist
if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise ValueError("❌ Supabase credentials are missing. Check your .env file.")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_assets():
    """Fetch all assets from Supabase and print response for debugging."""
    response = supabase.table("assets").select("*").execute()

    # Debugging: Print full API response
    print("🔹 Supabase API Response:", response)

    if hasattr(response, "data"):
        return response.data  # Correctly return asset data

    return []  # Return an empty list if no data is found
