SET FOREIGN_KEY_CHECKS = 0;

-- 1. 데이터 초기화 (순서 중요)
TRUNCATE TABLE PENALTY_CHARGE;
TRUNCATE TABLE PENALTY_POLICY_VERSION;
TRUNCATE TABLE PENALTY_POLICY;
TRUNCATE TABLE RESERVATION_EXTENSION;
TRUNCATE TABLE RESERVATION_STATUS_HISTORY;
TRUNCATE TABLE VEHICLE_STATUS_HISTORY;
TRUNCATE TABLE RESERVATION;
TRUNCATE TABLE VEHICLE_INVENTORY;
TRUNCATE TABLE PRICE;
TRUNCATE TABLE PRICE_POLICY;
TRUNCATE TABLE CAR_OPTION;
TRUNCATE TABLE INSURANCE;
TRUNCATE TABLE COUPON;
TRUNCATE TABLE DROPZONE_POINT;
TRUNCATE TABLE BRANCH;
TRUNCATE TABLE CAR_SPEC;


SET FOREIGN_KEY_CHECKS = 1;


-- ==========================================
-- 2. 보험 상품 (INSURANCE)
-- ==========================================
INSERT INTO INSURANCE
(insurance_code, insurance_label , summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('NONE', '미가입', '사고 시 고객부담금 전액', 0, 0, 1, 1, 'Y', NOW(), NOW()),
    ('STANDARD', '일반자차', '사고 시 고객부담금 30만원', 15000, 0, 1, 2, 'Y', NOW(), NOW()),
    ('FULL', '완전자차', '사고 시 고객부담금 면제', 30000, 1, 1, 3, 'Y', NOW(), NOW());


-- ==========================================
-- 3. 지점 (BRANCH)
-- ==========================================
INSERT INTO BRANCH (
    branch_id, branch_code, branch_name,
    address_basic, address_detail, phone,
    latitude, longitude, region_dept1,
    open_time, close_time, business_hours,
    image_url,
    can_manage_inventory_yn, can_manage_vehicle_status_yn, can_pickup_return_yn,
    use_yn
) VALUES (
             1, 'GMP01', '김포공항점',
             '서울 강서구 하늘길 112', '국제선 청사 1층 렌터카 데스크', '02-1234-5678',
             37.558643, 126.801242, 'SEOUL',
             '08:00:00', '22:00:00', '매일 08:00 ~ 22:00',
             'https://carpicka.mycafe24.com/branches/GIMPO_AIRPORT.png',
             'Y', 'Y', 'Y',
             'Y'
         ),
        (
            2, 'ICN01', '인천공항점',
            '인천 중구 공항로 272', '제1여객터미널 렌터카 데스크',
            '032-123-4567',
            37.460190, 126.440696, 'INCHEON',
            '07:00:00', '23:00:00', '매일 07:00 ~ 23:00',
            'https://carpicka.mycafe24.com/branches/INCHEON_T1.png',
            'Y', 'Y', 'Y',
            'Y'
         ),
         (
             3, 'CJU01', '제주공항점',
             '제주특별자치도 제주시 공항로 2', '국내선 1층 렌터카 존',
             '064-123-4567',
             33.507077, 126.492770, 'JEJU',
             '08:00:00', '22:00:00', '매일 08:00 ~ 22:00',
             'https://carpicka.mycafe24.com/branches/JEJU_AIRPORT.png',
             'Y', 'Y', 'Y',
             'Y'
         ),
         (
             4, 'PUS01', '김해공항점',
             '부산 강서구 공항진입로 108', '국내선 1층 렌터카 데스크',
             '051-123-4567',
             35.179554, 128.938213, 'BUSAN',
             '07:00:00', '22:00:00', '매일 07:00 ~ 22:00',
             'https://carpicka.mycafe24.com/branches/GIMHAE_AIRPORT.png',
             'Y', 'Y', 'Y',
             'Y'
         ),
         (5, 'TAE01', '대구공항점',
          '대구 동구 공항로 221', '국내선 렌터카 구역',
          '053-123-4567',
          35.896384, 128.655334, 'DAEGU',
          '08:00:00', '21:00:00', '매일 08:00 ~ 21:00',
          'https://carpicka.mycafe24.com/branches/DAEGU_AIRPORT.png',
          'Y', 'Y', 'Y',
          'Y'
         );



-- 1-1. [지점 기준 드롭존]
INSERT INTO DROPZONE_POINT (
    branch_id,
    dropzone_code,
    dropzone_name,
    address_text,
    location_desc,
    walking_time_min,
    latitude,
    longitude,
    service_hours,
    is_active
) VALUES

/* 1) 신방화역 환승주차장 (공식/데이터로 좌표 확인됨) */
      (
          1,
          '1',
          '신방화역 환승주차장',
          '서울 강서구 마곡서1로 111-12 (신방화역 환승주차장)',
          '역 바로 옆 환승 공영주차장. 공항 혼잡 회피용 기본 드롭존',
          3,
          37.566788,
          126.817786,
          '00:00 ~ 24:00',
          1
      ),

/* 2) 방화역(동) 공영주차장 (주소는 공식, 좌표는 역 근처 근사값) */
      (
          1,
          '2',
          '방화역 공영주차장',
          '서울 강서구 방화동 830-4 (방화역(동) 공영주차장)',
          '5호선 방화역 도보권 공영주차장. 공항 외곽 집결지로 안정적',
          5,
          37.577631,
          126.812840,
          '08:00 ~ 21:00',
          1
      ),

/* 3) 개화역 환승주차장 (주소는 공식, 좌표는 역/권역 근처 근사값) */
      (
          1,
          '3',
          '개화역 환승주차장',
          '서울 강서구 개화동로8길 19 (개화역 환승주차장)',
          '9호선 개화역 연계 환승주차장. 공항 주차 대체로 많이 쓰는 타입',
          6,
          37.578584,
          126.797405,
          '00:00 ~ 24:00',
          1
      ),

/* 4) 마곡권 공용주차장(마곡시티관리공단) (좌표 제공된 데이터 기반) */
      (
          1,
          '4',
          '마곡권 공용주차장',
          '서울 강서구 마곡서로 170 (마곡동 758 인근 주차장 권역)',
          '마곡/마곡나루권 집결용. 공항과 동선 분리 + 차량 대기 수월',
          7,
          37.569305,
          126.825595,
          '00:00 ~ 24:00',
          1
      );

-- ==========================================
-- 4. 차량 모델 (CAR_SPEC) - 10종
-- ==========================================
/* =========================
   CAR_SPEC 가데이터 (최종 차량 목록 10종)
   - 경형: 레이, 미니
   - 준중형: 아반떼, K3
   - 중형: 쏘나타, K5
   - SUV: 셀토스, 스포티지
   - 전기: 아이오닉5, 테슬라(모델3로 가정)
========================= */

INSERT INTO CAR_SPEC (
    brand, model_name, car_color, display_name_short,
    car_class, model_year_base,
    ai_summary,
    fuel_type, transmission_type, is_four_wheel_drive,
    car_options,
    min_driver_age, min_license_years,
    seating_capacity, trunk_capacity, fuel_efficiency,
    main_image_url, img_url, ai_keywords,
    drive_labels,
    use_yn, deleted_at
) VALUES

/* 1) 레이 (경형) */
      (
          'KIA', 'Kia Ray 1.0', 'WHITE', '레이',
          'LIGHT', 2023,
          '도심 주행에 최적화된 경형 박스카로, 좁은 골목과 주차에 강합니다.',
          'GASOLINE', 'AUTO', FALSE,
          '네비게이션,후방카메라,블루투스,열선시트',
          21, 1,
          5, '소형 트렁크/적재 유연', '복합 12~14km/L',
          'https://example.com/images/ray_main.png', 'https://example.com/images/ray_1.png,https://example.com/images/ray_2.png',
          '경차,도심,주차,박스카,가성비',
          '가솔린,경차,도심주행,주차편함',
          'Y', NULL
      ),

/* 2) 미니 (경형으로 분류 요청 반영: 실제로는 소형/수입이지만, 요구사항대로 LIGHT로 둠) */
      (
          'MINI', 'MINI Cooper 3 Door', 'BLUE', '미니',
          'LIGHT', 2022,
          '개성 있는 디자인과 경쾌한 주행감이 장점인 컴팩트 수입차입니다.',
          'GASOLINE', 'AUTO', FALSE,
          '네비게이션,후방카메라,블루투스,크루즈컨트롤',
          21, 1,
          4, '트렁크 소형', '복합 12~14km/L',
          'https://example.com/images/mini_main.png', 'https://example.com/images/mini_1.png,https://example.com/images/mini_2.png',
          '수입차,컴팩트,디자인,도심,주행감',
          '가솔린,수입,컴팩트,도심주행',
          'Y', NULL
      ),

/* 3) 아반떼 (준중형) */
      (
          'HYUNDAI', 'Hyundai Avante (Elantra) 1.6', 'BLACK', '아반떼',
          'COMPACT', 2024,
          '연비와 실용성을 모두 잡은 준중형 대표 모델입니다.',
          'GASOLINE', 'AUTO', FALSE,
          '네비게이션,후방카메라,차선보조,블루투스,열선시트',
          21, 1,
          5, '준중형 트렁크', '복합 14~16km/L',
          'https://example.com/images/avante_main.png', 'https://example.com/images/avante_1.png,https://example.com/images/avante_2.png',
          '준중형,출퇴근,연비,실용,안전보조',
          '가솔린,준중형,출퇴근,연비',
          'Y', NULL
      ),

/* 4) K3 (준중형) */
      (
          'KIA', 'Kia K3 1.6', 'WHITE', 'K3',
          'COMPACT', 2023,
          '균형 잡힌 승차감과 유지비가 강점인 준중형 세단입니다.',
          'GASOLINE', 'AUTO', FALSE,
          '네비게이션,후방카메라,크루즈컨트롤,블루투스',
          21, 1,
          5, '준중형 트렁크', '복합 13~15km/L',
          'https://example.com/images/k3_main.png', 'https://example.com/images/k3_1.png,https://example.com/images/k3_2.png',
          '준중형,세단,가성비,출퇴근',
          '가솔린,준중형,가성비,도심주행',
          'Y', NULL
      ),

/* 5) 쏘나타 (중형) */
      (
          'HYUNDAI', 'Hyundai Sonata 2.0', 'BLACK', '쏘나타',
          'MID', 2023,
          '넓은 실내와 안정적인 주행으로 장거리 이동에 적합합니다.',
          'GASOLINE', 'AUTO', FALSE,
          '네비게이션,후방카메라,차선보조,통풍시트,블루투스',
          21, 1,
          5, '중형 트렁크 넓음', '복합 11~13km/L',
          'https://example.com/images/sonata_main.png', 'https://example.com/images/sonata_1.png,https://example.com/images/sonata_2.png',
          '중형,장거리,패밀리,편의사양',
          '가솔린,중형,장거리,패밀리',
          'Y', NULL
      ),

/* 6) K5 (중형) */
      (
          'KIA', 'Kia K5 2.0', 'RED', 'K5',
          'MID', 2024,
          '스포티한 디자인과 주행감으로 인기 높은 중형 세단입니다.',
          'GASOLINE', 'AUTO', FALSE,
          '네비게이션,후방카메라,크루즈컨트롤,블루투스,열선시트',
          21, 1,
          5, '중형 트렁크', '복합 11~13km/L',
          'https://example.com/images/k5_main.png', 'https://example.com/images/k5_1.png,https://example.com/images/k5_2.png',
          '중형,세단,디자인,주행감',
          '가솔린,중형,도심주행,장거리',
          'Y', NULL
      ),

/* 7) 셀토스 (SUV) */
      (
          'KIA', 'Kia Seltos 1.6', 'WHITE', '셀토스',
          'SUV', 2023,
          '도심형 SUV로 적재성과 시야가 좋아 여행에 적합합니다.',
          'GASOLINE', 'AUTO', FALSE,
          '네비게이션,후방카메라,루프랙,블루투스,크루즈컨트롤',
          21, 1,
          5, 'SUV 적재 공간 여유', '복합 11~13km/L',
          'https://example.com/images/seltos_main.png', 'https://example.com/images/seltos_1.png,https://example.com/images/seltos_2.png',
          'SUV,여행,적재,도심형',
          '가솔린,SUV,여행,적재공간',
          'Y', NULL
      ),

/* 8) 스포티지 (SUV) */
      (
          'KIA', 'Kia Sportage 2.0', 'BLUE', '스포티지',
          'SUV', 2024,
          '패밀리 SUV로 공간성과 주행 안정성이 강점입니다.',
          'GASOLINE', 'AUTO', TRUE,
          '네비게이션,후방카메라,차선보조,통풍시트,블루투스',
          23, 1,
          5, 'SUV 적재 공간 넓음', '복합 10~12km/L',
          'https://example.com/images/sportage_main.png', 'https://example.com/images/sportage_1.png,https://example.com/images/sportage_2.png',
          'SUV,패밀리,장거리,공간',
          '가솔린,SUV,패밀리,장거리',
          'Y', NULL
      ),

/* 9) 아이오닉5 (전기) */
      (
          'HYUNDAI', 'Hyundai IONIQ 5', 'WHITE', '아이오닉5',
          'RV', 2024,
          '전기차 특유의 정숙성과 넓은 실내, 빠른 충전이 장점입니다.',
          'ELECTRIC', 'AUTO', FALSE,
          '네비게이션,후방카메라,차선보조,스마트크루즈,블루투스',
          23, 1,
          5, 'EV 적재 공간 여유', '전비 4~5km/kWh',
          'https://example.com/images/ioniq5_main.png', 'https://example.com/images/ioniq5_1.png,https://example.com/images/ioniq5_2.png',
          '전기차,EV,정숙,충전,미래지향',
          '전기,EV,정숙,장거리',
          'Y', NULL
      ),

/* 10) 테슬라 (전기) - 모델3로 가정 */
      (
          'TESLA', 'Tesla Model 3', 'BLACK', '테슬라',
          'IMPORT', 2023,
          '전기차 주행감과 소프트웨어 경험이 강점인 수입 EV 세단입니다.',
          'ELECTRIC', 'AUTO', FALSE,
          '오토파일럿,네비게이션,후방카메라,블루투스,OTA업데이트',
          25, 2,
          5, '세단 트렁크/프렁크', '전비 5~6km/kWh',
          'https://example.com/images/tesla3_main.png', 'https://example.com/images/tesla3_1.png,https://example.com/images/tesla3_2.png',
          '테슬라,전기차,수입,오토파일럿,EV',
          '전기,EV,수입,장거리',
          'Y', NULL
      );

-- ==========================================
-- 5. 메인 가격표 (PRICE)
-- ✅ 중요: PRICE 테이블에 'version' 컬럼이 추가되었으므로 Default(0)을 따름
-- ==========================================
INSERT INTO PRICE (car_spec_id, daily_price, monthly_price, use_yn, created_at, updated_at) VALUES
                                                                                                (1,  50000, 0,   'Y', NOW(), NOW()), -- 모닝
                                                                                                (2,  65000, 0,   'Y', NOW(), NOW()), -- K3
                                                                                                (3,  52000, 0,   'Y', NOW(), NOW()),
                                                                                                (4,  68000, 0,   'Y', NOW(), NOW()),
                                                                                                (5,  55000, 0,   'Y', NOW(), NOW()),
                                                                                                (6,  85000, 0,   'Y', NOW(), NOW()), -- K5
                                                                                                (7,  70000, 0,   'Y', NOW(), NOW()), -- 아반떼
                                                                                                (8,  90000, 0,   'Y', NOW(), NOW()), -- 쏘나타
                                                                                                (9,  60000, 0,   'Y', NOW(), NOW()), -- 레이
                                                                                                (10, 95000, 0,   'Y', NOW(), NOW());




/* =========================================
   VEHICLE_INVENTORY 가데이터 (지점 1개 가정)
   - branch_id = 1 고정
   - spec_id = 1~10 각각 2대씩 (총 20대)
========================================= */

INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id,
    vehicle_no, vin,
    model_year,
    operational_status,
    mileage, last_inspected_at,
    mileage_km, lifecycle_limit_km,
    is_active,
    use_yn, deleted_at
) VALUES

