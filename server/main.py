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

#below i commented out the postgresql commands as i could use the file for insters or anything related to accessing the database
'''
from init_db import initialize_db
@app.get("/init-db")
def init_db_route():
    initialize_db()
    return {"message": "DB initialized"}
'''


origins = [
    "http://localhost:5173",          # local dev frontend
    "https://speed-coder.onrender.com",  # same origin as backend (harmless)
    "https://speed-type-project.vercel.app" # live frontend
    # later we'll add your Vercel URL here
]

# CORS (React dev server)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers
app.include_router(snippets_router)  # No prefix here!
app.include_router(auth_router)
app.include_router(createAcc_router)
app.include_router(attemptLog_router)
app.include_router(profileData_router)

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI is working!"}