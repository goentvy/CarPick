USE carpick;

SET FOREIGN_KEY_CHECKS = 0;

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


INSERT INTO INSURANCE
(insurance_code, insurance_label, summary_label, extra_daily_price, is_default, is_active, sort_order, use_yn, created_at, updated_at)
VALUES
    ('NONE', '미가입', '사고 시 고객부담금 전액', 0, 0, 1, 1, 'Y', NOW(), NOW()),
    ('STANDARD', '일반자차', '사고 시 고객부담금 30만원', 15000, 0, 1, 2, 'Y', NOW(), NOW()),
    ('FULL', '완전자차', '사고 시 고객부담금 면제', 30000, 1, 1, 3, 'Y', NOW(), NOW());


INSERT INTO BRANCH (
    branch_id, branch_code, branch_name,
    address_basic, address_detail, phone,
    latitude, longitude, region_dept1,
    open_time, close_time, business_hours,
    image_url,
    can_manage_inventory_yn, can_manage_vehicle_status_yn, can_pickup_return_yn,
    use_yn
) VALUES
      (1, 'GMP01', '김포공항점', '서울 강서구 하늘길 112', '국제선 청사 1층 렌터카 데스크', '02-1234-5678', 37.558643, 126.801242, 'SEOUL', '08:00:00', '22:00:00', '매일 08:00 ~ 22:00', 'https://carpicka.mycafe24.com/branches/GIMPO_AIRPORT.png', 'Y', 'Y', 'Y', 'Y'),
      (2, 'ICN01', '인천공항점', '인천 중구 공항로 272', '제1여객터미널 렌터카 데스크', '032-123-4567', 37.460190, 126.440696, 'INCHEON', '07:00:00', '23:00:00', '매일 07:00 ~ 23:00', 'https://carpicka.mycafe24.com/branches/INCHEON_T1.png', 'Y', 'Y', 'Y', 'Y'),
      (3, 'CJU01', '제주공항점', '제주특별자치도 제주시 공항로 2', '국내선 1층 렌터카 존', '064-123-4567', 33.507077, 126.492770, 'JEJU', '08:00:00', '22:00:00', '매일 08:00 ~ 22:00', 'https://carpicka.mycafe24.com/branches/JEJU_AIRPORT.png', 'Y', 'Y', 'Y', 'Y'),
      (4, 'PUS01', '김해공항점', '부산 강서구 공항진입로 108', '국내선 1층 렌터카 데스크', '051-123-4567', 35.179554, 128.938213, 'BUSAN', '07:00:00', '22:00:00', '매일 07:00 ~ 22:00', 'https://carpicka.mycafe24.com/branches/GIMHAE_AIRPORT.png', 'Y', 'Y', 'Y', 'Y'),
      (5, 'TAE01', '대구공항점', '대구 동구 공항로 221', '국내선 렌터카 구역', '053-123-4567', 35.896384, 128.655334, 'DAEGU', '08:00:00', '21:00:00', '매일 08:00 ~ 21:00', 'https://carpicka.mycafe24.com/branches/DAEGU_AIRPORT.png', 'Y', 'Y', 'Y', 'Y');


INSERT INTO DROPZONE_POINT (
    branch_id, dropzone_code, dropzone_name,
    address_text, location_desc, walking_time_min,
    latitude, longitude, service_hours, is_active
) VALUES
      (1, '1', '신방화역 환승주차장', '서울 강서구 마곡서1로 111-12 (신방화역 환승주차장)', '역 바로 옆 환승 공영주차장. 공항 혼잡 회피용 기본 드롭존', 3, 37.566788, 126.817786, '00:00 ~ 24:00', 1),
      (1, '2', '방화역 공영주차장', '서울 강서구 방화동 830-4 (방화역(동) 공영주차장)', '5호선 방화역 도보권 공영주차장. 공항 외곽 집결지로 안정적', 5, 37.577631, 126.812840, '08:00 ~ 21:00', 1),
      (1, '3', '개화역 환승주차장', '서울 강서구 개화동로8길 19 (개화역 환승주차장)', '9호선 개화역 연계 환승주차장. 공항 주차 대체로 많이 쓰는 타입', 6, 37.578584, 126.797405, '00:00 ~ 24:00', 1),
      (1, '4', '마곡권 공용주차장', '서울 강서구 마곡서로 170 (마곡동 758 인근 주차장 권역)', '마곡/마곡나루권 집결용. 공항과 동선 분리 + 차량 대기 수월', 7, 37.569305, 126.825595, '00:00 ~ 24:00', 1);


