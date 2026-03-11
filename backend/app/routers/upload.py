import os
import uuid
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.config import settings
from app.middleware.auth_middleware import get_current_admin

router = APIRouter(prefix="/api", tags=["upload"])

ALLOWED_TYPES = set(settings.ALLOWED_IMAGE_TYPES.split(","))


@router.post("/upload")
async def upload_image(file: UploadFile = File(...), admin: dict = Depends(get_current_admin)):
    # 파일 타입 검증
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else ""
    if ext not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="지원하지 않는 이미지 형식입니다")

    # 파일 크기 검증
    content = await file.read()
    if len(content) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="이미지 크기는 5MB 이하여야 합니다")

    # 고유 파일명 생성 및 저장
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    return {"image_url": f"/uploads/{filename}"}
