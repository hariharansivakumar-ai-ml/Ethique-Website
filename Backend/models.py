from sqlalchemy import Column, String, Text, Boolean, DateTime, func, Integer
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from .database import Base

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    author = Column(String, nullable=True)
    image_url = Column(Text, nullable=True)
    slug = Column(String, unique=True, nullable=True)
    
    # SEO Fields
    seo_title = Column(String, nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_score = Column(Integer, default=0)
    tags = Column(Text, nullable=True)
    
    status = Column(String, default="draft")
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Media(Base):
    __tablename__ = "media"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    url = Column(Text, nullable=False)
    public_id = Column(String(500), nullable=False)
    type = Column(String(10), nullable=False, default="image")  # "image" or "video"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
