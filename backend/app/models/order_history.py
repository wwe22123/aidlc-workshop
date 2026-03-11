from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base


class OrderHistory(Base):
    __tablename__ = "order_histories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    original_order_id = Column(Integer, nullable=False)
    store_id = Column(Integer, nullable=False)
    table_id = Column(Integer, nullable=False)
    session_id = Column(Integer, nullable=False)
    table_number = Column(Integer, nullable=False)
    order_number = Column(String(20), nullable=False)
    total_amount = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)
    items_json = Column(Text, nullable=False)
    ordered_at = Column(DateTime, nullable=False)
    completed_at = Column(DateTime, nullable=False, server_default=func.now())
    created_at = Column(DateTime, nullable=False, server_default=func.now())
