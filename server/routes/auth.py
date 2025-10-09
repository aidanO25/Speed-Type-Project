# server/routes/auth.py
from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import text
from db import ENGINE

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/authenticate")
def test_auth_route():
    return {"message": "Authentication route working!"}

@router.post("")
async def authenticate(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Missing username or password")
    
    with ENGINE.connect() as conn:
        sql = text("""
            SELECT username, password_hash
            FROM users 
            WHERE username = :username
        """)

        #.fetchone() reads the first and really the only matching row and returns a tuple or none if no user is found
        # only searching by username first as we dont want to use both username and password in the where clause to prevent info leak
        # so we look at the user record using username and verify the provided password against to stored password
        result = conn.execute(sql, {"username": username}).fetchone()

        if not result:
            raise HTTPException(status_code=401, detail="Invalid username")

        db_username, db_password_hash = result

        if password != db_password_hash:
            raise HTTPException(status_code=401, detail="Incorrect password")

        return {"message": f"Welcome back, {db_username}!"}