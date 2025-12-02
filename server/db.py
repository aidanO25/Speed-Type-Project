# server/db.py
from sqlalchemy import create_engine

# PostgreSQL database hosted on Render
DATABASE_URL = "postgresql+psycopg2://monk:6WiswBn4diAPPKAEtro570fqPGaIFNXm@dpg-d4nlupogjchc73btiv3g-a/speedcoderdb"


ENGINE = create_engine(
    DATABASE_URL,
    echo=True,    # shows SQL logs
    future=True   # use modern SQLAlchemy features
)