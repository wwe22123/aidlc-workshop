from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class CategoryResponse(BaseModel):
    id: int
    store_id: int
    name: str
    display_order: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MenuCreateRequest(BaseModel):
    category_id: int
    name: str = Field(..., min_length=1, max_length=100)
    price: int = Field(..., gt=0, le=1000000)
    description: Optional[str] = None
    image_url: Optional[str] = None


class MenuUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[int] = Field(None, gt=0, le=1000000)
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None


class MenuResponse(BaseModel):
    id: int
    category_id: int
    store_id: int
    name: str
    price: int
    description: Optional[str]
    image_url: Optional[str]
    display_order: int
    is_available: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class DisplayOrderRequest(BaseModel):
    display_order: int = Field(..., ge=0)
