# server/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from routes import (
    snippets_router, 
    auth_router, 
    createAcc_router,
    attemptLog_router,
    profileData_router
)

# for setting logging levels
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


app = FastAPI()

# CORS (React dev server)
app.add_middleware(
    CORSMiddleware,
    #allow_origins=["http://localhost:5173"]
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(snippets_router)
app.include_router(auth_router)
app.include_router(createAcc_router)
app.include_router(attemptLog_router)
app.include_router(profileData_router)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}