/* spec_id=1 (레이) 2대 */
      (1, 1, '12가3456', 'VIN-RAY-0001', 2023, 'AVAILABLE', NULL, '2026-01-05 10:00:00', 15230, 350000, TRUE, 'Y', NULL),
      (1, 1, '12가3457', 'VIN-RAY-0002', 2023, 'AVAILABLE', NULL, '2026-01-07 10:00:00', 28410, 350000, TRUE, 'Y', NULL),

/* spec_id=2 (미니) 2대 */
      (2, 1, '13나4567', 'VIN-MINI-0001', 2022, 'AVAILABLE', NULL, '2026-01-03 10:00:00', 33120, 350000, TRUE, 'Y', NULL),
      (2, 1, '13나4568', 'VIN-MINI-0002', 2022, 'AVAILABLE', NULL, '2026-01-09 10:00:00', 41980, 350000, TRUE, 'Y', NULL),

/* spec_id=3 (아반떼) 2대 */
      (3, 1, '14다5678', 'VIN-AVANTE-0001', 2024, 'AVAILABLE', NULL, '2026-01-06 10:00:00', 9820, 350000, TRUE, 'Y', NULL),
      (3, 1, '14다5679', 'VIN-AVANTE-0002', 2024, 'AVAILABLE', NULL, '2026-01-08 10:00:00', 17650, 350000, TRUE, 'Y', NULL),

