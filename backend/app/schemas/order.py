from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class OrderItemRequest(BaseModel):
    menu_id: int
    quantity: int = Field(..., ge=1)


class OrderCreateRequest(BaseModel):
    store_id: int
    table_id: int
    items: List[OrderItemRequest] = Field(..., min_length=1)


class OrderStatusUpdateRequest(BaseModel):
    status: str


class OrderItemResponse(BaseModel):
    id: int
    menu_id: int
    menu_name: str
    quantity: int
    unit_price: int
    subtotal: int
    created_at: datetime

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    store_id: int
    table_id: int
    session_id: int
    order_number: str
    total_amount: int
    status: str
    created_at: datetime
    items: List[OrderItemResponse] = []

    model_config = {"from_attributes": True}


class OrderHistoryResponse(BaseModel):
    id: int
    original_order_id: int
    store_id: int
    table_id: int
    session_id: int
    table_number: int
    order_number: str
    total_amount: int
    status: str
    items_json: str
    ordered_at: datetime
    completed_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}