INSERT INTO CAR_SPEC (
    brand, model_name, car_color, display_name_short,
    car_class, model_year_base, ai_summary,
    fuel_type, transmission_type, is_four_wheel_drive,
    car_options, min_driver_age, min_license_years,
    seating_capacity, trunk_capacity, fuel_efficiency,
    main_video_url, img_url, ai_keywords, drive_labels,
    use_yn, deleted_at
) VALUES
      ('KIA','Kia Ray 1.0','WHITE','레이','LIGHT',2023,'도심 주행에 최적화된 경형 박스카로, 좁은 골목과 주차에 강합니다.','GASOLINE','AUTO',FALSE,'네비게이션,후방카메라,블루투스,열선시트',21,1,5,'소형 트렁크/적재 유연','복합 12~14km/L','http://carpicka.mycafe24.com/car_spin_video/car_light_ray_white_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_light_ray_white_thumb.png','경차,도심,주차,박스카,가성비','가솔린,경차,도심주행,주차편함','Y',NULL),
      ('MINI','MINI Cooper 3 Door','BLUE','미니','LIGHT',2022,'개성 있는 디자인과 경쾌한 주행감이 장점인 컴팩트 수입차입니다.','LPG','AUTO',FALSE,'네비게이션,후방카메라,블루투스,크루즈컨트롤',21,1,4,'트렁크 소형','복합 12~14km/L','http://carpicka.mycafe24.com/car_spin_video/car_light_mini_blue_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_light_mini_blue_thumb.png','수입차,컴팩트,디자인,도심,주행감','가솔린,수입,컴팩트,도심주행','Y',NULL),
      ('HYUNDAI','Hyundai Avante (Elantra) 1.6','BLACK','아반떼','COMPACT',2024,'연비와 실용성을 모두 잡은 준중형 대표 모델입니다.','DIESEL','AUTO',FALSE,'네비게이션,후방카메라,차선보조,블루투스,열선시트',21,1,5,'준중형 트렁크','복합 14~16km/L','http://carpicka.mycafe24.com/car_spin_video/car_compact_avante_black_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_compact_avante_black_thumb.png','준중형,출퇴근,연비,실용,안전보조','가솔린,준중형,출퇴근,연비','Y',NULL),
      ('KIA','Kia K3 1.6','WHITE','K3','COMPACT',2023,'균형 잡힌 승차감과 유지비가 강점인 준중형 세단입니다.','LPG','AUTO',FALSE,'네비게이션,후방카메라,크루즈컨트롤,블루투스',21,1,5,'준중형 트렁크','복합 13~15km/L','http://carpicka.mycafe24.com/car_spin_video/car_compact_k3_white_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_compact_k3_white_thumb.png','준중형,세단,가성비,출퇴근','가솔린,준중형,가성비,도심주행','Y',NULL),
      ('HYUNDAI','Hyundai Sonata 2.0','BLACK','쏘나타','MID',2023,'넓은 실내와 안정적인 주행으로 장거리 이동에 적합합니다.','HYBRID','AUTO',FALSE,'네비게이션,후방카메라,차선보조,통풍시트,블루투스',21,1,5,'중형 트렁크 넓음','복합 11~13km/L','http://carpicka.mycafe24.com/car_spin_video/car_mid_sonata_black_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_mid_sonata_black_thumb.png','중형,장거리,패밀리,편의사양','가솔린,중형,장거리,패밀리','Y',NULL),
      ('KIA','Kia K5 2.0','white','K5','MID',2024,'스포티한 디자인과 주행감으로 인기 높은 중형 세단입니다.','DIESEL','AUTO',FALSE,'네비게이션,후방카메라,크루즈컨트롤,블루투스,열선시트',21,1,5,'중형 트렁크','복합 11~13km/L','http://carpicka.mycafe24.com/car_spin_video/car_mid_k5_white_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_mid_k5_white_thumb.png','중형,세단,디자인,주행감','가솔린,중형,도심주행,장거리','Y',NULL),
      ('KIA','Kia Seltos 1.6','WHITE','셀토스','SUV',2023,'도심형 SUV로 적재성과 시야가 좋아 여행에 적합합니다.','GASOLINE','AUTO',FALSE,'네비게이션,후방카메라,루프랙,블루투스,크루즈컨트롤',21,1,5,'SUV 적재 공간 여유','복합 11~13km/L','http://carpicka.mycafe24.com/car_spin_video/car_suv_seltos_white_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_suv_seltos_white_thumb.png','SUV,여행,적재,도심형','가솔린,SUV,여행,적재공간','Y',NULL),
      ('KIA','Kia Sportage 2.0','BLUE','스포티지','SUV',2024,'패밀리 SUV로 공간성과 주행 안정성이 강점입니다.','GASOLINE','AUTO',TRUE,'네비게이션,후방카메라,차선보조,통풍시트,블루투스',23,1,5,'SUV 적재 공간 넓음','복합 10~12km/L','http://carpicka.mycafe24.com/car_spin_video/car_suv_sportage_blue_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_suv_sportage_blue_thumb.png','SUV,패밀리,장거리,공간','가솔린,SUV,패밀리,장거리','Y',NULL),
      ('HYUNDAI','Hyundai IONIQ 5','WHITE','아이오닉5','RV',2024,'전기차 특유의 정숙성과 넓은 실내, 빠른 충전이 장점입니다.','ELECTRIC','AUTO',FALSE,'네비게이션,후방카메라,차선보조,스마트크루즈,블루투스',23,1,5,'EV 적재 공간 여유','전비 4~5km/kWh','http://carpicka.mycafe24.com/car_spin_video/car_rv_ioniq5_white_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_rv_ioniq5_white_thumb.png','전기차,EV,정숙,충전,미래지향','전기,EV,정숙,장거리','Y',NULL),
      ('TESLA','Tesla Model Y','BLACK','테슬라','IMPORT',2023,'전기차 특유의 가속력과 넓은 실내 공간을 갖춘 수입 EV SUV입니다.','ELECTRIC','AUTO',FALSE,'오토파일럿,네비게이션,후방카메라,블루투스,OTA업데이트',25,2,5,'SUV 트렁크/프렁크','전비 5~6km/kWh','http://carpicka.mycafe24.com/car_spin_video/car_suv_modelY_black_spin.mp4','http://carpicka.mycafe24.com/car_thumbnail/car_suv_modelY_black_thumb.png','테슬라,전기차,SUV,수입,오토파일럿,EV','전기,EV,SUV,패밀리','Y',NULL);

