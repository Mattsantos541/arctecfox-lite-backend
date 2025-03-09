
import os
from dotenv import load_dotenv
from supabase import create_client
import logging

logger = logging.getLogger(__name__)
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
        logger.info(f"Supabase response: {response}")
        return response.data if response else []
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        raise Exception(f"Failed to fetch assets: {str(e)}")
