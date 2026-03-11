# 테이블오더 서비스 요구사항 명확화 질문

아래 질문에 대해 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
Backend 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Spring Boot (Java/Kotlin)
C) FastAPI (Python)
D) NestJS (TypeScript)
E) Other (please describe after [Answer]: tag below)

[Answer]: FastAPI

## Question 2
Frontend 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (JavaScript/TypeScript)
B) Vue.js
C) Next.js (React 기반 SSR)
D) Vanilla HTML/CSS/JavaScript
E) Other (please describe after [Answer]: tag below)

[Answer]: React

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL
C) SQLite (개발/프로토타입용)
D) MongoDB (NoSQL)
E) Other (please describe after [Answer]: tag below)

[Answer]: SQLite

## Question 4
배포 환경은 어떻게 계획하고 계십니까?

A) AWS (EC2, ECS, Lambda 등)
B) 로컬 개발 환경만 (Docker Compose)
C) Heroku / Railway 등 PaaS
D) 배포는 고려하지 않음 (로컬 실행만)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 5
메뉴 이미지 처리 방식은 어떻게 하시겠습니까? (요구사항에 이미지 URL이 언급되어 있습니다)

A) 외부 이미지 URL 직접 입력 (별도 업로드 없음)
B) 서버에 이미지 파일 업로드 후 URL 자동 생성
C) AWS S3 등 클라우드 스토리지에 업로드
D) 이미지 기능은 MVP에서 제외 (placeholder 사용)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
관리자 계정은 어떻게 관리하시겠습니까?

A) 사전 정의된 관리자 계정 1개 (seed data)
B) 관리자 회원가입 기능 포함
C) 매장별 관리자 계정 seed data로 여러 개 생성
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
매장(Store) 데이터는 어떻게 관리하시겠습니까?

A) 단일 매장만 지원 (seed data로 1개 매장 생성)
B) 다중 매장 지원 (관리자가 매장 등록 가능)
C) 다중 매장 지원 (seed data로 여러 매장 생성)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
프로젝트 구조는 어떤 형태를 선호하시겠습니까?

A) Monorepo (Frontend + Backend 하나의 저장소)
B) 별도 저장소 (Frontend / Backend 분리)
C) 상관없음 (AI 판단에 맡김)
D) Other (please describe after [Answer]: tag below)

[Answer]: A
