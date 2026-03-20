from database import SessionLocal
from models import Media

db = SessionLocal()
try:
    # Try querying the media table
    media_count = db.query(Media).count()
    print("Media count:", media_count)
except Exception as e:
    print("DB Error:", e)
finally:
    db.close()
