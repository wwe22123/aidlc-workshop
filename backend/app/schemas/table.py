from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TableCreateRequest(BaseModel):
    table_number: int = Field(..., ge=1)
    password: str = Field(..., min_length=4)


class TableResponse(BaseModel):
    id: int
    store_id: int
    table_number: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TableSessionResponse(BaseModel):
    id: int
    table_id: int
    store_id: int
    started_at: datetime
    completed_at: Optional[datetime]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
