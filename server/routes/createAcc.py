# server/routes/createAcc.py
from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import text
from db import ENGINE

router = APIRouter(prefix="/createAcc", tags=["AccCreation"])

@router.get("/")
def test_auth_route():
    return {"message": "Account creation route working!"}


@router.post("")

async def addUser(request: Request):
    print("📨 Received POST request to createAcc")
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Missing username or password")
    
    with ENGINE.connect() as conn:
        # first check if username or email already exists
        nameCheck_sql = text("""
                    SELECT * FROM users
                    WHERE username = :username OR email = :email
                """)
        result = conn.execute(nameCheck_sql, {"username": username, "email": email}).fetchone()

        if result:
            raise HTTPException(status_code=400, detail = "Username or email already exists")


        userInsert_sql = text("""
                   
            INSERT INTO users (username, password_hash, email)
            VALUES (:username, :password_hash, :email)
        """)

        conn.execute(userInsert_sql, {"username": username, "password_hash": password, "email": email})
        conn.commit()
        return {"message": "Account created successfully!"}


