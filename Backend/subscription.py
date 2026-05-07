from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from database import get_db
from models import Subscription
from schemas import SubscriptionCreate, SubscriptionResponse
from auth import verify_token

router = APIRouter()

# PUBLIC
@router.post("/api/subscriptions", response_model=SubscriptionResponse)
def create_subscription(data: SubscriptionCreate, db: Session = Depends(get_db)):
    try:
        # Check if already subscribed to prevent duplicates (optional but good practice)
        existing = db.query(Subscription).filter(Subscription.email == data.email).first()
        if existing:
            return existing
            
        subscription = Subscription(**data.model_dump())
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        return subscription
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ADMIN
@router.get("/api/admin/subscriptions", response_model=List[SubscriptionResponse])
def get_subscriptions(db: Session = Depends(get_db), _: str = Depends(verify_token)):
    return db.query(Subscription).order_by(Subscription.created_at.desc()).all()

@router.delete("/api/admin/subscriptions/{sub_id}")
def delete_subscription(sub_id: str, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(sub_id)
        subscription = db.query(Subscription).filter(Subscription.id == uid).first()
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")
            
        db.delete(subscription)
        db.commit()
        return {"message": "Subscription deleted successfully"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
