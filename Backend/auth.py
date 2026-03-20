from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from dotenv import load_dotenv
from .schemas import *
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
router = APIRouter(prefix="/api/auth", tags=["auth"])

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "ponni123")

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials

    if token != "mysecrettoken":
        raise HTTPException(status_code=401, detail="Invalid token")

    return token

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    if data.username != ADMIN_USERNAME or data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    return TokenResponse(access_token="mysecrettoken")
