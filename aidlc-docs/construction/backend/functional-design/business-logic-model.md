# Business Logic Model - Backend

---

## 1. 인증 플로우

### 1.1 관리자 로그인
```
Input: store_identifier, username, password
1. Store 조회 (store_identifier)
   - 없으면: 에러 "매장을 찾을 수 없습니다"
2. Admin 조회 (store_id, username)
   - 없으면: 에러 "인증 실패"
3. 잠금 상태 확인 (locked_until)
   - 잠금 중이면: 에러 "계정이 잠겨 있습니다. N분 후 재시도"
4. 비밀번호 검증 (bcrypt verify)
   - 실패: login_attempts += 1
     - 5회 이상: locked_until = now + 15분
     - 에러 "인증 실패"
   - 성공: login_attempts = 0, locked_until = NULL
5. JWT 토큰 생성 (payload: admin_id, store_id, exp=16h)
Output: JWT token
```

### 1.2 테이블 태블릿 로그인
```
Input: store_identifier, table_number, password
1. Store 조회 (store_identifier)
2. Table 조회 (store_id, table_number)
3. 비밀번호 검증 (bcrypt verify)
4. 응답: table_id, store_id, table_number
Output: table_id, store_id, table_number (localStorage에 저장용)
```

---

## 2. 주문 생성 플로우

```
Input: store_id, table_id, items[{menu_id, quantity}]
1. 테이블 존재 확인
2. 활성 세션 확인
   - 활성 세션 없으면: 새 TableSession 생성 (첫 주문 = 세션 시작)
3. 각 item에 대해:
   a. Menu 조회 (menu_id)
   b. is_available 확인
   c. 단가 조회 (price)
   d. subtotal = quantity * price
4. total_amount = sum(subtotals)
5. order_number 생성 (형식: "ORD-YYYYMMDD-XXXX")
6. Order 저장 (status = PENDING)
7. OrderItem[] 저장 (menu_name, unit_price 스냅샷)
8. SSE 이벤트 발행: {type: "NEW_ORDER", order_id, table_number, total_amount}
Output: Order (with items)
```

---

## 3. 주문 상태 전이

### 허용된 전이 (단방향)
```
PENDING → PREPARING → COMPLETED
```

### 전이 로직
```
Input: order_id, new_status
1. Order 조회
2. 현재 상태 확인
3. 전이 검증:
   - PENDING → PREPARING: 허용
   - PREPARING → COMPLETED: 허용
   - 그 외: 에러 "허용되지 않는 상태 변경입니다"
4. status 업데이트
5. SSE 이벤트 발행: {type: "ORDER_STATUS_CHANGED", order_id, status}
Output: Updated Order
```

---

## 4. 테이블 세션 라이프사이클

### 4.1 세션 시작 (자동)
```
트리거: 첫 주문 생성 시 (활성 세션이 없을 때)
1. TableSession 생성 (table_id, store_id, is_active=TRUE)
2. 해당 세션 ID를 주문에 연결
```

### 4.2 세션 종료 (이용 완료)
```
Input: table_id
1. 활성 세션 조회 (table_id, is_active=TRUE)
   - 없으면: 에러 "활성 세션이 없습니다"
2. 해당 세션의 모든 Order 조회
3. 각 Order를 OrderHistory로 복사:
   - items_json = JSON.stringify(OrderItems)
   - completed_at = now
4. 해당 세션의 Order, OrderItem 삭제
5. TableSession.is_active = FALSE, completed_at = now
6. SSE 이벤트 발행: {type: "TABLE_RESET", table_id}
Output: success
```

---

## 5. 주문 삭제 (관리자 직권)

```
Input: order_id
1. Order 조회
2. Order 삭제 (CASCADE: OrderItem도 삭제)
3. SSE 이벤트 발행: {type: "ORDER_DELETED", order_id, table_id}
Output: success
```

---

## 6. 메뉴 관리 로직

### 6.1 메뉴 등록
```
Input: store_id, category_id, name, price, description?, image_url?
1. Category 존재 확인 (store_id, category_id)
2. 필수 필드 검증 (name, price)
3. 가격 범위 검증 (0 < price <= 1,000,000)
4. display_order = 현재 카테고리 내 최대값 + 1
5. Menu 저장
Output: Menu
```

### 6.2 메뉴 수정
```
Input: menu_id, 수정할 필드들
1. Menu 존재 확인
2. 필드별 검증
3. Menu 업데이트
Output: Updated Menu
```

### 6.3 메뉴 삭제
```
Input: menu_id
1. Menu 존재 확인
2. 활성 주문에서 참조 중인지 확인 (OrderItem)
   - 참조 중이면: is_available = FALSE로 변경 (soft delete)
   - 참조 없으면: 물리 삭제
Output: success
```

---

## 7. 이미지 업로드

```
Input: file (multipart)
1. 파일 타입 검증 (jpg, jpeg, png, gif, webp)
2. 파일 크기 검증 (최대 5MB)
3. 고유 파일명 생성 (UUID + 원본 확장자)
4. uploads/ 디렉토리에 저장
5. URL 생성: /uploads/{filename}
Output: image_url
```

---

## 8. SSE (Server-Sent Events)

```
구독:
1. 클라이언트 연결 등록 (store_id별 관리)
2. AsyncGenerator로 이벤트 스트림 반환
3. 연결 해제 시 자동 정리

브로드캐스트:
1. store_id에 연결된 모든 클라이언트에 이벤트 전송
2. 이벤트 형식: {type, data, timestamp}

이벤트 타입:
- NEW_ORDER: 신규 주문
- ORDER_STATUS_CHANGED: 주문 상태 변경
- ORDER_DELETED: 주문 삭제
- TABLE_RESET: 테이블 이용 완료
```
