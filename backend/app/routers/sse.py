from fastapi import APIRouter, Query
from sse_starlette.sse import EventSourceResponse
from app.services.sse_service import sse_service

router = APIRouter(prefix="/api/sse", tags=["sse"])


@router.get("/orders")
async def subscribe_orders(store_id: int = Query(...)):
    return EventSourceResponse(sse_service.subscribe(store_id))
