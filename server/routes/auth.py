# server/routes/auth.py
from fastapi import APIRouter, HTTPException, Request
from sqlalchemy import text #for sql queries
from db import ENGINE
from .security import verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["Authentication"])

#TO TEST THE ROUTE
@router.get("/")
def test_auth_route():
    return {"message": "Authentication route working!"}

@router.post("/token")
async def authenticate(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Missing username or password")
    
    with ENGINE.connect() as conn:
        result = conn.execute(
            text("" \
                "SELECT username, password_hash " \
                "FROM users " \
                "WHERE username = :username"),
            {"username": username}
        ).fetchone()

        #.fetchone() reads the first and really the only matching row and returns a tuple or none if no user is found
        # only searching by username first as we dont want to use both username and password in the where clause to prevent info leak
        # so we look at the user record using username and verify the provided password against to stored password

        if not result:
            raise HTTPException(status_code=401, detail="Invalid username")

        db_username, db_password_hash = result

        if not verify_password(password, db_password_hash):
            raise HTTPException(status_code=401, detail="Incorrect password")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        token = create_access_token(data={"sub": db_username}, expires_delta=access_token_expires)

        return {"access_token": token, "token_type": "bearer"}
    
auth_router = router