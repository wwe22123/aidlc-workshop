from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.order import (
    OrderCreateRequest, OrderStatusUpdateRequest,
    OrderResponse,
)
from app.services.order_service import order_service
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/api/orders", tags=["order"])


@router.post("", response_model=OrderResponse)
def create_order(request: OrderCreateRequest, db: Session = Depends(get_db)):
    return order_service.create_order(
        db, request.store_id, request.table_id,
        [item.model_dump() for item in request.items]
    )


@router.get("", response_model=List[OrderResponse])
def get_orders(table_id: int = Query(None), session_id: int = Query(None),
               store_id: int = Query(None), db: Session = Depends(get_db)):
    if store_id and not table_id:
        return order_service.get_active_orders_by_store(db, store_id)
    if table_id is not None and session_id is not None:
        return order_service.get_orders_by_session(db, table_id, session_id)
    if table_id is not None:
        return order_service.get_active_orders_by_table(db, table_id)
    return []


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_detail(order_id: int, db: Session = Depends(get_db)):
    return order_service.get_order_detail(db, order_id)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: int, request: OrderStatusUpdateRequest,
                        db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return order_service.update_order_status(db, order_id, request.status)


@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return order_service.delete_order(db, order_id)
