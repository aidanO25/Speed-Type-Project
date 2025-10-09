# server/db.py
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

DATABASE_URL = URL.create(
    "mysql+pymysql",
    username="root",
    password="aidan-2003",  # consider env vars later
    host="127.0.0.1",
    port=3306,
    database="speedCoder",
    query={"charset": "utf8mb4"},
)

ENGINE = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=True,
    future=True,
)