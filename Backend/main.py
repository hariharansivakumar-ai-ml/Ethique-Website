import os
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database import Base, engine
from blog import router as blog_router
from auth import router as auth_router
from upload import router as upload_router
from media import router as media_router
from contact import router as contact_router
from event import router as event_router
from subscription import router as subscription_router
import models

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "the server is running"}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",")
origins = [origin.strip() for origin in origins if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://sriponni-admin-website-xb3s.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from db_sync import sync_db
sync_db()
Base.metadata.create_all(bind=engine)

app.include_router(auth_router)
app.include_router(blog_router)
app.include_router(upload_router)
app.include_router(media_router)
app.include_router(contact_router)
app.include_router(event_router)
app.include_router(subscription_router)
