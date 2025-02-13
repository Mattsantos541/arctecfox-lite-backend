
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

def get_supabase_client():
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        raise ValueError("Missing Supabase credentials")
        
    return create_client(url, key)

def get_assets():
    try:
        supabase = get_supabase_client()
        response = supabase.table('assets').select("*").execute()
        print("🔹 Supabase response:", response)
        return response.data if response else []
    except Exception as e:
        print("❌ Database error:", str(e))
        return []
