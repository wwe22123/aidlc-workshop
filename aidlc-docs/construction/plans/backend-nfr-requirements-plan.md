# NFR Requirements Plan - Unit 1: Backend (table-order-backend)

---

## 질문

### Question 1
Python 패키지 관리 도구로 어떤 것을 사용하시겠습니까?

A) pip + requirements.txt (기본)
B) Poetry (의존성 관리 + 가상환경)
C) uv (빠른 패키지 관리)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2
ORM 사용 방식을 어떻게 하시겠습니까?

A) SQLAlchemy ORM (선언적 모델 + 세션 관리)
B) SQLAlchemy Core (SQL 표현식 직접 사용)
C) SQLModel (FastAPI 작성자가 만든 SQLAlchemy + Pydantic 통합)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 실행 계획

### Step 1: NFR 요구사항 정의
- [x] 성능 요구사항 정의
- [x] 보안 요구사항 정의
- [x] 가용성/신뢰성 요구사항 정의
- [x] `nfr-requirements.md` 생성

### Step 2: 기술 스택 결정
- [x] Backend 라이브러리/프레임워크 확정
- [x] 의존성 목록 확정
- [x] `tech-stack-decisions.md` 생성
