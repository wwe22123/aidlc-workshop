from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.schemas.table import TableCreateRequest, TableResponse
from app.schemas.order import OrderHistoryResponse
from app.services.table_service import table_service
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/api/tables", tags=["table"])


@router.post("", response_model=TableResponse)
def setup_table(request: TableCreateRequest, store_id: int = Query(...),
                db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return table_service.setup_table(db, store_id, request.table_number, request.password)


@router.get("", response_model=List[TableResponse])
def get_tables(store_id: int = Query(...), db: Session = Depends(get_db),
               admin: dict = Depends(get_current_admin)):
    return table_service.get_tables(db, store_id)


@router.post("/{table_id}/complete")
def complete_session(table_id: int, db: Session = Depends(get_db),
                     admin: dict = Depends(get_current_admin)):
    return table_service.complete_session(db, table_id)


@router.get("/{table_id}/history", response_model=List[OrderHistoryResponse])
def get_table_history(table_id: int, date: Optional[str] = Query(None),
                      db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return table_service.get_table_history(db, table_id, date)
