# server/dependencies.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import text
from jose import JWTError, jwt
from db import ENGINE
from routes.security import SECRET_KEY, ALGORITHM  # import your token constants

# Dependency: gets the access token from the "Authorization" header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Verifies the JWT token and returns the current user's info (e.g., username).
    Raises 401 if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token: no subject")
        


    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")



    # Verify that the user still exists in the database
    with ENGINE.connect() as conn:
        result = conn.execute(
            text(
                "SELECT id, username " \
                "FROM users " \
                "WHERE username = :username"),
                
            {"username": username}
        ).fetchone()

        if not result:
            raise HTTPException(status_code=401, detail="User not found")

        user_id, username = result
        return {"id": user_id, "username": username}
    

# can now securley get current logged in user like this
# from fastapi import Depends
#from dependencies import get_current_user

#@router.post("/secure-endpoint")
#def secure_route(user: dict = Depends(get_current_user)):
#    return {"message": f"Hello, {user['username']}!"}