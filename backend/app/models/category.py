from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    store_id = Column(Integer, ForeignKey("stores.id"), nullable=False)
    name = Column(String(50), nullable=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
