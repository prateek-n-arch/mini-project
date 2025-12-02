# backend/app/db/mongodb/__init__.py
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://mongo:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client["mindecho_db"]

# collections
chat_collection = db["chats"]
