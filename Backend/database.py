from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./sql_app.db")

if DATABASE_URL.startswith("sqlite:///"):
    db_path = DATABASE_URL.replace("sqlite:///", "", 1)
    if not os.path.isabs(db_path) and not db_path.startswith("/"):
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        abs_db_path = os.path.abspath(os.path.join(backend_dir, db_path))
        abs_db_path = abs_db_path.replace("\\", "/")
        DATABASE_URL = f"sqlite:///{abs_db_path}"

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
