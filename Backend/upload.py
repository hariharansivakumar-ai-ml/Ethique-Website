from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
from .database import get_db
from .models import Media
from .auth import verify_token
from .schemas import ImageUploadResponse
import cloudinary
import cloudinary.uploader
import os
import io
from PIL import Image
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)
print("DEBUG: All CLOUDINARY env vars:")
for k, v in os.environ.items():
    if k.startswith("CLOUDINARY"):
        print(f"DEBUG: {k}={v if 'SECRET' not in k else '***'}")

router = APIRouter(tags=["upload"])

ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime", "video/x-matroska"}
MAX_SIZE_MB = 50  # Increased for videos

from fastapi import Request

@router.post("/api/admin/upload/test")
async def test_upload(request: Request):
    print("DEBUG: TEST UPLOAD REACHED")
    print(f"DEBUG: Headers: {request.headers}")
    try:
        form_data = await request.form()
        print(f"DEBUG: Form data keys: {list(form_data.keys())}")
        for key in form_data.keys():
            print(f"DEBUG: Key: {key}, Type: {type(form_data[key])}")
    except Exception as e:
        print(f"DEBUG: Failed to read form data: {e}")
    return {"status": "ok"}

@router.post("/api/admin/upload", response_model=ImageUploadResponse)
async def upload_image(
    file: UploadFile = File(...),
    media_type: str = Form("image"),
    db: Session = Depends(get_db),
    _: str = Depends(verify_token)
):
    print(f"DEBUG: upload_image endpoint reached")
    print(f"DEBUG: file: {file.filename}, content_type: {file.content_type}")
    print(f"DEBUG: media_type: {media_type}")

    if media_type not in ["image", "video"]:
        raise HTTPException(status_code=400, detail=f"Invalid media type: {media_type}")
        
    if file.content_type not in ALLOWED_TYPES:
        print(f"DEBUG: Rejected content type: {file.content_type}")
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Allowed: {list(ALLOWED_TYPES)}")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File size must be under {MAX_SIZE_MB}MB")

    upload_file_obj = file.file

    if media_type == "image" and file.content_type.startswith("image/"):
        try:
            image = Image.open(io.BytesIO(contents))
            
            # Convert RGBA/P to RGB if needed to prevent WebP/JPEG artifacts, 
            # though WebP supports transparency. We'll use RGBA if it has transparency, RGB otherwise.
            if image.mode in ("RGBA", "P"):
                image = image.convert("RGBA")
            else:
                image = image.convert("RGB")
                
            webp_buffer = io.BytesIO()
            image.save(webp_buffer, format="WEBP", quality=85)
            webp_buffer.seek(0)
            upload_file_obj = webp_buffer
            file.filename = os.path.splitext(file.filename)[0] + ".webp"
            print(f"DEBUG: Successfully converted {file.filename} to WebP locally.")
        except Exception as e:
            print(f"DEBUG: WebP conversion failed, falling back to original: {e}")
            file.file.seek(0)
            upload_file_obj = file.file
    else:
        file.file.seek(0)
        upload_file_obj = file.file

    try:
        upload_params = {
            "folder": os.getenv("CLOUDINARY_FOLDER", "sri_ponni_blogs"),
            "resource_type": media_type,
            "public_id": os.path.splitext(file.filename)[0]
        }
        
        if media_type == "image":
            upload_params["format"] = "webp"
            upload_params["transformation"] = [
                {"width": 1200, "height": 630, "crop": "limit", "quality": "auto", "fetch_format": "webp"}
            ]

        print(f"DEBUG: upload_params: {upload_params}")
        result = cloudinary.uploader.upload(upload_file_obj, **upload_params)
        print(f"DEBUG: upload successful: {result.get('secure_url')}")
    except Exception as e:
        print("DEBUG: Cloudinary error:", str(e))
        raise HTTPException(status_code=500, detail=f"Cloudinary upload failed: {str(e)}")

    # Save to Media table
    db_media = Media(
        url=result["secure_url"],
        public_id=result["public_id"],
        type=media_type
    )
    db.add(db_media)
    db.commit()

    return ImageUploadResponse(url=result["secure_url"], public_id=result["public_id"], type=media_type)
