import asyncio
import json
from typing import AsyncGenerator, Dict, Set
from datetime import datetime


class SSEService:
    """SSE 서비스 - 실시간 이벤트 브로드캐스팅"""

    def __init__(self):
        self._connections: Dict[int, Set[asyncio.Queue]] = {}

    async def subscribe(self, store_id: int) -> AsyncGenerator:
        queue: asyncio.Queue = asyncio.Queue()
        if store_id not in self._connections:
            self._connections[store_id] = set()
        self._connections[store_id].add(queue)
        try:
            while True:
                data = await queue.get()
                yield {"event": data["type"], "data": json.dumps(data, ensure_ascii=False)}
        except asyncio.CancelledError:
            self.remove_connection(store_id, queue)

    async def broadcast(self, store_id: int, event_type: str, data: dict) -> None:
        event = {"type": event_type, "timestamp": datetime.utcnow().isoformat(), **data}
        if store_id in self._connections:
            for queue in self._connections[store_id].copy():
                try:
                    await queue.put(event)
                except Exception:
                    self.remove_connection(store_id, queue)

    def remove_connection(self, store_id: int, queue: asyncio.Queue) -> None:
        if store_id in self._connections:
            self._connections[store_id].discard(queue)
            if not self._connections[store_id]:
                del self._connections[store_id]


sse_service = SSEService()
