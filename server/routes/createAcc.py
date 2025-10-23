# server/routes/createAcc.py
from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import text
from db import ENGINE
from .security import hash_password

router = APIRouter(prefix="/createAcc", tags=["AccCreation"])

#TO TEST THE ROUTE
@router.get("/")
def test_auth_route():
    return {"message": "Account creation route working!"}


@router.post("")
async def addUser(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    if not username or not password or not email:
        raise HTTPException(status_code=400, detail="Missing username, password, or email")
    
    hashed_pw = hash_password(password)
    
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
        print("Attempting to create account for", username, email)
        conn.execute(userInsert_sql, {"username": username, "password_hash": hashed_pw, "email": email})
        conn.commit()
        return {"message": "Account created successfully!"}

createAcc_router = router

