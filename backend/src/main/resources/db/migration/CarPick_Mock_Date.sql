SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE CAR_SPEC;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. 미가입 (NONE)
-- is_default: 0 (False), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, insurance_label , summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('NONE', '미가입', '사고 시 고객부담금 전액', 0, 0, 1, 1, 'Y', NOW(), NOW());

-- 2. 일반자차 (STANDARD)
-- is_default: 0 (False), is_active: 1 (True)
INSERT INTO insurance
(insurance_code, insurance_label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('STANDARD', '일반자차', '사고 시 고객부담금 30만원', 15000, 0, 1, 2, 'Y', NOW(), NOW());

-- 3. 완전자차 (FULL)
-- is_default: 1 (True), is_active: 1 (True)
INSERT INTO insurance
(insurance_code,insurance_label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('FULL', '완전자차', '사고 시 고객부담금 면제', 30000, 1, 1, 3, 'Y', NOW(), NOW());


INSERT INTO CAR_SPEC (
    brand,
    model_name,
    display_name_short,
    car_class,
    model_year_base,
    ai_summary,
    fuel_type,
    transmission_type,
    is_four_wheel_drive,
    car_options,
    min_driver_age,
    min_license_years,
    seating_capacity,
    trunk_capacity,
    fuel_efficiency,
    main_image_url,
    img_url,
    ai_keywords,
    drive_labels
) VALUES

/* 1. 경형 (KIA 모닝) */
      ('KIA', '모닝 3세대', '모닝', 'LIGHT', 2020,
       '도심 주행에 최적화된 경제적인 경차', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방센서,블루투스,열선시트',
       26, 1, 5, '캐리어 1개', '15.7',
       '/images/cars/morning_2020.png', '/images/cars/morning_detail.png',
       '#경차,#출퇴근,#가성비,#주차편리', '가솔린,경차,경제적'),

/* 2. 준중형 (KIA K3) */
      ('KIA', 'K3 2세대', 'K3', 'COMPACT', 2020,
       '기본기가 탄탄한 준중형 세단', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,열선시트,차선이탈방지',
       26, 1, 5, '캐리어 3개', '15.2',
       '/images/cars/k3_2020.png', '/images/cars/k3_detail.png',
       '#준중형,#데이트,#드라이브,#가성비', '가솔린,5인승,인기모델'),

/* 3. 경형 (KIA 모닝 F/L) */
      ('KIA', '모닝 3세대 F/L', '모닝', 'LIGHT', 2021,
       '페이스리프트로 더욱 세련된 모닝', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,통풍시트(운전석),블루투스',
       21, 1, 5, '캐리어 1개', '15.7',
       '/images/cars/morning_2021.png', '/images/cars/morning_fl_detail.png',
       '#경차,#사회초년생,#마트장보기,#단기렌트', '가솔린,경차,옵션풍부'),

/* 4. 준중형 (KIA K3 F/L) */
      ('KIA', 'K3 2세대 F/L', 'K3', 'COMPACT', 2022,
       '스타일리시한 디자인의 준중형', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,통풍시트,전자식파킹',
       26, 1, 5, '캐리어 3개', '14.1',
       '/images/cars/k3_2022.png', '/images/cars/k3_fl_detail.png',
       '#디자인,#여행,#2030추천,#쾌적함', '가솔린,준중형,스타일'),

/* 5. 경형 (KIA 모닝 F/L2) */
      ('KIA', '모닝 3세대 F/L2', '모닝', 'LIGHT', 2025,
       '최신 안전 사양이 탑재된 신형 모닝', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,어라운드뷰,스마트크루즈컨트롤,통풍시트',
       26, 1, 5, '캐리어 1개', '15.1',
       '/images/cars/morning_2025.png', '/images/cars/morning_fl2_detail.png',
       '#신차,#풀옵션,#안전제일,#시내주행', '가솔린,신차,최신옵션'),

/* 6. 중형 (KIA K5 LPG) */
      ('KIA', 'K5 3세대', 'K5', 'MID', 2020,
       'LPG로 경제성을 잡은 스타일리시 세단', 'LPG', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,전동시트',
       26, 2, 5, '캐리어 3개', '10.2',
       '/images/cars/k5_lpg.png', '/images/cars/k5_lpg_detail.png',
       '#LPG,#연비절약,#장거리,#편안함', 'LPG,중형,경제성'),

/* 7. 준중형 (HYUNDAI 아반떼) */
      ('HYUNDAI', '아반떼 CN7 F/L', '아반떼', 'COMPACT', 2024,
       '국민 준중형, 압도적인 상품성', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,애플카플레이,안드로이드오토,차선유지보조',
       26, 1, 5, '캐리어 3개', '14.9',
       '/images/cars/avante_cn7.png', '/images/cars/avante_detail.png',
       '#국민차,#베스트셀러,#승차감,#넓은실내', '가솔린,준중형,베스트셀러'),

/* 8. 중형 (HYUNDAI 쏘나타) */
      ('HYUNDAI', '쏘나타 DN8', '쏘나타', 'MID', 2022,
       '편안한 승차감의 중형 세단 정석', 'LPG', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,스마트키,통풍시트,열선시트',
       21, 2, 5, '캐리어 3개', '10.2',
       '/images/cars/sonata_dn8.png', '/images/cars/sonata_detail.png',
       '#패밀리카,#정숙성,#LPG,#부모님효도', 'LPG,중형,승차감'),

/* 9. 경형 (KIA 레이) */
      ('KIA', '레이 1세대 F/L2', '레이', 'LIGHT', 2024,
       '경차 그 이상의 공간 활용성', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,열선시트,폴딩시트',
       26, 1, 5, '캐리어 1개', '12.7',
       '/images/cars/ray_2024.png', '/images/cars/ray_detail.png',
       '#박스카,#넓은공간,#차박,#짐싣기좋음', '가솔린,공간활용,인기'),

/* 10. 중형 (KIA K5 F/L) */
      ('KIA', 'K5 3세대 F/L', 'K5', 'MID', 2024,
       '페이스리프트로 완성된 디자인', 'LPG', 'AUTO', FALSE,
       '네비게이션,블랙박스,어라운드뷰,헤드업디스플레이(HUD),스마트키',
       21, 2, 5, '캐리어 3개', '9.8',
       '/images/cars/k5_fl_2024.png', '/images/cars/k5_fl_detail.png',
       '#디자인깡패,#젊은감성,#데이트카,#신형', 'LPG,중형,디자인'),

/* 11. SUV (SSANGYONG 티볼리) */
      ('KG_MOBILITY', '티볼리 아머', '티볼리', 'SUV', 2021,
       '소형 SUV의 트렌드 세터', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,후방카메라,크루즈컨트롤,루프랙',
       26, 1, 5, '캐리어 2개', '11.5',
       '/images/cars/tivoli.png', '/images/cars/tivoli_detail.png',
       '#SUV,#초보운전,#시야확보,#튼튼함', '가솔린,SUV,소형SUV'),

/* 12. SUV (KIA 스포티지) */
      ('KIA', '스포티지 5세대', '스포티지', 'SUV', 2024,
       '넓은 공간과 하이테크 인테리어', 'GASOLINE', 'AUTO', FALSE,
       '네비게이션,블랙박스,파노라마썬루프,통풍시트,전동트렁크,차선이탈방지',
       26, 1, 5, '캐리어 4개', '12.0',
       '/images/cars/sportage.png', '/images/cars/sportage_detail.png',
       '#패밀리SUV,#캠핑,#넉넉한공간,#여행', '가솔린,SUV,패밀리카');
-- ==========================================
-- 🚗 CarPick MVP용 초기 필수 데이터 (Branch, Car, Price)
-- ==========================================

-- 1. [지점] 김포공항점 (branch_id=1)
INSERT INTO BRANCH (
    branch_id, branch_code, branch_name,
    address_basic, address_detail, phone,
    latitude, longitude, region_dept1,
    open_time, close_time, business_hours,
    can_manage_inventory_yn, can_manage_vehicle_status_yn, can_pickup_return_yn,
    use_yn
) VALUES (
             1, 'GMP01', '김포공항점',
             '서울 강서구 하늘길 112', '국제선 청사 1층 렌터카 데스크', '02-1234-5678',
             37.558643, 126.801242, 'SEOUL',
             '08:00:00', '22:00:00', '매일 08:00 ~ 22:00',
             'Y', 'Y', 'Y',
             'Y'
         ) ON DUPLICATE KEY UPDATE branch_name = branch_name;

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

/* 1번 드롭존 – 국내선 메인 */
      (
          1,
          '1',
          '김포공항 국내선 1번 드롭존',
          '김포공항 국내선 청사 1층 도착장 앞',
          '렌터카 표지판 기준 우측 2번째 정차 구역',
          3,
          37.558870,
          126.802200,
          '08:00 ~ 22:00',
          1
      ),

/* 2번 드롭존 – 국내선 보조 */
      (
          1,
          '2',
          '김포공항 국내선 2번 드롭존',
          '김포공항 국내선 주차장 P1 인근',
          '혼잡 시 안내되는 예비 드롭존',
          5,
          37.559200,
          126.803100,
          '08:00 ~ 22:00',
          1
      ),

/* 3번 드롭존 – 국제선 */
      (
          1,
          '3',
          '김포공항 국제선 드롭존',
          '김포공항 국제선 청사 출입구 앞',
          '버스 승강장 맞은편 단기 정차 구역',
          4,
          37.558100,
          126.801900,
          '08:00 ~ 22:00',
          1
      ),

/* 4번 드롭존 – 야간/비상 */
      (
          1,
          '4',
          '김포공항 야간 드롭존',
          '김포공항 공영주차장 외곽',
          '야간 시간대 또는 혼잡 시 사용',
          7,
          37.557500,
          126.800800,
          '22:00 ~ 08:00',
          1
      );

-- 2. [차종] 기아 스포티지 5세대 (spec_id=1, SUV)
INSERT INTO CAR_SPEC (
    spec_id, brand, model_name, display_name_short,
    car_class, fuel_type, transmission_type, seating_capacity,
    model_year_base, use_yn,
    main_image_url
) VALUES (
             1, 'KIA', '스포티지 5세대', '스포티지 NQ5',
             'SUV', 'GASOLINE', 'AUTO', 5,
             2024, 'Y',
             'https://www.kia.com/content/dam/kwcms/kr/ko/images/vehicles/sportage/nq5/2024/sportage_nq5_2024_exterior_snow-white-pearl.png'
         ) ON DUPLICATE KEY UPDATE
                                car_class = 'SUV',
                                use_yn = 'Y'; -- 혹시 기존 데이터가 있어도 SUV로 강제 수정


-- 3. [가격 정책] 기본가 12만원, 할인 30% (unit_type='DAILY' 필수!)
INSERT INTO PRICE_POLICY (
    spec_id, branch_id,
    base_price, discount_rate,
    unit_type, -- ★ 핵심 컬럼
    is_active, valid_from, valid_to
) VALUES (
             1, 1,
             120000, 30,
             'DAILY',
             1, NOW(), '2099-12-31 23:59:59'
         ) ON DUPLICATE KEY UPDATE unit_type = 'DAILY';


-- 4. [차량 실재고] 스포티지 2대 등록
-- 1호차
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id,
    vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at,
    is_active, use_yn
) VALUES (
             1, 1,
             '105하1545', 'KNA12345678900001', 2024,
             'AVAILABLE', 5200, NOW(),
             1, 'Y'
         );

-- 2호차
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id,
    vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at,
    is_active, use_yn
) VALUES (
             1, 1,
             '234호7890', 'KNA12345678900002', 2023,
             'AVAILABLE', 12500, NOW(),
             1, 'Y'
         );
