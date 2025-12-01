# server/db.py
from sqlalchemy import create_engine

# SQLite file in the same directory as main.py / db.py
DATABASE_URL = "sqlite:///./speedCoder.db"

ENGINE = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    echo=True,   # logs SQL; you can set to False later if noisy
    future=True,
)