# server/routes/attemptLog.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text #for sql queries
from db import ENGINE # connection to the MySQL database
from pydantic import BaseModel # used to define and validate the structure of request bodies
from dependencies import get_current_user
from typing import Optional


router = APIRouter(prefix = "/attemptLog", tags = ["Attempts"])

#TO TEST THE ROUTE
@router.get("/")
def testAttemptLogRoute():
    return {"message": "attempt log route working"}


# INPUT VALIDATION + SECURITY
class AttemptInput(BaseModel):
    snippet_id: Optional[int] = None  # will change in future
    wpm: float
    accuracy: float 
    duration_seconds: float
    correct_characters: int
    incorrect_characters: int 


# POST ROUTE
@router.post("")
def logAttempt(
    data: AttemptInput,
    user_data: dict = Depends(get_current_user)
):
    try:
        user_id = user_data["id"]

        with ENGINE.connect() as conn:

            # INSERT THE USER'S LAST ATTEMPT INTO THE ATTEMPTS LOG
            inster_query = text("""
                INSERT INTO userAttempts (
                    user_id,
                    snippet_id,
                    wpm,
                    accuracy,
                    duration_seconds,
                    correct_characters,
                    incorrect_characters
                ) VALUES (
                    :user_id,
                    :snippet_id,
                    :wpm,
                    :accuracy,
                    :duration_seconds,
                    :correct_characters,
                    :incorrect_characters
                )
            """)
            
            conn.execute(inster_query, {
                "user_id": user_id,
                "snippet_id": data.snippet_id,
                "wpm": data.wpm,
                "accuracy": data.accuracy,
                "duration_seconds": data.duration_seconds,
                "correct_characters": data.correct_characters,
                "incorrect_characters": data.incorrect_characters,
            })


            # UPDATING THE USER'S PROFILE WITH THE PREVIOUSE ATTEMPT STATS
            conn.execute(text("""
                UPDATE users
                SET
                    total_attempts = COALESCE(total_attempts, 0) + 1,
                    avg_wpm = (
                        SELECT AVG(wpm)
                        FROM userAttempts
                        WHERE user_id = :user_id
                    ),
                    best_wpm = GREATEST(
                        COALESCE(best_wpm, 0),
                        :current_wpm
                    )
                WHERE id = :user_id
            """), {
                "user_id": user_id,
                "current_wpm": data.wpm
            })

            conn.commit()

        return {"message": "Attempt logged successfully"}
    
    except Exception as e:
        raise HTTPException(status_code = 500, detail = f"Error logging attempt: {e}")