-- SUV
INSERT INTO VEHICLE_INVENTORY (
    spec_id,
    branch_id,
    vehicle_no,
    vin,
    model_year,
    operational_status,
    mileage,
    last_inspected_at,
    is_active,
    use_yn
) VALUES
/* 1대째: 스포티지 105하1545 */
      (
          12,                    -- 스포티지 ID (아까 리스트의 12번)
          1,                     -- 김포공항점
          '105하1554',           -- 차량번호
          'KNA_SPORTAGE_001',    -- 차대번호
          2024,
          'AVAILABLE',
          5200,
          NOW(),
          1,
          'Y'
      ),
/* 2대째: 스포티지 333호3333 */
      (
          12,                    -- 스포티지 ID
          1,
          '333호3333',           -- 차량번호
          'KNA_SPORTAGE_002',    -- 차대번호
          2024,
          'AVAILABLE',
          12500,
          NOW(),
          1,
          'Y'
      );

-- 기존 가격 데이터 정리 (선택)

ALTER TABLE PRICE AUTO_INCREMENT = 1;

-- CAR_SPEC 기준 일일 가격 가데이터
INSERT INTO PRICE (
    car_spec_id,
    daily_price,
    price_1m,
    price_3m,
    price_6m,
    use_yn,
    created_at,
    updated_at
) VALUES
-- 1. 모닝 (경형)
(1,  50000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 2. K3 (준중형)
(2,  65000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 3. 모닝 F/L
(3,  52000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 4. K3 F/L
(4,  68000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 5. 모닝 신형
(5,  55000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 6. K5 LPG
(6,  85000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 7. 아반떼
(7,  70000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 8. 쏘나타
(8,  90000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 9. 레이
(9,  60000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 10. K5 F/L
(10, 95000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 11. 티볼리
(11, 100000, 0, 0, 0, 'Y', NOW(), NOW()),

-- 12. 스포티지
(12, 120000, 0, 0, 0, 'Y', NOW(), NOW());

COMMIT;


COMMIT;

