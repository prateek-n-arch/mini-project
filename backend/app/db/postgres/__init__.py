# backend/app/db/postgres/__init__.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base

DATABASE_URL = os.environ.get("POSTGRES_URL", "postgresql://mindecho:mindecho_pass@postgres:5432/mindecho")

# Using sync SQLAlchemy for migrations & simple operations
engine = create_engine(DATABASE_URL, echo=False, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)