/* spec_id=4 (K3) 2대 */
      (4, 1, '15라6789', 'VIN-K3-0001', 2023, 'AVAILABLE', NULL, '2026-01-04 10:00:00', 21440, 350000, TRUE, 'Y', NULL),
      (4, 1, '15라6790', 'VIN-K3-0002', 2023, 'AVAILABLE', NULL, '2026-01-10 10:00:00', 30510, 350000, TRUE, 'Y', NULL),

/* spec_id=5 (쏘나타) 2대 */
      (5, 1, '16마7890', 'VIN-SONATA-0001', 2023, 'AVAILABLE', NULL, '2026-01-02 10:00:00', 26870, 350000, TRUE, 'Y', NULL),
      (5, 1, '16마7891', 'VIN-SONATA-0002', 2023, 'AVAILABLE', NULL, '2026-01-11 10:00:00', 39200, 350000, TRUE, 'Y', NULL),

/* spec_id=6 (K5) 2대 */
      (6, 1, '17바8901', 'VIN-K5-0001', 2024, 'AVAILABLE', NULL, '2026-01-06 10:00:00', 11350, 350000, TRUE, 'Y', NULL),
      (6, 1, '17바8902', 'VIN-K5-0002', 2024, 'AVAILABLE', NULL, '2026-01-12 10:00:00', 20990, 350000, TRUE, 'Y', NULL),

