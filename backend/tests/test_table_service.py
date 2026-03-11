"""TableService TDD Tests"""
import pytest
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.table_service import table_service
from app.services.auth_service import auth_service
from app.models.store import Store
from app.models.table import Table
from app.models.table_session import TableSession
from app.models.category import Category
from app.models.menu import Menu
from app.models.order import Order
from app.models.order_item import OrderItem


def _create_store(db: Session):
    store = Store(store_identifier="test-store", name="테스트 매장")
    db.add(store)
    db.commit()
    return store


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-022~023: setup_table
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestSetupTable:
    def test_setup_table_success(self, db: Session):
        """Given: 유효한 데이터, When: setup_table, Then: 테이블 생성"""
        store = _create_store(db)
        table = table_service.setup_table(db, store.id, 1, "pass1234")
        assert table.table_number == 1
        assert table.store_id == store.id
        assert table.is_active is True

    def test_setup_table_duplicate(self, db: Session):
        """Given: 이미 존재하는 테이블 번호, When: setup_table, Then: HTTPException(409)"""
        store = _create_store(db)
        table_service.setup_table(db, store.id, 1, "pass1234")
        with pytest.raises(HTTPException) as exc_info:
            table_service.setup_table(db, store.id, 1, "pass5678")
        assert exc_info.value.status_code == 409


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-024~025: complete_session
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestCompleteSession:
    def test_complete_session_success(self, db: Session):
        """Given: 활성 세션+주문, When: complete_session, Then: 이력 이동 + 세션 종료"""
        store = _create_store(db)
        table = table_service.setup_table(db, store.id, 1, "pass1234")
        cat = Category(store_id=store.id, name="메인", display_order=1)
        db.add(cat)
        db.flush()
        menu = Menu(category_id=cat.id, store_id=store.id, name="김치찌개", price=8000)
        db.add(menu)
        db.flush()
        session = TableSession(table_id=table.id, store_id=store.id)
        db.add(session)
        db.flush()
        order = Order(store_id=store.id, table_id=table.id, session_id=session.id,
                      order_number="ORD-TEST-0001", total_amount=8000, status="COMPLETED")
        db.add(order)
        db.flush()
        item = OrderItem(order_id=order.id, menu_id=menu.id, menu_name="김치찌개",
                         quantity=1, unit_price=8000, subtotal=8000)
        db.add(item)
        db.commit()

        result = table_service.complete_session(db, table.id)
        assert result["completed"] is True
        # 세션 비활성화 확인
        db.refresh(session)
        assert session.is_active is False
        # 원본 주문 삭제 확인
        assert db.query(Order).filter(Order.session_id == session.id).first() is None

    def test_complete_session_no_active(self, db: Session):
        """Given: 활성 세션 없음, When: complete_session, Then: HTTPException(404)"""
        store = _create_store(db)
        table = table_service.setup_table(db, store.id, 1, "pass1234")
        with pytest.raises(HTTPException) as exc_info:
            table_service.complete_session(db, table.id)
        assert exc_info.value.status_code == 404


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-026: get_table_history
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestGetTableHistory:
    def test_get_table_history(self, db: Session):
        """Given: 완료된 세션 이력, When: get_table_history, Then: 이력 반환"""
        from app.models.order_history import OrderHistory
        store = _create_store(db)
        table = table_service.setup_table(db, store.id, 1, "pass1234")
        history = OrderHistory(
            original_order_id=1, store_id=store.id, table_id=table.id,
            session_id=1, table_number=1, order_number="ORD-TEST-0001",
            total_amount=8000, status="COMPLETED", items_json="[]",
            ordered_at=table.created_at,
        )
        db.add(history)
        db.commit()
        result = table_service.get_table_history(db, table.id)
        assert len(result) == 1
        assert result[0].order_number == "ORD-TEST-0001"
