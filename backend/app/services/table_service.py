from sqlalchemy.orm import Session
from typing import Optional
from fastapi import HTTPException
from datetime import datetime
import json

from app.models.table import Table
from app.models.table_session import TableSession
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_history import OrderHistory
from app.services.auth_service import auth_service


class TableService:
    """테이블 서비스 - 테이블 설정/세션 관리/이력 조회"""

    def setup_table(self, db: Session, store_id: int, table_number: int, password: str) -> Table:
        existing = db.query(Table).filter(
            Table.store_id == store_id, Table.table_number == table_number
        ).first()
        if existing:
            raise HTTPException(status_code=409, detail="이미 존재하는 테이블 번호입니다")
        hashed = auth_service.hash_password(password)
        table = Table(store_id=store_id, table_number=table_number, password_hash=hashed)
        db.add(table)
        db.commit()
        db.refresh(table)
        return table

    def get_tables(self, db: Session, store_id: int) -> list:
        return db.query(Table).filter(Table.store_id == store_id).order_by(Table.table_number).all()

    def complete_session(self, db: Session, table_id: int) -> dict:
        session = db.query(TableSession).filter(
            TableSession.table_id == table_id,
            TableSession.is_active == True,
        ).first()
        if not session:
            raise HTTPException(status_code=404, detail="활성 세션이 없습니다")

        table = db.query(Table).filter(Table.id == table_id).first()
        orders = db.query(Order).filter(Order.session_id == session.id).all()

        now = datetime.utcnow()
        for order in orders:
            items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
            items_data = [
                {"menu_name": i.menu_name, "quantity": i.quantity,
                 "unit_price": i.unit_price, "subtotal": i.subtotal}
                for i in items
            ]
            history = OrderHistory(
                original_order_id=order.id,
                store_id=order.store_id,
                table_id=order.table_id,
                session_id=session.id,
                table_number=table.table_number if table else 0,
                order_number=order.order_number,
                total_amount=order.total_amount,
                status=order.status,
                items_json=json.dumps(items_data, ensure_ascii=False),
                ordered_at=order.created_at,
                completed_at=now,
            )
            db.add(history)
            db.delete(order)

        session.is_active = False
        session.completed_at = now
        db.commit()
        return {"completed": True}

    def get_table_history(self, db: Session, table_id: int, date: Optional[str] = None) -> list:
        query = db.query(OrderHistory).filter(OrderHistory.table_id == table_id)
        if date:
            from sqlalchemy import func
            query = query.filter(func.date(OrderHistory.ordered_at) == date)
        return query.order_by(OrderHistory.completed_at.desc()).all()


table_service = TableService()