/* spec_id=7 (셀토스) 2대 */
      (7, 1, '18사9012', 'VIN-SELTOS-0001', 2023, 'AVAILABLE', NULL, '2026-01-07 10:00:00', 18760, 350000, TRUE, 'Y', NULL),
      (7, 1, '18사9013', 'VIN-SELTOS-0002', 2023, 'AVAILABLE', NULL, '2026-01-13 10:00:00', 29540, 350000, TRUE, 'Y', NULL),

/* spec_id=8 (스포티지) 2대 */
      (8, 1, '19아0123', 'VIN-SPORTAGE-0001', 2024, 'AVAILABLE', NULL, '2026-01-05 10:00:00', 14210, 350000, TRUE, 'Y', NULL),
      (8, 1, '19아0124', 'VIN-SPORTAGE-0002', 2024, 'AVAILABLE', NULL, '2026-01-14 10:00:00', 22180, 350000, TRUE, 'Y', NULL),

/* spec_id=9 (아이오닉5) 2대 */
      (9, 1, '20자1234', 'VIN-IONIQ5-0001', 2024, 'AVAILABLE', NULL, '2026-01-08 10:00:00', 16700, 350000, TRUE, 'Y', NULL),
      (9, 1, '20자1235', 'VIN-IONIQ5-0002', 2024, 'AVAILABLE', NULL, '2026-01-09 10:00:00', 24890, 350000, TRUE, 'Y', NULL),

/* spec_id=10 (테슬라 모델3) 2대 */
      (10, 1, '21차2345', 'VIN-TESLA3-0001', 2023, 'AVAILABLE', NULL, '2026-01-10 10:00:00', 19840, 350000, TRUE, 'Y', NULL),
      (10, 1, '21차2346', 'VIN-TESLA3-0002', 2023, 'AVAILABLE', NULL, '2026-01-12 10:00:00', 27630, 350000, TRUE, 'Y', NULL);



COMMIT;