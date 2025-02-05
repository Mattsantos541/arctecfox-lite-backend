import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Supabase URL and API Key
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Validate if the keys are loading correctly
if not SUPABASE_SERVICE_KEY:
    raise ValueError("SUPABASE_SERVICE_KEY is missing. Check your .env file.")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_assets():
    """Fetch all assets from Supabase."""
    response = supabase.table("assets").select("*").execute()

    if response.error:
        print(f"Error fetching assets: {response.error}")
        return []

    return response.data

