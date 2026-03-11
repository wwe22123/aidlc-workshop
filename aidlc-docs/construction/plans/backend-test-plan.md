# Test Plan - Backend (table-order-backend)

## Unit Overview
- **Unit**: table-order-backend
- **Stories**: US-01, US-02, US-04, US-05, US-06, US-07, US-08, US-09
- **Test Framework**: pytest + httpx (FastAPI TestClient)

---

## AuthService Tests

### AuthService.hash_password() / verify_password()
- **TC-BE-001**: 鍮꾨?踰덊샇 ?댁떛 ??寃利??깃났
  - Given: ?됰Ц 鍮꾨?踰덊샇 "test1234"
  - When: hash_password ??verify_password ?몄텧
  - Then: True 諛섑솚
  - Story: US-06
  - Status: 燧?Not Started

### AuthService.create_jwt_token() / verify_jwt_token()
- **TC-BE-002**: JWT ?좏겙 ?앹꽦 諛?寃利??깃났
  - Given: payload {"admin_id": 1, "store_id": 1}
  - When: create_jwt_token ??verify_jwt_token ?몄텧
  - Then: ?먮낯 payload 諛섑솚
  - Story: US-06
  - Status: 燧?Not Started

- **TC-BE-003**: 留뚮즺??JWT ?좏겙 寃利??ㅽ뙣
  - Given: 留뚮즺???좏겙
  - When: verify_jwt_token ?몄텧
  - Then: HTTPException(401) 諛쒖깮
  - Story: US-06
  - Status: 燧?Not Started

### AuthService.authenticate_admin()
- **TC-BE-004**: 愿由ъ옄 濡쒓렇???깃났
  - Given: ?좏슚??store_identifier, username, password
  - When: authenticate_admin ?몄텧
  - Then: JWT ?좏겙 諛섑솚
  - Story: US-06
  - Status: 燧?Not Started

- **TC-BE-005**: ?섎せ??鍮꾨?踰덊샇濡?濡쒓렇???ㅽ뙣
  - Given: ?좏슚??store_identifier, username, ?섎せ??password
  - When: authenticate_admin ?몄텧
  - Then: HTTPException(401), login_attempts 利앷?
  - Story: US-06
  - Status: 燧?Not Started

- **TC-BE-006**: 5???ㅽ뙣 ??怨꾩젙 ?좉툑
  - Given: 5??濡쒓렇???ㅽ뙣??愿由ъ옄
  - When: authenticate_admin ?몄텧
  - Then: HTTPException(423) 怨꾩젙 ?좉툑
  - Story: US-06
  - Status: 燧?Not Started

### AuthService.authenticate_table()
- **TC-BE-007**: ?뚯씠釉?濡쒓렇???깃났
  - Given: ?좏슚??store_identifier, table_number, password
  - When: authenticate_table ?몄텧
  - Then: table_id, store_id, table_number 諛섑솚
  - Story: US-01
  - Status: 燧?Not Started

---

## MenuService Tests

