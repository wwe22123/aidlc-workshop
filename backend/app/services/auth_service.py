from sqlalchemy.orm import Session
import bcrypt


class AuthService:
    """인증 서비스 - 관리자/테이블 인증 및 JWT 관리"""

    def hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def verify_password(self, plain: str, hashed: str) -> bool:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

    def create_jwt_token(self, data: dict) -> str:
        from jose import jwt
        from datetime import datetime, timedelta, timezone
        from app.config import settings
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRE_HOURS)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

    def verify_jwt_token(self, token: str) -> dict:
        from jose import jwt, JWTError, ExpiredSignatureError
        from fastapi import HTTPException
        from app.config import settings
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            return payload
        except (JWTError, ExpiredSignatureError):
            raise HTTPException(status_code=401, detail="세션이 만료되었습니다")

    def authenticate_admin(self, db: Session, store_identifier: str, username: str, password: str) -> dict:
        from fastapi import HTTPException
        from datetime import datetime, timezone
        from app.models.store import Store
        from app.models.admin import Admin
        from app.config import settings

        store = db.query(Store).filter(Store.store_identifier == store_identifier).first()
        if not store:
            raise HTTPException(status_code=401, detail="인증에 실패했습니다")

        admin = db.query(Admin).filter(Admin.store_id == store.id, Admin.username == username).first()
        if not admin:
            raise HTTPException(status_code=401, detail="인증에 실패했습니다")

        # 잠금 상태 확인
        if admin.locked_until and admin.locked_until > datetime.utcnow():
            raise HTTPException(status_code=423, detail="계정이 잠겨 있습니다")

        if not self.verify_password(password, admin.password_hash):
            admin.login_attempts = (admin.login_attempts or 0) + 1
            if admin.login_attempts >= settings.MAX_LOGIN_ATTEMPTS:
                from datetime import timedelta
                admin.locked_until = datetime.utcnow() + timedelta(minutes=settings.LOCK_DURATION_MINUTES)
            db.commit()
            raise HTTPException(status_code=401, detail="인증에 실패했습니다")

        # 성공 시 카운터 리셋
        admin.login_attempts = 0
        admin.locked_until = None
        db.commit()

        token = self.create_jwt_token({"admin_id": admin.id, "store_id": store.id})
        return {"access_token": token, "token_type": "bearer"}

    def authenticate_table(self, db: Session, store_identifier: str, table_number: int, password: str) -> dict:
        from fastapi import HTTPException
        from app.models.store import Store
        from app.models.table import Table as TableModel

        store = db.query(Store).filter(Store.store_identifier == store_identifier).first()
        if not store:
            raise HTTPException(status_code=401, detail="인증에 실패했습니다")

        table = db.query(TableModel).filter(
            TableModel.store_id == store.id, TableModel.table_number == table_number
        ).first()
        if not table:
            raise HTTPException(status_code=401, detail="인증에 실패했습니다")

        if not self.verify_password(password, table.password_hash):
            raise HTTPException(status_code=401, detail="인증에 실패했습니다")

        return {"table_id": table.id, "store_id": store.id, "table_number": table.table_number}


auth_service = AuthService()
