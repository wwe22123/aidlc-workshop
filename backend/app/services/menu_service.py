from sqlalchemy.orm import Session
from sqlalchemy import func as sa_func
from typing import Optional
from fastapi import HTTPException

from app.models.category import Category
from app.models.menu import Menu
from app.models.order_item import OrderItem


class MenuService:
    """메뉴 서비스 - 카테고리/메뉴 CRUD"""

    def get_categories(self, db: Session, store_id: int) -> list:
        return db.query(Category).filter(
            Category.store_id == store_id
        ).order_by(Category.display_order).all()

    def get_menus_by_category(self, db: Session, store_id: int, category_id: Optional[int] = None) -> list:
        query = db.query(Menu).filter(Menu.store_id == store_id)
        if category_id:
            query = query.filter(Menu.category_id == category_id)
        return query.order_by(Menu.display_order).all()

    def create_menu(self, db: Session, store_id: int, menu_data: dict) -> Menu:
        category = db.query(Category).filter(
            Category.id == menu_data["category_id"],
            Category.store_id == store_id,
        ).first()
        if not category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다")

        max_order = db.query(sa_func.max(Menu.display_order)).filter(
            Menu.category_id == menu_data["category_id"]
        ).scalar() or 0

        menu = Menu(
            category_id=menu_data["category_id"],
            store_id=store_id,
            name=menu_data["name"],
            price=menu_data["price"],
            description=menu_data.get("description"),
            image_url=menu_data.get("image_url"),
            display_order=max_order + 1,
        )
        db.add(menu)
        db.commit()
        db.refresh(menu)
        return menu

    def update_menu(self, db: Session, menu_id: int, menu_data: dict) -> Menu:
        menu = db.query(Menu).filter(Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="메뉴를 찾을 수 없습니다")
        for key, value in menu_data.items():
            if value is not None and hasattr(menu, key):
                setattr(menu, key, value)
        db.commit()
        db.refresh(menu)
        return menu

    def delete_menu(self, db: Session, menu_id: int) -> dict:
        menu = db.query(Menu).filter(Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="메뉴를 찾을 수 없습니다")
        # 활성 주문에서 참조 중인지 확인
        referenced = db.query(OrderItem).filter(OrderItem.menu_id == menu_id).first()
        if referenced:
            menu.is_available = False
            db.commit()
            return {"soft_deleted": True}
        db.delete(menu)
        db.commit()
        return {"deleted": True}

    def update_display_order(self, db: Session, menu_id: int, display_order: int) -> Menu:
        menu = db.query(Menu).filter(Menu.id == menu_id).first()
        if not menu:
            raise HTTPException(status_code=404, detail="메뉴를 찾을 수 없습니다")
        menu.display_order = display_order
        db.commit()
        db.refresh(menu)
        return menu


menu_service = MenuService()
