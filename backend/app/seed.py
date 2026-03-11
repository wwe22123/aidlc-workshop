"""초기 데이터 시딩 - 매장, 관리자, 카테고리, 샘플 메뉴, 테이블"""
from sqlalchemy.orm import Session

from app.models.store import Store
from app.models.admin import Admin
from app.models.category import Category
from app.models.menu import Menu
from app.models.table import Table
from app.services.auth_service import auth_service


def seed_data(db: Session) -> None:
    """초기 데이터를 생성합니다. 이미 데이터가 있으면 건너뜁니다."""
    if db.query(Store).first():
        return

    # 매장
    store = Store(store_identifier="demo-store", name="데모 매장")
    db.add(store)
    db.flush()

    # 관리자
    admin = Admin(
        store_id=store.id,
        username="admin",
        password_hash=auth_service.hash_password("admin1234"),
    )
    db.add(admin)

    # 카테고리
    categories_data = [
        ("메인 메뉴", 1),
        ("사이드", 2),
        ("음료", 3),
    ]
    categories = []
    for name, order in categories_data:
        cat = Category(store_id=store.id, name=name, display_order=order)
        db.add(cat)
        categories.append(cat)
    db.flush()

    # 메뉴
    menus_data = [
        (categories[0].id, "김치찌개", 8000, "돼지고기 김치찌개", 1),
        (categories[0].id, "된장찌개", 7000, "두부 된장찌개", 2),
        (categories[0].id, "불고기", 12000, "양념 소불고기", 3),
        (categories[1].id, "계란말이", 5000, "치즈 계란말이", 1),
        (categories[1].id, "감자튀김", 4000, None, 2),
        (categories[2].id, "콜라", 2000, None, 1),
        (categories[2].id, "사이다", 2000, None, 2),
    ]
    for cat_id, name, price, desc, order in menus_data:
        db.add(Menu(
            category_id=cat_id, store_id=store.id,
            name=name, price=price, description=desc, display_order=order,
        ))

    # 테이블 (1~5번)
    for num in range(1, 6):
        db.add(Table(
            store_id=store.id,
            table_number=num,
            password_hash=auth_service.hash_password(f"table{num}"),
        ))

    db.commit()
