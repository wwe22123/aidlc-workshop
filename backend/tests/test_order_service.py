"""OrderService TDD Tests"""
import pytest
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.order_service import order_service
from app.models.store import Store
from app.models.table import Table
from app.models.table_session import TableSession
from app.models.category import Category
from app.models.menu import Menu
from app.models.order import Order


def _setup_store_table_menu(db: Session):
    store = Store(store_identifier="test-store", name="테스트 매장")
    db.add(store)
    db.flush()
    table = Table(store_id=store.id, table_number=1, password_hash="hash")
    db.add(table)
    db.flush()
    cat = Category(store_id=store.id, name="메인", display_order=1)
    db.add(cat)
    db.flush()
    menu1 = Menu(category_id=cat.id, store_id=store.id, name="김치찌개", price=8000)
    menu2 = Menu(category_id=cat.id, store_id=store.id, name="된장찌개", price=7000)
    db.add_all([menu1, menu2])
    db.commit()
    return store, table, menu1, menu2


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-015~017: create_order
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestCreateOrder:
    def test_create_order_success_auto_session(self, db: Session):
        """Given: 활성 세션 없음, When: 첫 주문, Then: 세션 자동 생성 + 주문 생성"""
        store, table, menu1, menu2 = _setup_store_table_menu(db)
        order = order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 2},
            {"menu_id": menu2.id, "quantity": 1},
        ])
        assert order.status == "PENDING"
        assert order.total_amount == 8000 * 2 + 7000 * 1
        assert len(order.items) == 2
        assert order.session_id is not None
        # 스냅샷 확인
        assert order.items[0].menu_name == "김치찌개"
        assert order.items[0].unit_price == 8000

    def test_create_order_reuse_active_session(self, db: Session):
        """Given: 활성 세션 존재, When: 추가 주문, Then: 기존 세션 사용"""
        store, table, menu1, _ = _setup_store_table_menu(db)
        order1 = order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 1},
        ])
        order2 = order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 1},
        ])
        assert order1.session_id == order2.session_id

    def test_create_order_menu_not_available(self, db: Session):
        """Given: 비활성 메뉴, When: 주문 시도, Then: HTTPException(400)"""
        store, table, menu1, _ = _setup_store_table_menu(db)
        menu1.is_available = False
        db.commit()
        with pytest.raises(HTTPException) as exc_info:
            order_service.create_order(db, store.id, table.id, [
                {"menu_id": menu1.id, "quantity": 1},
            ])
        assert exc_info.value.status_code == 400


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-018: get_orders_by_session
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestGetOrdersBySession:
    def test_get_orders_by_session(self, db: Session):
        """Given: 세션에 주문 2건, When: get_orders_by_session, Then: 2건 반환"""
        store, table, menu1, _ = _setup_store_table_menu(db)
        order1 = order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 1},
        ])
        order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 2},
        ])
        orders = order_service.get_orders_by_session(db, table.id, order1.session_id)
        assert len(orders) == 2


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-019~020: update_order_status
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestUpdateOrderStatus:
    def test_update_status_pending_to_preparing(self, db: Session):
        """Given: PENDING 주문, When: PREPARING으로 변경, Then: 성공"""
        store, table, menu1, _ = _setup_store_table_menu(db)
        order = order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 1},
        ])
        updated = order_service.update_order_status(db, order.id, "PREPARING")
        assert updated.status == "PREPARING"

    def test_update_status_invalid_transition(self, db: Session):
        """Given: PENDING 주문, When: COMPLETED로 직접 변경, Then: HTTPException(400)"""
        store, table, menu1, _ = _setup_store_table_menu(db)
        order = order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 1},
        ])
        with pytest.raises(HTTPException) as exc_info:
            order_service.update_order_status(db, order.id, "COMPLETED")
        assert exc_info.value.status_code == 400


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-021: delete_order
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestDeleteOrder:
    def test_delete_order_success(self, db: Session):
        """Given: 기존 주문, When: delete_order, Then: 삭제 성공"""
        store, table, menu1, _ = _setup_store_table_menu(db)
        order = order_service.create_order(db, store.id, table.id, [
            {"menu_id": menu1.id, "quantity": 1},
        ])
        order_id = order.id
        result = order_service.delete_order(db, order_id)
        assert result["deleted"] is True
        assert db.query(Order).filter(Order.id == order_id).first() is None

    def test_delete_order_not_found(self, db: Session):
        """Given: 존재하지 않는 주문, When: delete_order, Then: HTTPException(404)"""
        with pytest.raises(HTTPException) as exc_info:
            order_service.delete_order(db, 999)
        assert exc_info.value.status_code == 404
