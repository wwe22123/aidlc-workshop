from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.schemas.menu import (
    CategoryResponse, MenuCreateRequest, MenuUpdateRequest,
    MenuResponse, DisplayOrderRequest,
)
from app.services.menu_service import menu_service
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/api", tags=["menu"])


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(store_id: int = Query(...), db: Session = Depends(get_db)):
    return menu_service.get_categories(db, store_id)


@router.get("/menus", response_model=List[MenuResponse])
def get_menus(store_id: int = Query(...), category_id: Optional[int] = Query(None), db: Session = Depends(get_db)):
    return menu_service.get_menus_by_category(db, store_id, category_id)


@router.post("/menus", response_model=MenuResponse)
def create_menu(request: MenuCreateRequest, store_id: int = Query(...),
                db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return menu_service.create_menu(db, store_id, request.model_dump())


@router.put("/menus/{menu_id}", response_model=MenuResponse)
def update_menu(menu_id: int, request: MenuUpdateRequest,
                db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return menu_service.update_menu(db, menu_id, request.model_dump(exclude_unset=True))


@router.delete("/menus/{menu_id}")
def delete_menu(menu_id: int, db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return menu_service.delete_menu(db, menu_id)


@router.put("/menus/{menu_id}/order", response_model=MenuResponse)
def update_display_order(menu_id: int, request: DisplayOrderRequest,
                         db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    return menu_service.update_display_order(db, menu_id, request.display_order)
