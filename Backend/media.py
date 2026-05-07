from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Media
from schemas import MediaResponse
from auth import verify_token
import cloudinary.uploader
import uuid

router = APIRouter(prefix="/api/admin/media", tags=["media"])

@router.get("", response_model=List[MediaResponse])
def get_all_media(type: Optional[str] = None, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    query = db.query(Media)
    if type:
        query = query.filter(Media.type == type)
    return query.order_by(Media.created_at.desc()).all()

@router.delete("/{media_id}", status_code=204)
def delete_media(media_id: str, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(media_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID format")

    media = db.query(Media).filter(Media.id == uid).first()
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")

    # Delete from Cloudinary
    try:
        cloudinary.uploader.destroy(media.public_id, resource_type=media.type)
    except Exception as e:
        # We can pass, or log the error, but we should still delete from the database
        pass

    db.delete(media)
    db.commit()