INSERT INTO PRICE (spec_id, daily_price, monthly_price, use_yn, created_at, updated_at) VALUES
                                                                                                (1,50000,10000,'Y',NOW(),NOW()),
                                                                                                (2,65000,20000,'Y',NOW(),NOW()),
                                                                                                (3,52000,30000,'Y',NOW(),NOW()),
                                                                                                (4,68000,40000,'Y',NOW(),NOW()),
                                                                                                (5,55000,50000,'Y',NOW(),NOW()),
                                                                                                (6,85000,50000,'Y',NOW(),NOW()),
                                                                                                (7,70000,54000,'Y',NOW(),NOW()),
                                                                                                (8,90000,78000,'Y',NOW(),NOW()),
                                                                                                (9,60000,80000,'Y',NOW(),NOW()),
                                                                                                (10,95000,40000,'Y',NOW(),NOW());


INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id, vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at,
    mileage_km, lifecycle_limit_km, is_active, use_yn, deleted_at
) VALUES
      (1,1,'12가3456','VIN-RAY-0001',2023,'AVAILABLE',NULL,'2026-01-05 10:00:00',15230,350000,TRUE,'Y',NULL),
      (1,1,'12가3457','VIN-RAY-0002',2023,'AVAILABLE',NULL,'2026-01-07 10:00:00',28410,350000,TRUE,'Y',NULL),
      (2,1,'13나4567','VIN-MINI-0001',2022,'AVAILABLE',NULL,'2026-01-03 10:00:00',33120,350000,TRUE,'Y',NULL),
      (2,1,'13나4568','VIN-MINI-0002',2022,'AVAILABLE',NULL,'2026-01-09 10:00:00',41980,350000,TRUE,'Y',NULL),
      (3,1,'14다5678','VIN-AVANTE-0001',2024,'AVAILABLE',NULL,'2026-01-06 10:00:00',9820,350000,TRUE,'Y',NULL),
      (3,1,'14다5679','VIN-AVANTE-0002',2024,'AVAILABLE',NULL,'2026-01-08 10:00:00',17650,350000,TRUE,'Y',NULL),
      (4,1,'15라6789','VIN-K3-0001',2023,'AVAILABLE',NULL,'2026-01-04 10:00:00',21440,350000,TRUE,'Y',NULL),
      (4,1,'15라6790','VIN-K3-0002',2023,'AVAILABLE',NULL,'2026-01-10 10:00:00',30510,350000,TRUE,'Y',NULL),
      (5,1,'16마7890','VIN-SONATA-0001',2023,'AVAILABLE',NULL,'2026-01-02 10:00:00',26870,350000,TRUE,'Y',NULL),
      (5,1,'16마7891','VIN-SONATA-0002',2023,'AVAILABLE',NULL,'2026-01-11 10:00:00',39200,350000,TRUE,'Y',NULL),
      (6,1,'17바8901','VIN-K5-0001',2024,'AVAILABLE',NULL,'2026-01-06 10:00:00',11350,350000,TRUE,'Y',NULL),
      (6,1,'17바8902','VIN-K5-0002',2024,'AVAILABLE',NULL,'2026-01-12 10:00:00',20990,350000,TRUE,'Y',NULL),
      (7,1,'18사9012','VIN-SELTOS-0001',2023,'AVAILABLE',NULL,'2026-01-07 10:00:00',18760,350000,TRUE,'Y',NULL),
      (7,1,'18사9013','VIN-SELTOS-0002',2023,'AVAILABLE',NULL,'2026-01-13 10:00:00',29540,350000,TRUE,'Y',NULL),
      (8,1,'19아0123','VIN-SPORTAGE-0001',2024,'AVAILABLE',NULL,'2026-01-05 10:00:00',14210,350000,TRUE,'Y',NULL),
      (8,1,'19아0124','VIN-SPORTAGE-0002',2024,'AVAILABLE',NULL,'2026-01-14 10:00:00',22180,350000,TRUE,'Y',NULL),
      (9,1,'20자1234','VIN-IONIQ5-0001',2024,'AVAILABLE',NULL,'2026-01-08 10:00:00',16700,350000,TRUE,'Y',NULL),
      (9,1,'20자1235','VIN-IONIQ5-0002',2024,'AVAILABLE',NULL,'2026-01-09 10:00:00',24890,350000,TRUE,'Y',NULL),
      (10,1,'21차2345','VIN-TESLA3-0001',2023,'AVAILABLE',NULL,'2026-01-10 10:00:00',19840,350000,TRUE,'Y',NULL),
      (10,1,'21차2346','VIN-TESLA3-0002',2023,'AVAILABLE',NULL,'2026-01-12 10:00:00',27630,350000,TRUE,'Y',NULL);
