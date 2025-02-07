import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Supabase URL and API Key
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Validate if the keys are loading correctly
if not SUPABASE_SERVICE_KEY or not SUPABASE_URL:
    raise ValueError("Supabase credentials are missing. Check your .env file.")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_assets():
    """Fetch all assets from Supabase and print the response for debugging."""
    response = supabase.table("assets").select("*").execute()

    print("Supabase Response:", response)


    if isinstance(response, dict) and "error" in response:
        print(f"Error fetching assets: {response['error']}")
        return []

    return response.get("data", [])  # Ensure it correctly returns asset data

