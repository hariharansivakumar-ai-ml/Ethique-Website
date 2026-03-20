import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import traceback

load_dotenv("d:/React/Sri_Ponni/Backend/.env")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

test_cases = [
    {"name": "bare", "kwargs": {"resource_type": "auto"}},
    {"name": "folder", "kwargs": {"resource_type": "auto", "folder": "sri_ponni_blogs"}},
    {"name": "transformation", "kwargs": {"resource_type": "auto", "transformation": [{"width": 1200, "height": 630, "crop": "fill"}]}},
]


print("Cloud Name:", os.getenv("CLOUDINARY_CLOUD_NAME"))
print("API Key:", os.getenv("CLOUDINARY_API_KEY"))
print("API Secret:", os.getenv("CLOUDINARY_API_SECRET"))

with open('D:/React/Sri_Ponni/Backend/models.py', 'rb') as f:
    for tc in test_cases:
        f.seek(0)
        print(f"Testing {tc['name']}...")
        try:
            cloudinary.uploader.upload(f, **tc['kwargs'])
            print(f"Success: {tc['name']}")
        except Exception as e:
            print(f"Error {tc['name']}:", str(e))
