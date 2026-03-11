from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import AdminLoginRequest, TableLoginRequest, TokenResponse, TableLoginResponse
from app.services.auth_service import auth_service
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/admin/login", response_model=TokenResponse)
def admin_login(request: AdminLoginRequest, db: Session = Depends(get_db)):
    result = auth_service.authenticate_admin(
        db, request.store_identifier, request.username, request.password
    )
    return result


@router.post("/table/login", response_model=TableLoginResponse)
def table_login(request: TableLoginRequest, db: Session = Depends(get_db)):
    result = auth_service.authenticate_table(
        db, request.store_identifier, request.table_number, request.password
    )
    return result


@router.get("/verify")
def verify_token(current_admin: dict = Depends(get_current_admin)):
    return {"valid": True, "admin_id": current_admin.get("admin_id")}
