import traceback
from .database import SessionLocal
from .models import Media
db = SessionLocal()
try:
    m = Media(url="test", public_id="test")
    db.add(m)
    db.commit()
    print("Success")
except Exception as e:
    traceback.print_exc()
