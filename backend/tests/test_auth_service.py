"""AuthService TDD Tests"""
import pytest
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.auth_service import auth_service
from app.models.store import Store
from app.models.admin import Admin
from app.models.table import Table


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-001: hash_password / verify_password
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestPasswordHashing:
    """비밀번호 해싱 및 검증 테스트"""

    def test_hash_password_returns_hashed_string(self):
        """Given: 평문 비밀번호, When: hash_password 호출, Then: 해싱된 문자열 반환"""
        hashed = auth_service.hash_password("test1234")
        assert hashed is not None
        assert hashed != "test1234"
        assert len(hashed) > 0

    def test_verify_password_correct(self):
        """Given: 해싱된 비밀번호, When: 올바른 평문으로 verify, Then: True"""
        hashed = auth_service.hash_password("test1234")
        assert auth_service.verify_password("test1234", hashed) is True

    def test_verify_password_incorrect(self):
        """Given: 해싱된 비밀번호, When: 틀린 평문으로 verify, Then: False"""
        hashed = auth_service.hash_password("test1234")
        assert auth_service.verify_password("wrong", hashed) is False


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-002, TC-BE-003: JWT Token
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestJWTToken:
    """JWT 토큰 생성 및 검증 테스트"""

    def test_create_jwt_token_returns_string(self):
        """Given: payload 데이터, When: create_jwt_token, Then: JWT 문자열 반환"""
        token = auth_service.create_jwt_token({"admin_id": 1, "store_id": 1})
        assert isinstance(token, str)
        assert len(token) > 0

    def test_verify_jwt_token_valid(self):
        """Given: 유효한 JWT, When: verify_jwt_token, Then: payload 반환"""
        data = {"admin_id": 1, "store_id": 1}
        token = auth_service.create_jwt_token(data)
        payload = auth_service.verify_jwt_token(token)
        assert payload["admin_id"] == 1
        assert payload["store_id"] == 1

    def test_verify_jwt_token_invalid(self):
        """Given: 잘못된 JWT, When: verify_jwt_token, Then: HTTPException(401)"""
        with pytest.raises(HTTPException) as exc_info:
            auth_service.verify_jwt_token("invalid.token.here")
        assert exc_info.value.status_code == 401

    def test_verify_jwt_token_expired(self):
        """Given: 만료된 JWT, When: verify_jwt_token, Then: HTTPException(401)"""
        from jose import jwt
        from datetime import datetime, timedelta, timezone
        from app.config import settings
        expired_data = {
            "admin_id": 1,
            "store_id": 1,
            "exp": datetime.now(timezone.utc) - timedelta(hours=1),
        }
        token = jwt.encode(expired_data, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        with pytest.raises(HTTPException) as exc_info:
            auth_service.verify_jwt_token(token)
        assert exc_info.value.status_code == 401


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-004~006: authenticate_admin
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestAuthenticateAdmin:
    """관리자 인증 테스트"""

    def _create_store_and_admin(self, db: Session):
        store = Store(store_identifier="test-store", name="테스트 매장")
        db.add(store)
        db.flush()
        hashed = auth_service.hash_password("admin1234")
        admin = Admin(store_id=store.id, username="admin", password_hash=hashed)
        db.add(admin)
        db.commit()
        return store, admin

    def test_authenticate_admin_success(self, db: Session):
        """Given: 유효한 관리자, When: 올바른 인증정보, Then: JWT 토큰 반환"""
        self._create_store_and_admin(db)
        result = auth_service.authenticate_admin(db, "test-store", "admin", "admin1234")
        assert "access_token" in result
        assert result["token_type"] == "bearer"

    def test_authenticate_admin_wrong_password(self, db: Session):
        """Given: 유효한 관리자, When: 틀린 비밀번호, Then: HTTPException(401)"""
        self._create_store_and_admin(db)
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_admin(db, "test-store", "admin", "wrong")
        assert exc_info.value.status_code == 401

    def test_authenticate_admin_store_not_found(self, db: Session):
        """Given: 존재하지 않는 매장, When: 인증 시도, Then: HTTPException(401)"""
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_admin(db, "no-store", "admin", "admin1234")
        assert exc_info.value.status_code == 401

    def test_authenticate_admin_locked_after_5_failures(self, db: Session):
        """Given: 5회 실패, When: 6번째 시도, Then: HTTPException(423) 계정 잠금"""
        self._create_store_and_admin(db)
        for _ in range(5):
            with pytest.raises(HTTPException):
                auth_service.authenticate_admin(db, "test-store", "admin", "wrong")
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_admin(db, "test-store", "admin", "admin1234")
        assert exc_info.value.status_code == 423

    def test_authenticate_admin_reset_on_success(self, db: Session):
        """Given: 3회 실패 후, When: 올바른 비밀번호, Then: 성공 및 카운터 리셋"""
        self._create_store_and_admin(db)
        for _ in range(3):
            with pytest.raises(HTTPException):
                auth_service.authenticate_admin(db, "test-store", "admin", "wrong")
        result = auth_service.authenticate_admin(db, "test-store", "admin", "admin1234")
        assert "access_token" in result


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-007: authenticate_table
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestAuthenticateTable:
    """테이블 인증 테스트"""

    def _create_store_and_table(self, db: Session):
        store = Store(store_identifier="test-store", name="테스트 매장")
        db.add(store)
        db.flush()
        hashed = auth_service.hash_password("table1234")
        table = Table(store_id=store.id, table_number=1, password_hash=hashed)
        db.add(table)
        db.commit()
        return store, table

    def test_authenticate_table_success(self, db: Session):
        """Given: 유효한 테이블, When: 올바른 인증정보, Then: table_id/store_id/table_number 반환"""
        store, table = self._create_store_and_table(db)
        result = auth_service.authenticate_table(db, "test-store", 1, "table1234")
        assert result["table_id"] == table.id
        assert result["store_id"] == store.id
        assert result["table_number"] == 1

    def test_authenticate_table_wrong_password(self, db: Session):
        """Given: 유효한 테이블, When: 틀린 비밀번호, Then: HTTPException(401)"""
        self._create_store_and_table(db)
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_table(db, "test-store", 1, "wrong")
        assert exc_info.value.status_code == 401

    def test_authenticate_table_not_found(self, db: Session):
        """Given: 존재하지 않는 테이블, When: 인증 시도, Then: HTTPException(401)"""
        store = Store(store_identifier="test-store", name="테스트 매장")
        db.add(store)
        db.commit()
        with pytest.raises(HTTPException) as exc_info:
            auth_service.authenticate_table(db, "test-store", 99, "table1234")
        assert exc_info.value.status_code == 401
