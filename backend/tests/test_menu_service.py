"""MenuService TDD Tests"""
import pytest
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.services.menu_service import menu_service
from app.models.store import Store
from app.models.category import Category
from app.models.menu import Menu


def _create_store_and_category(db: Session):
    store = Store(store_identifier="test-store", name="테스트 매장")
    db.add(store)
    db.flush()
    cat = Category(store_id=store.id, name="메인메뉴", display_order=1)
    db.add(cat)
    db.commit()
    return store, cat


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-008: get_categories
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestGetCategories:
    def test_get_categories_returns_list(self, db: Session):
        """Given: 카테고리 존재, When: get_categories, Then: 목록 반환"""
        store, cat = _create_store_and_category(db)
        result = menu_service.get_categories(db, store.id)
        assert len(result) == 1
        assert result[0].name == "메인메뉴"

    def test_get_categories_empty(self, db: Session):
        """Given: 카테고리 없음, When: get_categories, Then: 빈 목록"""
        store = Store(store_identifier="test-store", name="테스트 매장")
        db.add(store)
        db.commit()
        result = menu_service.get_categories(db, store.id)
        assert result == []


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-009: get_menus_by_category
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestGetMenusByCategory:
    def test_get_menus_all(self, db: Session):
        """Given: 메뉴 존재, When: category_id 없이 조회, Then: 전체 메뉴"""
        store, cat = _create_store_and_category(db)
        db.add(Menu(category_id=cat.id, store_id=store.id, name="김치찌개", price=8000))
        db.commit()
        result = menu_service.get_menus_by_category(db, store.id)
        assert len(result) == 1

    def test_get_menus_by_category_id(self, db: Session):
        """Given: 여러 카테고리, When: 특정 category_id, Then: 해당 카테고리 메뉴만"""
        store, cat1 = _create_store_and_category(db)
        cat2 = Category(store_id=store.id, name="음료", display_order=2)
        db.add(cat2)
        db.flush()
        db.add(Menu(category_id=cat1.id, store_id=store.id, name="김치찌개", price=8000))
        db.add(Menu(category_id=cat2.id, store_id=store.id, name="콜라", price=2000))
        db.commit()
        result = menu_service.get_menus_by_category(db, store.id, cat2.id)
        assert len(result) == 1
        assert result[0].name == "콜라"


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-010~011: create_menu
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestCreateMenu:
    def test_create_menu_success(self, db: Session):
        """Given: 유효한 데이터, When: create_menu, Then: 메뉴 생성"""
        store, cat = _create_store_and_category(db)
        menu = menu_service.create_menu(db, store.id, {
            "category_id": cat.id, "name": "된장찌개", "price": 7000
        })
        assert menu.name == "된장찌개"
        assert menu.price == 7000
        assert menu.store_id == store.id

    def test_create_menu_category_not_found(self, db: Session):
        """Given: 존재하지 않는 카테고리, When: create_menu, Then: HTTPException(404)"""
        store, _ = _create_store_and_category(db)
        with pytest.raises(HTTPException) as exc_info:
            menu_service.create_menu(db, store.id, {
                "category_id": 999, "name": "된장찌개", "price": 7000
            })
        assert exc_info.value.status_code == 404


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-012: update_menu
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestUpdateMenu:
    def test_update_menu_success(self, db: Session):
        """Given: 기존 메뉴, When: update_menu, Then: 수정 반영"""
        store, cat = _create_store_and_category(db)
        menu = Menu(category_id=cat.id, store_id=store.id, name="김치찌개", price=8000)
        db.add(menu)
        db.commit()
        updated = menu_service.update_menu(db, menu.id, {"name": "김치찌개(매운맛)", "price": 9000})
        assert updated.name == "김치찌개(매운맛)"
        assert updated.price == 9000

    def test_update_menu_not_found(self, db: Session):
        """Given: 존재하지 않는 메뉴, When: update_menu, Then: HTTPException(404)"""
        with pytest.raises(HTTPException) as exc_info:
            menu_service.update_menu(db, 999, {"name": "없는메뉴"})
        assert exc_info.value.status_code == 404


# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TC-BE-013~014: delete_menu
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class TestDeleteMenu:
    def test_delete_menu_hard_delete(self, db: Session):
        """Given: 참조 없는 메뉴, When: delete_menu, Then: 물리 삭제"""
        store, cat = _create_store_and_category(db)
        menu = Menu(category_id=cat.id, store_id=store.id, name="김치찌개", price=8000)
        db.add(menu)
        db.commit()
        menu_id = menu.id
        result = menu_service.delete_menu(db, menu_id)
        assert result["deleted"] is True
        assert db.query(Menu).filter(Menu.id == menu_id).first() is None

    def test_delete_menu_soft_delete_when_referenced(self, db: Session):
        """Given: 주문에서 참조 중인 메뉴, When: delete_menu, Then: is_available=False"""
        from app.models.table import Table
        from app.models.table_session import TableSession
        from app.models.order import Order
        from app.models.order_item import OrderItem
        store, cat = _create_store_and_category(db)
        menu = Menu(category_id=cat.id, store_id=store.id, name="김치찌개", price=8000)
        db.add(menu)
        db.flush()
        table = Table(store_id=store.id, table_number=1, password_hash="hash")
        db.add(table)
        db.flush()
        session = TableSession(table_id=table.id, store_id=store.id)
        db.add(session)
        db.flush()
        order = Order(store_id=store.id, table_id=table.id, session_id=session.id,
                      order_number="ORD-TEST-0001", total_amount=8000, status="PENDING")
        db.add(order)
        db.flush()
        item = OrderItem(order_id=order.id, menu_id=menu.id, menu_name="김치찌개",
                         quantity=1, unit_price=8000, subtotal=8000)
        db.add(item)
        db.commit()
        result = menu_service.delete_menu(db, menu.id)
        assert result["soft_deleted"] is True
        db.refresh(menu)
        assert menu.is_available is False

    def test_delete_menu_not_found(self, db: Session):
        """Given: 존재하지 않는 메뉴, When: delete_menu, Then: HTTPException(404)"""
        with pytest.raises(HTTPException) as exc_info:
            menu_service.delete_menu(db, 999)
        assert exc_info.value.status_code == 404
