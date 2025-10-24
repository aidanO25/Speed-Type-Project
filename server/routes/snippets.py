# server/routes/snippets.py
from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import text
from db import ENGINE

router = APIRouter(prefix="/snippets", tags=["Snippets"])



# get a new snippet for the set language
@router.get("/language")
def language_select(language: str = Query(None)):

    if language:
        sql = text("""
            SELECT id, language, snippet
            FROM codeSnippets
            WHERE isActive = 1 
            AND language = :language
            ORDER BY RAND()
            LIMIT 1
        """)
        params = {"language": language}

    else:
        sql = text("""
            SELECT id, language, snippet
            FROM codeSnippets
            WHERE isActive = 1
            ORDER BY RAND()
            LIMIT 1
        """)

    with ENGINE.connect() as conn:
        if language:
            row = conn.execute(sql, {"language": language}).mappings().first()
        else:
            row = conn.execute(sql).mappings().first()
    if not row:
        raise HTTPException(status_code=404, detail="No active snippet found")
    return {
        "id": row["id"], 
        "language": row["language"], 
        "snippet": row["snippet"]}


# gets snippets based on their difficulty level
@router.get("/alterDifficulty")
def difficultyLv(
    difficulty: str = Query("all"),
    language: str = Query(None)
):
    if difficulty != "all":
        if language:
            sql = text("""
                SELECT id, language, snippet
                FROM codeSnippets
                WHERE isActive = 1
                AND difficultyLv = :difficulty
                AND language = :language
                ORDER BY RAND()
                LIMIT 1
            """)
            params = {"difficulty": difficulty, "language": language}
        else:
            sql = text("""
                SELECT id, language, snippet
                FROM codeSnippets
                WHERE isActive = 1
                AND difficultyLv = :difficulty
                ORDER BY RAND()
                LIMIT 1
            """)
            params = {"difficulty": difficulty}
    else:
        if language:
            sql = text("""
                SELECT id, language, snippet
                FROM codeSnippets
                WHERE isActive = 1
                AND language = :language
                ORDER BY RAND()
                LIMIT 1
            """)
            params = {"language": language}
        else:
            sql = text("""
                SELECT id, language, snippet
                FROM codeSnippets
                WHERE isActive = 1
                ORDER BY RAND()
                LIMIT 1
            """)
            params = {}

    with ENGINE.connect() as conn:
        row = conn.execute(sql, params).mappings().first()

    if not row:
        raise HTTPException(status_code=404, detail="No matching snippet found")

    return {
        "id": row["id"],
        "language": row["language"],
        "snippet": row["snippet"]
    }

snippets_router = router