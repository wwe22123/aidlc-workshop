from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime

from app.models.table import Table
from app.models.table_session import TableSession
from app.models.menu import Menu
from app.models.order import Order
from app.models.order_item import OrderItem

VALID_TRANSITIONS = {
    "PENDING": "PREPARING",
    "PREPARING": "COMPLETED",
}


class OrderService:
    """주문 서비스 - 주문 생성/조회/상태변경/삭제"""

    def _generate_order_number(self) -> str:
        import uuid
        now = datetime.utcnow().strftime("%Y%m%d")
        short_id = uuid.uuid4().hex[:4].upper()
        return f"ORD-{now}-{short_id}"

    def create_order(self, db: Session, store_id: int, table_id: int, items: list) -> Order:
        # 테이블 확인
        table = db.query(Table).filter(Table.id == table_id).first()
        if not table:
            raise HTTPException(status_code=404, detail="테이블을 찾을 수 없습니다")

        # 활성 세션 확인 또는 생성
        session = db.query(TableSession).filter(
            TableSession.table_id == table_id,
            TableSession.is_active == True,
        ).first()
        if not session:
            session = TableSession(table_id=table_id, store_id=store_id)
            db.add(session)
            db.flush()

        # 주문 항목 처리
        order_items = []
        total_amount = 0
        for item_data in items:
            menu = db.query(Menu).filter(Menu.id == item_data["menu_id"]).first()
            if not menu:
                raise HTTPException(status_code=404, detail="메뉴를 찾을 수 없습니다")
            if not menu.is_available:
                raise HTTPException(status_code=400, detail="현재 주문할 수 없는 메뉴입니다")

            subtotal = menu.price * item_data["quantity"]
            total_amount += subtotal
            order_items.append(OrderItem(
                menu_id=menu.id,
                menu_name=menu.name,
                quantity=item_data["quantity"],
                unit_price=menu.price,
                subtotal=subtotal,
            ))

        order = Order(
            store_id=store_id,
            table_id=table_id,
            session_id=session.id,
            order_number=self._generate_order_number(),
            total_amount=total_amount,
            status="PENDING",
        )
        db.add(order)
        db.flush()

        for oi in order_items:
            oi.order_id = order.id
            db.add(oi)

        db.commit()
        db.refresh(order)
        return order

    def get_orders_by_session(self, db: Session, table_id: int, session_id: int) -> list:
        return db.query(Order).filter(
            Order.table_id == table_id,
            Order.session_id == session_id,
        ).order_by(Order.created_at).all()

    def get_active_orders_by_table(self, db: Session, table_id: int) -> list:
        """테이블의 활성 세션 주문 조회 (고객용)"""
        active_session = db.query(TableSession).filter(
            TableSession.table_id == table_id,
            TableSession.is_active == True,
        ).first()
        if not active_session:
            return []
        return db.query(Order).filter(
            Order.table_id == table_id,
            Order.session_id == active_session.id,
        ).order_by(Order.created_at).all()

    def get_active_orders_by_store(self, db: Session, store_id: int) -> list:
        """매장의 모든 활성 세션 주문을 조회 (관리자 대시보드용)"""
        active_session_ids = db.query(TableSession.id).filter(
            TableSession.store_id == store_id,
            TableSession.is_active == True,
        ).subquery()
        return db.query(Order).filter(
            Order.store_id == store_id,
            Order.session_id.in_(active_session_ids),
        ).order_by(Order.created_at).all()

    def get_order_detail(self, db: Session, order_id: int) -> Order:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")
        return order

    def update_order_status(self, db: Session, order_id: int, status: str) -> Order:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")
        allowed_next = VALID_TRANSITIONS.get(order.status)
        if allowed_next != status:
            raise HTTPException(status_code=400, detail="허용되지 않는 상태 변경입니다")
        order.status = status
        db.commit()
        db.refresh(order)
        return order

    def delete_order(self, db: Session, order_id: int) -> dict:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")
        db.delete(order)
        db.commit()
        return {"deleted": True}


order_service = OrderService()
