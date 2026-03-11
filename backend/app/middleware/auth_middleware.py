from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import auth_service

security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> dict:
    """JWT 토큰에서 현재 관리자 정보를 추출합니다."""
    token = credentials.credentials
    payload = auth_service.verify_jwt_token(token)
    return payload
