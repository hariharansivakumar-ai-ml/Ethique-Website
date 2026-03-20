import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import Base, engine
from .blog import router as blog_router
from .auth import router as auth_router
from .upload import router as upload_router
from .media import router as media_router
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
app = FastAPI()

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")
origins = [origin.strip() for origin in origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(blog_router)
app.include_router(upload_router)
app.include_router(media_router)
