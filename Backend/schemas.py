from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID

import uuid

class BlogBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[str] = "draft"
    
    # SEO Fields
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_score: Optional[int] = 0
    tags: Optional[str] = None

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_score: Optional[int] = None
    tags: Optional[str] = None

class BlogResponse(BlogBase):
    id: uuid.UUID
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ImageUploadResponse(BaseModel):
    url: str
    public_id: str
    type: str

class MediaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    url: str
    public_id: str
    type: str
    created_at: datetime
