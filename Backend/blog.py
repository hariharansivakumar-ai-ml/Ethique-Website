from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid

from .database import get_db
from .models import Blog
from .schemas import *
from .auth import verify_token

router = APIRouter(tags=["blogs"])

# PUBLIC
@router.get("/api/blogs", response_model=List[BlogResponse])
def get_blogs(db: Session = Depends(get_db)):
    return db.query(Blog).filter(
        Blog.status == "published",
        Blog.is_deleted == False
    ).all()

@router.get("/api/blogs/{blog_id}", response_model=BlogResponse)
def get_blog(blog_id: str, db: Session = Depends(get_db)):
    try:
        uid = uuid.UUID(blog_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    blog = db.query(Blog).filter(Blog.id == uid).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Not found")

    return blog

# ADMIN
@router.get("/api/admin/blogs", response_model=List[BlogResponse])
def get_admin_blogs(db: Session = Depends(get_db), _: str = Depends(verify_token)):
    return db.query(Blog).order_by(Blog.created_at.desc()).all()

@router.post("/api/admin/blogs", response_model=BlogResponse)
def create_blog(data: BlogCreate, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    blog = Blog(**data.model_dump())
    db.add(blog)
    db.commit()
    db.refresh(blog)
    return blog
