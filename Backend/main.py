import os
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import Base, engine
from .blog import router as blog_router
from .auth import router as auth_router
from .upload import router as upload_router
from .media import router as media_router
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
app = FastAPI()

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"DEBUG: Validation Error for {request.method} {request.url.path}")
    print(f"DEBUG: Error details: {exc.errors()}")
    print(f"DEBUG: Request body/form: {await request.form() if 'multipart/form-data' in request.headers.get('content-type', '') else await request.body()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": str(exc.body)},
    )

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