INSERT INTO VEHICLE_INVENTORY (
    spec_id, branch_id, vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at,
    mileage_km, lifecycle_limit_km, is_active, use_yn, deleted_at
) VALUES
-- spec_id 1
(1,1,'22가3457','VIN-RAY-0003',2022,'AVAILABLE',NULL,'2026-01-15 10:00:00',32110,350000,TRUE,'Y',NULL),
(1,1,'22가3458','VIN-RAY-0004',2023,'AVAILABLE',NULL,'2026-01-16 10:00:00',19870,350000,TRUE,'Y',NULL),
(1,1,'22가3459','VIN-RAY-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',8450,350000,TRUE,'Y',NULL),

-- spec_id 2
(2,1,'23나4569','VIN-MINI-0003',2022,'AVAILABLE',NULL,'2026-01-15 10:00:00',41230,350000,TRUE,'Y',NULL),
(2,1,'23나4570','VIN-MINI-0004',2023,'AVAILABLE',NULL,'2026-01-16 10:00:00',26780,350000,TRUE,'Y',NULL),
(2,1,'23나4571','VIN-MINI-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',12940,350000,TRUE,'Y',NULL),

-- spec_id 3
(3,1,'24다5680','VIN-AVANTE-0003',2023,'AVAILABLE',NULL,'2026-01-15 10:00:00',23400,350000,TRUE,'Y',NULL),
(3,1,'24다5681','VIN-AVANTE-0004',2024,'AVAILABLE',NULL,'2026-01-16 10:00:00',10230,350000,TRUE,'Y',NULL),
(3,1,'24다5682','VIN-AVANTE-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',7560,350000,TRUE,'Y',NULL),

