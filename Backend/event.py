from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date as dt_date
import uuid

from database import get_db
from models import Event
from schemas import EventCreate, EventUpdate, EventResponse
from auth import verify_token

router = APIRouter(tags=["events"])

# PUBLIC
@router.get("/api/events", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    try:
        events = db.query(Event).order_by(Event.created_at.desc()).all()
        # Automate status updates based on sort_date
        today = dt_date.today()
        should_commit = False
        for event in events:
            if event.sort_date and event.sort_date < today and event.status != "completed":
                event.status = "completed"
                should_commit = True
        
        if should_commit:
            db.commit()
            
        return events
    except Exception as e:
        with open("error.log", "a") as f:
            import traceback; traceback.print_exc(file=f)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/events/{event_id}", response_model=EventResponse)
def get_event(event_id: str, db: Session = Depends(get_db)):
    try:
        # 1. Try fetching by UUID first
        try:
            uid = uuid.UUID(event_id)
            event = db.query(Event).filter(Event.id == uid).first()
            if event:
                # Automate status update
                if event.sort_date and event.sort_date < dt_date.today() and event.status != "completed":
                    event.status = "completed"
                    db.commit()
                return event
        except ValueError:
            pass # Not a valid UUID, continue to slug search
        
        # 2. Try fetching by slug
        event = db.query(Event).filter(Event.slug == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        # Automate status update
        if event.sort_date and event.sort_date < dt_date.today() and event.status != "completed":
            event.status = "completed"
            db.commit()

        return event
    except HTTPException:
        raise
    except Exception as e:
        with open("error.log", "a") as f:
            import traceback; traceback.print_exc(file=f)
        raise HTTPException(status_code=500, detail=str(e))

# ADMIN
@router.post("/api/admin/events", response_model=EventResponse)
def create_event(data: EventCreate, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        event = Event(**data.model_dump())
        db.add(event)
        db.commit()
        db.refresh(event)
        return event
    except Exception as e:
        db.rollback()
        with open("error.log", "a") as f:
            import traceback; traceback.print_exc(file=f)
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/admin/events/{event_id}", response_model=EventResponse)
def update_event(event_id: str, data: EventUpdate, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(event_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    try:
        event = db.query(Event).filter(Event.id == uid).first()
        if not event:
            raise HTTPException(status_code=404, detail="Not found")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(event, key, value)

        db.commit()
        db.refresh(event)
        return event
    except Exception as e:
        db.rollback()
        with open("error.log", "a") as f:
            import traceback; traceback.print_exc(file=f)
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/admin/events/{event_id}")
def delete_event(event_id: str, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(event_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    event = db.query(Event).filter(Event.id == uid).first()
    if not event:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(event)
    db.commit()
    return {"detail": "Permanently deleted"}
