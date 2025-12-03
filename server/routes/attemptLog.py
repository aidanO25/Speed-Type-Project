# server/routes/attemptLog.py
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import text
from db import ENGINE
from pydantic import BaseModel
from dependencies import get_current_user
from typing import Optional

router = APIRouter(prefix="/attemptLog", tags=["Attempts"])

# TO TEST THE ROUTE
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
    difficultyLv: str  # must be "easy", "medium", or "hard"


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
            # NOTE: PostgreSQL lowercases identifiers unless quoted, so the actual column is "difficultylv"
            insert_query = text("""
                INSERT INTO userAttempts (
                    user_id,
                    snippet_id,
                    wpm,
                    accuracy,
                    duration_seconds,
                    correct_characters,
                    incorrect_characters,
                    difficultylv
                ) VALUES (
                    :user_id,
                    :snippet_id,
                    :wpm,
                    :accuracy,
                    :duration_seconds,
                    :correct_characters,
                    :incorrect_characters,
                    :difficultyLv
                )
            """)

            conn.execute(insert_query, {
                "user_id": user_id,
                "snippet_id": data.snippet_id,
                "wpm": data.wpm,
                "accuracy": data.accuracy,
                "duration_seconds": data.duration_seconds,
                "correct_characters": data.correct_characters,
                "incorrect_characters": data.incorrect_characters,
                "difficultyLv": data.difficultyLv.lower(),
            })

            # DETERMINE WHICH DIFFICULTY COLUMN TO UPDATE
            difficulty_map = {
                "easy": "easy_best_wpm",
                "medium": "medium_best_wpm",
                "hard": "hard_best_wpm"
            }
            difficulty_column = difficulty_map.get(data.difficultyLv.lower())

            if difficulty_column is None:
                raise HTTPException(status_code=400, detail="Invalid difficulty level")

            # manually calculating the avg wpm
            avg_wpm_query = text("""
                SELECT AVG(wpm)
                FROM userAttempts
                WHERE user_id = :user_id
            """)

            avg_result = conn.execute(avg_wpm_query, {"user_id": user_id}).fetchone()
            avg_wpm = avg_result[0] if avg_result and avg_result[0] is not None else 0

            # UPDATE THE USERS TABLE WITH NEW AGGREGATE STATS
            update_sql = f"""
                UPDATE users
                SET
                    total_attempts = COALESCE(total_attempts, 0) + 1,
                    avg_wpm = :avg_wpm,
                    best_wpm = GREATEST(COALESCE(best_wpm, 0), :current_wpm),
                    {difficulty_column} = GREATEST(COALESCE({difficulty_column}, 0), :current_wpm)
                WHERE id = :user_id
            """

            conn.execute(text(update_sql), {
                "user_id": user_id,
                "current_wpm": data.wpm,
                "avg_wpm": avg_wpm
            })

            conn.commit()

        return {"message": "Attempt logged successfully"}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error logging attempt: {e}")