-- spec_id 4
(4,1,'25라6791','VIN-K3-0003',2022,'AVAILABLE',NULL,'2026-01-15 10:00:00',38420,350000,TRUE,'Y',NULL),
(4,1,'25라6792','VIN-K3-0004',2023,'AVAILABLE',NULL,'2026-01-16 10:00:00',22110,350000,TRUE,'Y',NULL),
(4,1,'25라6793','VIN-K3-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',11870,350000,TRUE,'Y',NULL),

-- spec_id 5
(5,1,'26마7892','VIN-SONATA-0003',2022,'AVAILABLE',NULL,'2026-01-15 10:00:00',45600,350000,TRUE,'Y',NULL),
(5,1,'26마7893','VIN-SONATA-0004',2023,'AVAILABLE',NULL,'2026-01-16 10:00:00',31240,350000,TRUE,'Y',NULL),
(5,1,'26마7894','VIN-SONATA-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',16490,350000,TRUE,'Y',NULL),

-- spec_id 6
(6,1,'27바8903','VIN-K5-0003',2023,'AVAILABLE',NULL,'2026-01-15 10:00:00',25870,350000,TRUE,'Y',NULL),
(6,1,'27바8904','VIN-K5-0004',2024,'AVAILABLE',NULL,'2026-01-16 10:00:00',13980,350000,TRUE,'Y',NULL),
(6,1,'27바8905','VIN-K5-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',9240,350000,TRUE,'Y',NULL),

-- spec_id 7
(7,1,'28사9014','VIN-SELTOS-0003',2023,'AVAILABLE',NULL,'2026-01-15 10:00:00',27120,350000,TRUE,'Y',NULL),
(7,1,'28사9015','VIN-SELTOS-0004',2024,'AVAILABLE',NULL,'2026-01-16 10:00:00',14350,350000,TRUE,'Y',NULL),
(7,1,'28사9016','VIN-SELTOS-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',8120,350000,TRUE,'Y',NULL),

-- spec_id 8
(8,1,'29아0125','VIN-SPORTAGE-0003',2023,'AVAILABLE',NULL,'2026-01-15 10:00:00',26340,350000,TRUE,'Y',NULL),
(8,1,'29아0126','VIN-SPORTAGE-0004',2024,'AVAILABLE',NULL,'2026-01-16 10:00:00',15120,350000,TRUE,'Y',NULL),
(8,1,'29아0127','VIN-SPORTAGE-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',9820,350000,TRUE,'Y',NULL),

-- spec_id 9
(9,1,'30자1236','VIN-IONIQ5-0003',2023,'AVAILABLE',NULL,'2026-01-15 10:00:00',22430,350000,TRUE,'Y',NULL),
(9,1,'30자1237','VIN-IONIQ5-0004',2024,'AVAILABLE',NULL,'2026-01-16 10:00:00',13190,350000,TRUE,'Y',NULL),
(9,1,'30자1238','VIN-IONIQ5-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',7890,350000,TRUE,'Y',NULL),