### MenuService.get_categories()
- **TC-BE-008**: 移댄뀒怨좊━ 紐⑸줉 議고쉶
  - Given: 留ㅼ옣??移댄뀒怨좊━ 3媛?議댁옱
  - When: get_categories ?몄텧
  - Then: 3媛?移댄뀒怨좊━ 諛섑솚 (display_order ??
  - Story: US-02
  - Status: 燧?Not Started

### MenuService.get_menus_by_category()
- **TC-BE-009**: 移댄뀒怨좊━蹂?硫붾돱 議고쉶
  - Given: 移댄뀒怨좊━??硫붾돱 2媛?議댁옱
  - When: get_menus_by_category(category_id) ?몄텧
  - Then: 2媛?硫붾돱 諛섑솚
  - Story: US-02
  - Status: 燧?Not Started

### MenuService.create_menu()
- **TC-BE-010**: 硫붾돱 ?깅줉 ?깃났
  - Given: ?좏슚??硫붾돱 ?곗씠??
  - When: create_menu ?몄텧
  - Then: 硫붾돱 ?앹꽦, display_order ?먮룞 ?ㅼ젙
  - Story: US-09
  - Status: 燧?Not Started

- **TC-BE-011**: 議댁옱?섏? ?딅뒗 移댄뀒怨좊━濡?硫붾돱 ?깅줉 ?ㅽ뙣
  - Given: 議댁옱?섏? ?딅뒗 category_id
  - When: create_menu ?몄텧
  - Then: HTTPException(404)
  - Story: US-09
  - Status: 燧?Not Started

### MenuService.update_menu()
- **TC-BE-012**: 硫붾돱 ?섏젙 ?깃났
  - Given: 湲곗〈 硫붾돱
  - When: update_menu(name="?덉씠由?, price=15000) ?몄텧
  - Then: 硫붾돱 ?낅뜲?댄듃??
  - Story: US-09
  - Status: 燧?Not Started

### MenuService.delete_menu()
- **TC-BE-013**: 李몄“ ?녿뒗 硫붾돱 臾쇰━ ??젣
  - Given: 二쇰Ц?먯꽌 李몄“?섏? ?딅뒗 硫붾돱
  - When: delete_menu ?몄텧
  - Then: 硫붾돱 臾쇰━ ??젣
  - Story: US-09
  - Status: 燧?Not Started

- **TC-BE-014**: 李몄“ 以묒씤 硫붾돱 soft delete
  - Given: ?쒖꽦 二쇰Ц?먯꽌 李몄“ 以묒씤 硫붾돱
  - When: delete_menu ?몄텧
  - Then: is_available = FALSE
  - Story: US-09
  - Status: 燧?Not Started

---

## OrderService Tests

### OrderService.create_order()
- **TC-BE-015**: 二쇰Ц ?앹꽦 ?깃났 (?몄뀡 ?놁쓬 ???먮룞 ?앹꽦)
  - Given: ?쒖꽦 ?몄뀡 ?녿뒗 ?뚯씠釉? ?좏슚??硫붾돱 items
  - When: create_order ?몄텧
  - Then: ???몄뀡 ?앹꽦, 二쇰Ц ?앹꽦, 珥앹븸 怨꾩궛, order_number ?앹꽦
  - Story: US-04
  - Status: 燧?Not Started

- **TC-BE-016**: 二쇰Ц ?앹꽦 ?깃났 (湲곗〈 ?몄뀡 議댁옱)
  - Given: ?쒖꽦 ?몄뀡 ?덈뒗 ?뚯씠釉?
  - When: create_order ?몄텧
  - Then: 湲곗〈 ?몄뀡??二쇰Ц 異붽?
  - Story: US-04
  - Status: 燧?Not Started

- **TC-BE-017**: 鍮꾪솢??硫붾돱濡?二쇰Ц ?ㅽ뙣
  - Given: is_available=FALSE??硫붾돱
  - When: create_order ?몄텧
  - Then: HTTPException(400)
  - Story: US-04
  - Status: 燧?Not Started

### OrderService.get_orders_by_session()
- **TC-BE-018**: ?몄뀡蹂?二쇰Ц 議고쉶
  - Given: ?몄뀡??二쇰Ц 2媛?議댁옱
  - When: get_orders_by_session ?몄텧
  - Then: 2媛?二쇰Ц 諛섑솚 (?쒓컙??
  - Story: US-05
  - Status: 燧?Not Started

### OrderService.update_order_status()
- **TC-BE-019**: PENDING ??PREPARING ?곹깭 蹂寃??깃났
  - Given: PENDING ?곹깭 二쇰Ц
  - When: update_order_status(status="PREPARING") ?몄텧
  - Then: ?곹깭 蹂寃쎈맖
  - Story: US-07
  - Status: 燧?Not Started

- **TC-BE-020**: PREPARING ??PENDING ??갑???꾩씠 ?ㅽ뙣
  - Given: PREPARING ?곹깭 二쇰Ц
  - When: update_order_status(status="PENDING") ?몄텧
  - Then: HTTPException(400)
  - Story: US-07
  - Status: 燧?Not Started

### OrderService.delete_order()
- **TC-BE-021**: 二쇰Ц ??젣 ?깃났
  - Given: 議댁옱?섎뒗 二쇰Ц
  - When: delete_order ?몄텧
  - Then: 二쇰Ц 諛?OrderItem ??젣
  - Story: US-08
  - Status: 燧?Not Started

---

## TableService Tests

### TableService.setup_table()
- **TC-BE-022**: ?뚯씠釉??ㅼ젙 ?깃났
  - Given: ?좏슚??store_id, table_number, password
  - When: setup_table ?몄텧
  - Then: ?뚯씠釉??앹꽦, 鍮꾨?踰덊샇 ?댁떛
  - Story: US-08
  - Status: 燧?Not Started

- **TC-BE-023**: 以묐났 ?뚯씠釉?踰덊샇 ?ㅼ젙 ?ㅽ뙣
  - Given: ?대? 議댁옱?섎뒗 table_number
  - When: setup_table ?몄텧
  - Then: HTTPException(409)
  - Story: US-08
  - Status: 燧?Not Started

### TableService.complete_session()
- **TC-BE-024**: ?몄뀡 醫낅즺 ?깃났 (?대젰 ?대룞)
  - Given: ?쒖꽦 ?몄뀡??二쇰Ц 2媛?議댁옱
  - When: complete_session ?몄텧
  - Then: OrderHistory 2媛??앹꽦, ?먮낯 Order/OrderItem ??젣, ?몄뀡 鍮꾪솢?깊솕
  - Story: US-08
  - Status: 燧?Not Started

- **TC-BE-025**: ?쒖꽦 ?몄뀡 ?놁씠 醫낅즺 ?쒕룄 ?ㅽ뙣
  - Given: ?쒖꽦 ?몄뀡 ?녿뒗 ?뚯씠釉?
  - When: complete_session ?몄텧
  - Then: HTTPException(404)
  - Story: US-08
  - Status: 燧?Not Started

### TableService.get_table_history()
- **TC-BE-026**: 怨쇨굅 ?대젰 議고쉶
  - Given: OrderHistory 3媛?議댁옱
  - When: get_table_history ?몄텧
  - Then: 3媛??대젰 諛섑솚 (?쒓컙 ??닚)
  - Story: US-08
  - Status: 燧?Not Started

---

## API Integration Tests

- **TC-BE-027**: POST /api/auth/admin/login ?깃났
  - Status: 燧?Not Started
- **TC-BE-028**: POST /api/orders 二쇰Ц ?앹꽦 API
  - Status: 燧?Not Started
- **TC-BE-029**: PUT /api/orders/{id}/status ?곹깭 蹂寃?API
  - Status: 燧?Not Started
- **TC-BE-030**: POST /api/tables/{id}/complete ?몄뀡 醫낅즺 API
  - Status: 燧?Not Started

---

## Requirements Coverage

| Requirement | Test Cases | Status |
|------------|------------|--------|
| FR-C01 (?먮룞 濡쒓렇?? | TC-BE-007 | 燧?|
| FR-C02 (硫붾돱 議고쉶) | TC-BE-008, TC-BE-009 | 燧?|
| FR-C04 (二쇰Ц ?앹꽦) | TC-BE-015, TC-BE-016, TC-BE-017 | 燧?|
| FR-C05 (二쇰Ц ?댁뿭) | TC-BE-018 | 燧?|
| FR-A01 (留ㅼ옣 ?몄쬆) | TC-BE-001~006 | 燧?|
| FR-A02 (二쇰Ц 紐⑤땲?곕쭅) | TC-BE-019, TC-BE-020 | 燧?|
| FR-A03 (?뚯씠釉?愿由? | TC-BE-021~026 | 燧?|
| FR-A04 (硫붾돱 愿由? | TC-BE-010~014 | 燧?|
