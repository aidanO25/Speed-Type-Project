# server/routes/profileData.py
from fastapi import APIRouter, Depends
from sqlalchemy import text
from db import ENGINE
from dependencies import get_current_user

router = APIRouter(prefix = "/profileData", tags = ["Profile"])

#TO TEST THE ROUTE
@router.get("/")
def test_profile_data():
    return {"message": "profile data log is working"}


# GETS USER'S STATISTICS TO DISPLAY ON THE PROFILE PAGE 
@router.post("/profileData")
def get_profile_data(user: dict = Depends(get_current_user)):
    with ENGINE.connect() as conn:

        result = conn.execute(
            text("""
                 SELECT
                    username,
                    avg_wpm,
                    best_wpm,
                    total_attempts
                 FROM users
                 WHERE id = :user_id
            """),
            {"user_id" :user["id"]}
        ).fetchone()

        if result is None:
            return {"error": "User not found"}
    
        return dict(result._mapping) # using _mapping as it was failing probably due to returned format
                     
    