-- spec_id 10
(10,1,'31차2347','VIN-TESLA3-0003',2023,'AVAILABLE',NULL,'2026-01-15 10:00:00',24310,350000,TRUE,'Y',NULL),
(10,1,'31차2348','VIN-TESLA3-0004',2024,'AVAILABLE',NULL,'2026-01-16 10:00:00',15200,350000,TRUE,'Y',NULL),
(10,1,'31차2349','VIN-TESLA3-0005',2024,'AVAILABLE',NULL,'2026-01-17 10:00:00',8650,350000,TRUE,'Y',NULL);





INSERT IGNORE INTO VEHICLE_INVENTORY (
    spec_id, branch_id, vehicle_no, vin, model_year,
    operational_status, mileage, last_inspected_at,
    mileage_km, lifecycle_limit_km, is_active, use_yn, deleted_at
)
SELECT
    s.spec_id,
    b.branch_id,

    /* 차량번호: 12가3456 스타일 */
    CONCAT(
            LPAD(11 + s.spec_id, 2, '0'),
            CASE s.spec_id
                WHEN 1 THEN '가' WHEN 2 THEN '나' WHEN 3 THEN '다' WHEN 4 THEN '라'
                WHEN 5 THEN '마' WHEN 6 THEN '바' WHEN 7 THEN '사' WHEN 8 THEN '아'
                WHEN 9 THEN '자' WHEN 10 THEN '차'
                END,
            LPAD((b.branch_id * 1000) + (s.spec_id * 10) + n.seq, 4, '0')
    ) AS vehicle_no,

    /* ✅ VIN: 지점 포함(중복 방지) */
    CONCAT(
            'VIN-',
            CASE s.spec_id
                WHEN 1 THEN 'RAY'
                WHEN 2 THEN 'MINI'
                WHEN 3 THEN 'AVANTE'
                WHEN 4 THEN 'K3'
                WHEN 5 THEN 'SONATA'
                WHEN 6 THEN 'K5'
                WHEN 7 THEN 'SELTOS'
                WHEN 8 THEN 'SPORTAGE'
                WHEN 9 THEN 'IONIQ5'
                WHEN 10 THEN 'TESLA3'
                END,
            '-',
            LPAD(b.branch_id, 2, '0'),
            '-',
            LPAD(n.seq, 4, '0')
    ) AS vin,

    2023 + (s.spec_id % 2) AS model_year,
    'AVAILABLE',
    NULL,
    DATE_ADD('2026-01-01 10:00:00',
             INTERVAL (b.branch_id * 10 + s.spec_id + n.seq) DAY),
    10000 + (b.branch_id * 2000) + (s.spec_id * 300) + (n.seq * 1500),
    350000,
    TRUE,
    'Y',
    NULL
FROM
    (SELECT 1 spec_id UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
     SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL
     SELECT 9 UNION ALL SELECT 10) s
        CROSS JOIN
    (SELECT 2 branch_id UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) b
        CROSS JOIN
    (SELECT 1 seq UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) n;





INSERT INTO PRICE_POLICY (
    spec_id,
    branch_id,
    price_type,
    base_price,
    discount_rate,
    valid_from,
    valid_to,
    is_active,
    use_yn
)
SELECT
    s.spec_id,
    b.branch_id,
    p.price_type,
    NULL AS base_price,
    FLOOR(10 + (RAND() * 41)) AS discount_rate, -- 10 ~ 50
    NOW() AS valid_from,
    '2099-12-31' AS valid_to,
    TRUE AS is_active,
    'Y' AS use_yn
FROM
    (
        -- spec_id: 1~10 + NULL(전역)
        SELECT 1 AS spec_id UNION ALL
        SELECT 2 UNION ALL
        SELECT 3 UNION ALL
        SELECT 4 UNION ALL
        SELECT 5 UNION ALL
        SELECT 6 UNION ALL
        SELECT 7 UNION ALL
        SELECT 8 UNION ALL
        SELECT 9 UNION ALL
        SELECT 10 UNION ALL
        SELECT NULL
    ) s
        CROSS JOIN
    (
        -- branch_id: 1~5
        SELECT 1 AS branch_id UNION ALL
        SELECT 2 UNION ALL
        SELECT 3 UNION ALL
        SELECT 4 UNION ALL
        SELECT 5
    ) b
        CROSS JOIN
    (
        -- price_type
        SELECT 'DAILY' AS price_type UNION ALL
        SELECT 'MONTHLY'
    ) p;




