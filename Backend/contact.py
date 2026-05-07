from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from auth import verify_token

router = APIRouter(
    prefix="/api/contact",
    tags=["Contact"]
)  

@router.post("/", response_model=schemas.ContactMessageResponse)
def create_contact_message(message: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    db_message = models.ContactMessage(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.get("/", response_model=List[schemas.ContactMessageResponse])
def get_contact_messages(db: Session = Depends(get_db), _: str = Depends(verify_token), skip: int = 0, limit: int = 100):
    messages = db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).offset(skip).limit(limit).all()
    return messages

@router.delete("/{message_id}")
def delete_contact_message(message_id: str, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    import uuid
    try:
        uid = uuid.UUID(message_id)
    except:
        return {"detail": "Invalid UUID format"}
        
    db_message = db.query(models.ContactMessage).filter(models.ContactMessage.id == uid).first()
    if not db_message:
        return {"detail": "Message not found"}
    db.delete(db_message)
    db.commit()
    return {"detail": "Message deleted"}
