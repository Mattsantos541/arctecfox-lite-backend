@router.post("/complete-profile")
async def complete_profile(
    user_id: str, 
    email: str, 
    full_name: str, 
    role: str, 
    company_id: str, 
    industry: str, 
    company_size: str, 
    company_name: str, 
    address: str
):
    supabase = get_supabase_client()

    # Check if all fields are provided
    missing_fields = [
        field for field, value in locals().items() if not value
    ]
    if missing_fields:
        raise HTTPException(status_code=400, detail=f"Please complete all fields: {', '.join(missing_fields)}")

    # Verify user exists in `auth.users`
    user_query = supabase.auth.admin.list_users()
    user_data = next((user for user in user_query["data"]["users"] if user["email"] == email), None)

    if not user_data:
        raise HTTPException(status_code=400, detail="User not found in authentication system.")

    # Ensure correct user ID
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
        "company_name": company_name,
        "address": address  # Now includes address
    }).execute()

    if profile_update.get("error"):
        raise HTTPException(status_code=400, detail="Error updating profile.")

    return {"message": "Profile updated successfully. Redirecting to dashboard."}

@router.get("/api/user-session")
async def get_user_session(token: str = Depends(oauth2_scheme)):
    supabase = get_supabase_client()

    try:
        # Validate and decode the token
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = decoded_token.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token.")

        # Fetch user details
        user_info = supabase.table("users").select("*").eq("id", user_id).execute()
        if not user_info.get("data"):
            raise HTTPException(status_code=404, detail="User not found.")

        return {"user": user_info["data"][0]}

    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired session.") from e