INSERT INTO faq (category, question, answer) VALUES
                                                 ('reservation','예약은 어떻게 하나요?','카픽 홈페이지 또는 모바일 웹에서 단기렌트/장기렌트를 선택한 후, 픽업 장소와 이용 일시를 입력하고 차량을 선택해 결제를 진행하면 예약이 즉시 확정됩니다.'),
                                                 ('reservation','예약 변경·취소 규정은 어떻게 되나요?','예약 변경 및 취소는 이용 시작 전까지 가능하며, 시점에 따라 수수료가 발생할 수 있습니다. 자세한 기준은 예약 단계에서 안내되는 정책을 따릅니다.'),
                                                 ('usage','대여 자격 기준은 어떻게 되나요?','대여 가능 연령과 운전경력 기준은 상품 및 차량 종류에 따라 다를 수 있습니다.'),
                                                 ('insurance','일반자차와 완전자차의 차이는 무엇인가요?','일반자차는 사고 발생 시 고객 부담금이 발생할 수 있으며, 완전자차는 사고 시 고객 부담금이 면제되는 상품입니다.'),
                                                 ('long','장기렌트는 어떻게 신청하나요?','카픽 홈페이지 또는 모바일 웹에서 장기렌트를 선택한 후 차량과 이용 조건을 설정하고 결제를 진행하면 예약이 즉시 확정됩니다.'),
                                                 ('short','단기렌트 대여 조건은 무엇인가요?','단기렌트 이용 조건은 상품 및 차량 종류에 따라 다를 수 있습니다.'),
                                                 ('etc','고객센터 운영시간은 어떻게 되나요?','고객센터는 정해진 운영 시간 내에 상담이 가능합니다.');






INSERT INTO `event`
(id, title, content, startDate, endDate, thumbnail, created_at, updated_at)
VALUES
    (7,'[EVENT] 오늘 예약하면 최저가 할인','<p><img src="/upload/editor/bab070ff-fe67-441d-83bd-d09accbbc0c7.png"></p>','2026-01-01','2026-02-28','9c543df7-afd5-4f25-b073-2f2a03949b0a.png','2025-12-16 15:40:29','2025-12-16 17:18:59'),
    (9,'[안내] 카픽 홈페이지 리뉴얼 OPEN!','<p><img src="/upload/editor/042b1d70-3648-4a84-b363-23a2de4dfe93.png"></p>','2025-12-16','2025-12-31','212666f5-47c6-4f93-82d6-4ae529b5045f.png','2025-12-16 17:01:10','2025-12-16 17:17:54'),
    (10,'[EVENT] 후기 작성만 해도 쿠폰 지급!','<p><img src="/upload/editor/0794122c-0562-4438-9842-0648ae8f97d6.png"></p>','2026-01-01','2026-01-31','af6554ae-df57-4739-9fc1-c235f52c6e06.png','2025-12-16 17:21:10','2025-12-16 17:21:10'),
    (12,'[EVENT] 홈페이지 신규가입 할인쿠폰 이벤트!','<p><img src="/upload/editor/dd8977be-0015-4f60-afa9-12437be66439.png"></p>','2025-12-01','2025-12-14','c39347f6-4b96-4ff6-8a36-d0193e5b3b96.png','2025-12-16 17:22:57','2025-12-16 17:22:57'),
    (13,'[OPEN] 카픽 부산역점 실시간 예약 가능','<p><img src="/upload/editor/adcbcc8a-4e2c-4212-a1a5-b50abb1319fa.png"></p>','2025-12-01','2026-01-15','897c5c03-368b-4e95-bb87-884aaeade275.png','2025-12-16 17:23:41','2025-12-16 17:23:41'),
    (14,'[EVENT] 홈페이지 예약하면 무제한 포인트 적립!','<p><img src="/upload/editor/3acbfbf7-6687-43be-ae96-fe72aed2b234.png"></p>','2025-12-21','2026-02-28','f333814f-f616-431e-bc80-0ef6ee226911.png','2025-12-16 17:25:21','2025-12-16 17:25:21');


COMMIT;
