"""API Integration Tests"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.services.auth_service import auth_service
from app.models.store import Store
from app.models.admin import Admin
from app.models.table import Table
from app.models.category import Category
from app.models.menu import Menu


def _setup_store_admin(db: Session):
    store = Store(store_identifier="test-store", name="테스트 매장")
    db.add(store)
    db.flush()
    hashed = auth_service.hash_password("admin1234")
    admin = Admin(store_id=store.id, username="admin", password_hash=hashed)
    db.add(admin)
    db.commit()
    return store, admin


def _get_admin_token(client: TestClient) -> str:
    resp = client.post("/api/auth/admin/login", json={
        "store_identifier": "test-store", "username": "admin", "password": "admin1234"
    })
    return resp.json()["access_token"]


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-027: Auth API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestAuthAPI:
    def test_admin_login_success(self, db: Session, client: TestClient):
        _setup_store_admin(db)
        resp = client.post("/api/auth/admin/login", json={
            "store_identifier": "test-store", "username": "admin", "password": "admin1234"
        })
        assert resp.status_code == 200
        assert "access_token" in resp.json()

    def test_admin_login_fail(self, db: Session, client: TestClient):
        _setup_store_admin(db)
        resp = client.post("/api/auth/admin/login", json={
            "store_identifier": "test-store", "username": "admin", "password": "wrong"
        })
        assert resp.status_code == 401

    def test_table_login_success(self, db: Session, client: TestClient):
        store, _ = _setup_store_admin(db)
        hashed = auth_service.hash_password("table1234")
        table = Table(store_id=store.id, table_number=1, password_hash=hashed)
        db.add(table)
        db.commit()
        resp = client.post("/api/auth/table/login", json={
            "store_identifier": "test-store", "table_number": 1, "password": "table1234"
        })
        assert resp.status_code == 200
        assert resp.json()["table_id"] == table.id


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-028~029: Order API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestOrderAPI:
    def _setup_full(self, db: Session):
        store, admin = _setup_store_admin(db)
        hashed = auth_service.hash_password("table1234")
        table = Table(store_id=store.id, table_number=1, password_hash=hashed)
        db.add(table)
        db.flush()
        cat = Category(store_id=store.id, name="메인", display_order=1)
        db.add(cat)
        db.flush()
        menu = Menu(category_id=cat.id, store_id=store.id, name="김치찌개", price=8000)
        db.add(menu)
        db.commit()
        return store, table, menu

    def test_create_order_api(self, db: Session, client: TestClient):
        store, table, menu = self._setup_full(db)
        resp = client.post("/api/orders", json={
            "store_id": store.id, "table_id": table.id,
            "items": [{"menu_id": menu.id, "quantity": 2}]
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_amount"] == 16000
        assert data["status"] == "PENDING"
        assert len(data["items"]) == 1

    def test_update_order_status_api(self, db: Session, client: TestClient):
        store, table, menu = self._setup_full(db)
        # 주문 생성
        create_resp = client.post("/api/orders", json={
            "store_id": store.id, "table_id": table.id,
            "items": [{"menu_id": menu.id, "quantity": 1}]
        })
        order_id = create_resp.json()["id"]
        # 상태 변경 (Admin 인증 필요)
        token = _get_admin_token(client)
        resp = client.put(f"/api/orders/{order_id}/status",
                          json={"status": "PREPARING"},
                          headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        assert resp.json()["status"] == "PREPARING"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-030: Table API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestTableAPI:
    def test_setup_table_api(self, db: Session, client: TestClient):
        _setup_store_admin(db)
        token = _get_admin_token(client)
        store = db.query(Store).first()
        resp = client.post(f"/api/tables?store_id={store.id}",
                           json={"table_number": 1, "password": "pass1234"},
                           headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        assert resp.json()["table_number"] == 1

    def test_get_tables_api(self, db: Session, client: TestClient):
        _setup_store_admin(db)
        token = _get_admin_token(client)
        store = db.query(Store).first()
        # 테이블 생성
        client.post(f"/api/tables?store_id={store.id}",
                     json={"table_number": 1, "password": "pass1234"},
                     headers={"Authorization": f"Bearer {token}"})
        resp = client.get(f"/api/tables?store_id={store.id}",
                          headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        assert len(resp.json()) == 1


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Menu API
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestMenuAPI:
    def test_get_categories_api(self, db: Session, client: TestClient):
        store, _ = _setup_store_admin(db)
        cat = Category(store_id=store.id, name="메인", display_order=1)
        db.add(cat)
        db.commit()
        resp = client.get(f"/api/categories?store_id={store.id}")
        assert resp.status_code == 200
        assert len(resp.json()) == 1

    def test_create_menu_api(self, db: Session, client: TestClient):
        store, _ = _setup_store_admin(db)
        cat = Category(store_id=store.id, name="메인", display_order=1)
        db.add(cat)
        db.commit()
        token = _get_admin_token(client)
        resp = client.post(f"/api/menus?store_id={store.id}",
                           json={"category_id": cat.id, "name": "김치찌개", "price": 8000},
                           headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        assert resp.json()["name"] == "김치찌개"
