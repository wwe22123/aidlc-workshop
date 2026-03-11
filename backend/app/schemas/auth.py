from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    store_identifier: str = Field(..., min_length=1, max_length=50)
    username: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=4)


class TableLoginRequest(BaseModel):
    store_identifier: str = Field(..., min_length=1, max_length=50)
    table_number: int = Field(..., ge=1)
    password: str = Field(..., min_length=4)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TableLoginResponse(BaseModel):
    table_id: int
    store_id: int
    table_number: int
