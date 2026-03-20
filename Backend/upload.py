from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from .models import Media
from .auth import verify_token
from .schemas import ImageUploadResponse
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

router = APIRouter(prefix="/api/admin", tags=["upload"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"}
MAX_SIZE_MB = 50  # Increased for videos

@router.post("/upload", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    type: str = Form(...),
    db: Session = Depends(get_db),
    _: str = Depends(verify_token)
):
    if type not in ["image", "video"]:
        raise HTTPException(status_code=400, detail="Invalid media type")
        
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only supported images and videos are allowed")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File size must be under {MAX_SIZE_MB}MB")

    # Reset file pointer after reading contents
    file.file.seek(0)

    try:
        upload_params = {
            "folder": os.getenv("CLOUDINARY_UPLOAD_PRESET", "sri_ponni_blogs"),
            "resource_type": type,
        }
        
        if type == "image":
            upload_params["transformation"] = [
                {"width": 1200, "height": 630, "crop": "fill", "quality": "auto", "fetch_format": "auto"}
            ]

        result = cloudinary.uploader.upload(file.file, **upload_params)
    except Exception as e:
        print("Cloudinary error:", str(e))
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

    # Save to Media table
    db_media = Media(
        url=result["secure_url"],
        public_id=result["public_id"],
        type=type
    )
    db.add(db_media)
    db.commit()

    return ImageUploadResponse(url=result["secure_url"], public_id=result["public_id"], type=type)
