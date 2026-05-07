from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

import uuid

class BlogBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    image_alt: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[str] = "draft"
    
    # SEO Fields
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    focus_keyword: Optional[str] = None
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
    image_alt: Optional[str] = None
    slug: Optional[str] = None
    status: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    focus_keyword: Optional[str] = None
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

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: str

class ContactMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    is_read: bool
    created_at: datetime

class EventBase(BaseModel):
    title: str
    description: str
    date: str
    location: Optional[str] = None
    category: Optional[str] = "ALL"
    status: Optional[str] = "upcoming"
    image_url: Optional[str] = None
    map_url: Optional[str] = None
    hours: Optional[str] = None
    address: Optional[str] = None
    host_name: Optional[str] = None
    contact_number: Optional[str] = None
    slug: Optional[str] = None
    sort_date: Optional[date] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    image_url: Optional[str] = None
    map_url: Optional[str] = None
    hours: Optional[str] = None
    address: Optional[str] = None
    host_name: Optional[str] = None
    contact_number: Optional[str] = None
    slug: Optional[str] = None
    sort_date: Optional[dt_date] = None

class EventResponse(EventBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    created_at: datetime

class SubscriptionCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class SubscriptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    name: str
    email: str
    phone: Optional[str] = None
    status: str
    created_at: datetime
