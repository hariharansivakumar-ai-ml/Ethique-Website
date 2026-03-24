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
    print(f"DEBUG: create_blog data: {data.model_dump()}")
    try:
        blog = Blog(**data.model_dump())
        db.add(blog)
        db.commit()
        db.refresh(blog)
        return blog
    except Exception as e:
        db.rollback()
        print(f"DEBUG: create_blog error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/api/admin/blogs/{blog_id}", response_model=BlogResponse)
def update_blog(blog_id: str, data: BlogUpdate, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(blog_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    try:
        blog = db.query(Blog).filter(Blog.id == uid).first()
        if not blog:
            raise HTTPException(status_code=404, detail="Not found")

        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(blog, key, value)

        db.commit()
        db.refresh(blog)
        return blog
    except Exception as e:
        db.rollback()
        print(f"DEBUG: update_blog error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/api/admin/blogs/{blog_id}", response_model=BlogResponse)
def delete_blog(blog_id: str, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(blog_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    blog = db.query(Blog).filter(Blog.id == uid).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Not found")

    blog.is_deleted = True
    db.commit()
    return blog

@router.delete("/api/admin/blogs/{blog_id}/permanent")
def permanent_delete(blog_id: str, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(blog_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    blog = db.query(Blog).filter(Blog.id == uid).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(blog)
    db.commit()
    return {"detail": "Permanently deleted"}

@router.put("/api/admin/blogs/{blog_id}/restore", response_model=BlogResponse)
def restore_blog(blog_id: str, db: Session = Depends(get_db), _: str = Depends(verify_token)):
    try:
        uid = uuid.UUID(blog_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid UUID")

    blog = db.query(Blog).filter(Blog.id == uid).first()
    if not blog:
        raise HTTPException(status_code=404, detail="Not found")

    blog.is_deleted = False
    db.commit()
    db.refresh(blog)
    return blog
