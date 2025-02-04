import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get Supabase credentials from .env
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")  # Use the service key for backend operations

# Initialize Supabase client (backend should use the service key, NOT the anon key)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Function to fetch all assets from the "assets" table
def get_assets():
    response = supabase.table("assets").select("*").execute()
    return response.data
