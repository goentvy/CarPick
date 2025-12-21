/* =========================================================
   AllInOne Rentcar Schema (MariaDB Compatible)
   - FK/INDEX 뒤에 COMMENT 붙이지 않음
   - created_at/updated_at: CURRENT_TIMESTAMP 통일
   ========================================================= */
use carpick;
SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;

/* ==================================================
   1. 기초 정보 테이블 (독립적인 테이블들)
   ================================================== */


/* =========================================
   차량 스펙/모델 정보 (가격 컬럼 없음)
   - 검색필터: car_class, fuel_type, seating_capacity, model_year_base
   - AI Pick 대응: ai_keywords
   - 대표이미지: main_image_url + img_url(호환/확장)
   - 변속기: transmission_type (AUTO/MANUAL/EV_SINGLE)
   ========================================= */

CREATE TABLE IF NOT EXISTS CAR_SPEC (
                                        spec_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '모델 고유 ID',

    /* 기본 모델/분류 */
                                        brand VARCHAR(50) NOT NULL COMMENT '브랜드 (현대, 기아, 테슬라 등)',
                                        model_name VARCHAR(100) NOT NULL COMMENT '모델명 (소나타, 아반떼 등)',
                                        car_class VARCHAR(20) NOT NULL COMMENT '차량등급/차급 (경형/소형/준중형/중형/대형/수입/SUV/승합RV 등 UI 기준)',
                                        model_year_base SMALLINT NOT NULL COMMENT '대표 연식(예: 2024) - 필터 범위검색용',

    /* 파워트레인/변속 */
                                        fuel_type VARCHAR(20) NOT NULL COMMENT '연료/구동 (휘발유/경유/LPG/전기/하이브리드/수소)',
                                        transmission_type VARCHAR(20) NOT NULL DEFAULT 'AUTO'
                                            COMMENT '변속기 (AUTO/MANUAL/EV_SINGLE) - EV는 EV_SINGLE로 단순화',

    /* 수용/제원(필터 및 카드/상세 노출용) */
                                        seating_capacity INT NOT NULL COMMENT '승차 정원',
                                        trunk_capacity VARCHAR(50) NULL COMMENT '적재 공간 설명(예: 넓은 트렁크)',
                                        fuel_efficiency VARCHAR(50) NULL COMMENT '연비(예: 12km/L, 5km/kWh 등 단순 문자열)',

    /* 이미지/마케팅 */
                                        main_image_url VARCHAR(255) NULL COMMENT '차량 대표 이미지 URL(카드/상세 상단)',
                                        img_url VARCHAR(500) NULL COMMENT '대표 이미지 URL(확장/호환 컬럼)',
                                        ai_keywords VARCHAR(500) NULL COMMENT 'AI 검색용 키워드/해시태그(#가족여행,#차박,#데이트 등)',

                                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
                                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

                                        UNIQUE KEY uk_car_spec (brand, model_name, model_year_base)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* =========================================
   차량 옵션 (CAR_SPEC 종속)
   - 상세페이지 옵션 리스트용
   - 아이콘은 프론트 관리(보관만 가능)
   ========================================= */

CREATE TABLE IF NOT EXISTS CAR_OPTION (
                                          option_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '옵션 ID',
                                          car_spec_id INT NOT NULL COMMENT '차량 스펙 ID',
                                          option_name VARCHAR(100) NOT NULL COMMENT '옵션명(예: 블루투스, 후방카메라 등)',
                                          description TEXT NULL COMMENT '옵션 상세 설명',
                                          is_highlight BOOLEAN NOT NULL DEFAULT FALSE COMMENT '주요 옵션 노출 여부',
                                          icon_url VARCHAR(255) NULL COMMENT '아이콘 이미지 URL(프론트 관리 시 NULL 가능)',

                                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
                                          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

                                          UNIQUE KEY uk_car_option (car_spec_id, option_name),
                                          CONSTRAINT fk_car_option_spec
                                              FOREIGN KEY (car_spec_id) REFERENCES CAR_SPEC(spec_id)
                                                  ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/* =========================================
   가격 정책 (MVP: DAILY / MONTHLY 기준)
   - 기간별(valid_from~to) 가격 관리 가능 (성수기 대응)
   - 지점별(branch_id) 차등 가격 관리 가능
   ========================================= */
CREATE TABLE IF NOT EXISTS PRICE_POLICY (
                                            price_policy_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '가격정책 ID',

                                            spec_id INT NOT NULL COMMENT '차량 스펙(모델) ID',
                                            branch_id INT NULL COMMENT '지점 ID(NULL이면 전국 공통가)',

                                            unit_type ENUM('DAILY','MONTHLY') NOT NULL COMMENT '요금 단위',
                                            base_price INT NOT NULL COMMENT '기본요금(단위당)',

    /* 유효 기간 관리 (이게 신의 한 수!) */
                                            valid_from DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '적용 시작일',
                                            valid_to DATETIME NULL COMMENT '적용 종료일(NULL=무기한)',
                                            is_active BOOLEAN NOT NULL DEFAULT TRUE,

                                            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                            INDEX idx_price_lookup (spec_id, branch_id, unit_type, is_active),

                                            CONSTRAINT fk_price_policy_spec
                                                FOREIGN KEY (spec_id) REFERENCES CAR_SPEC(spec_id) ON DELETE CASCADE,
                                            CONSTRAINT fk_price_policy_branch
                                                FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* =========================================
   보험 옵션 (JSON insuranceOptions[] 매핑)
   - code/label/summaryLabel/extraDailyPrice/desc/default
   - (+) 자기부담금 계산을 위한 deductible_amount 추가
   ========================================= */
CREATE TABLE IF NOT EXISTS INSURANCE (
                                         insurance_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '보험 옵션 ID',

                                         code VARCHAR(30) NOT NULL COMMENT '보험 코드(NONE, STANDARD, COMPLETE)',
                                         label VARCHAR(50) NOT NULL COMMENT '표시 라벨(일반자차, 완전자차)',
                                         summary_label VARCHAR(100) NULL COMMENT '요약 라벨(고객부담금 30만원 등)',

                                         extra_daily_price INT NOT NULL DEFAULT 0 COMMENT '일 추가금(원)',

    /* ★ 시스템 계산용 추가 컬럼 (화면엔 안 뿌려도 로직엔 필요) */
                                         deductible_amount INT NOT NULL DEFAULT 0 COMMENT '사고 시 자기부담금(0=완전자차)',

                                         description TEXT NULL COMMENT '설명',
                                         is_default BOOLEAN NOT NULL DEFAULT FALSE COMMENT '기본 선택 여부',

                                         is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '사용 여부',

                                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                         updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                         UNIQUE KEY uk_insurance_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ==================================================
   BRANCH (지점 마스터 / 정적정보)
   - 지점의 "책임"은 추상값이 아니라
     "서비스 제공 가능 여부(can_*) + 정책(delivery_radius_km)"로 구현
   ================================================== */
CREATE TABLE IF NOT EXISTS BRANCH (
                                      branch_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '지점 고유번호',
                                      branch_code VARCHAR(20) NOT NULL COMMENT '지점 코드',
                                      branch_name VARCHAR(100) NOT NULL COMMENT '지점명',

                                      address_basic VARCHAR(255) NOT NULL COMMENT '기본 주소',
                                      address_detail VARCHAR(255) NULL COMMENT '상세 주소',
                                      phone VARCHAR(20) NOT NULL COMMENT '전화번호',

    /* 운영시간(로직용) */
                                      open_time TIME NULL COMMENT '운영 시작 시간',
                                      close_time TIME NULL COMMENT '운영 종료 시간',

    /* 표시용(프론트 문구) */
                                      business_hours VARCHAR(255) NULL COMMENT '영업시간 텍스트(표시용: 주말/공휴일 휴무 등)',

    /* 지도/거리 계산(딜리버리 반경 계산 등) */
                                      latitude DECIMAL(10,8) NULL COMMENT '위도',
                                      longitude DECIMAL(11,8) NULL COMMENT '경도',

    /* 검색/필터용 (서울/경기/제주 등) - 1차 MVP */
                                      region_dept1 VARCHAR(50) NULL COMMENT '지역 검색 필터(서울/경기/제주)',

    /* 예약/서비스 활성화 */
                                      is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '예약 가능 여부(1=가능,0=불가)',

    /* ---- 지점 역할/책임 -> "가능 여부" 플래그로 구현 ---- */
                                      can_manage_inventory_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '재고/주차 운영 가능(Y/N)',
                                      can_manage_vehicle_status_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '차량상태(정비/세차/점검) 처리 가능(Y/N)',
                                      can_pickup_return_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '인수/반납 운영 가능(Y/N)',
                                      can_delivery_yn CHAR(1) NOT NULL DEFAULT 'N' COMMENT '딜리버리(배달/수거) 제공 여부(Y/N)',

    /* 딜리버리 가능구역(1차 MVP: 반경 km) */
                                      delivery_radius_km INT NULL COMMENT '딜리버리 가능 반경(km). can_delivery_yn=Y일 때 사용',

                                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
                                      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

                                      UNIQUE KEY uk_branch_code (branch_code),
                                      INDEX idx_branch_region (region_dept1),
                                      INDEX idx_branch_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* ==================================================
   BRANCH_SERVICE_POINT (지점 내 "고정 포인트")
   - 역/공항 데스크/주차장 구역 등 "항상 고정된" 픽업/반납 장소
   - 딜리버리/수거의 "고객 주소"는 RESERVATION.pickup_address/return_address에 저장
   ================================================== */
CREATE TABLE IF NOT EXISTS BRANCH_SERVICE_POINT (
                                                    point_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '지점 내 장소 고유 ID',
                                                    branch_id INT NOT NULL COMMENT '지점 ID',

                                                    point_name VARCHAR(100) NOT NULL COMMENT '장소명(예: 강남역 1번출구 데스크)',
                                                    service_type ENUM('PICKUP','RETURN') NOT NULL COMMENT '포인트 타입(PICKUP/RETURN)',

    /* 업무 가능 시간(로직용) */
                                                    service_start_time TIME NULL COMMENT '업무 시작 시간',
                                                    service_end_time TIME NULL COMMENT '업무 종료 시간',

    /* 표시용 */
                                                    service_hours VARCHAR(100) NULL COMMENT '업무 가능 시간 텍스트(표시용)',

                                                    location_desc TEXT NULL COMMENT '상세 위치 설명',
                                                    walking_time INT NULL COMMENT '도보 소요 시간(분)',

                                                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
                                                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

                                                    CONSTRAINT fk_point_branch
                                                        FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)
                                                            ON UPDATE CASCADE ON DELETE CASCADE,

                                                    INDEX idx_point_branch_type (branch_id, service_type)
    /* 지점당 PICKUP 1개, RETURN 1개로 고정하고 싶으면 아래 UNIQUE를 켜세요.
       UNIQUE KEY uk_point_branch_type (branch_id, service_type)
    */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/* ==================================================
   2. 종속 정보 테이블 (FK 연결)
   ================================================== */



/* 가격 테이블 (CAR_SPEC 종속) */
CREATE TABLE IF NOT EXISTS PRICE (
                                     price_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '요금표 ID',
                                     car_spec_id INT NOT NULL COMMENT '차량 스펙 ID',

                                     standard_price INT NOT NULL DEFAULT 0 COMMENT '표준 대여료 (1일)',
                                     price_1m INT DEFAULT 0 COMMENT '1개월 렌트가',
                                     price_3m INT DEFAULT 0 COMMENT '3개월 렌트가',
                                     price_6m INT DEFAULT 0 COMMENT '6개월 렌트가',

                                     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (수정)',
                                     updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (수정)',

                                     FOREIGN KEY (car_spec_id) REFERENCES CAR_SPEC(spec_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




/* ==================================================
   3. 핵심 비즈니스 테이블 (재고 및 예약)
   ================================================== */

/* =========================================
   차량 재고(실물차/인벤토리)
   - 실제 지점에 존재하고 예약되는 단위(차 1대)
   - CAR_SPEC(모델)과 BRANCH(소속지점)에 종속
   ========================================= */

CREATE TABLE IF NOT EXISTS VEHICLE_INVENTORY (
                                                 vehicle_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '차량(실물차) ID',

                                                 spec_id INT NOT NULL COMMENT '차량 스펙(모델) ID',
                                                 branch_id INT NOT NULL COMMENT '현재 소속 지점 ID',

    /* 실물차 고유 식별 */
                                                 vehicle_no VARCHAR(30) NOT NULL COMMENT '차량 번호판(예: 12가3456)',
                                                 vin VARCHAR(50) NULL COMMENT '차대번호(VIN)',
                                                 color VARCHAR(30) NULL COMMENT '차량 색상',
                                                 model_year SMALLINT NULL COMMENT '실차 연식(예: 2023) - spec 대표연식과 다를 수 있음',

    /* 운영 상태(빠른 조회용) */
                                                 operational_status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
                                                     COMMENT '운영상태(AVAILABLE/RESERVED/RENTED/MAINTENANCE/INACTIVE 등)',

                                                 mileage INT NULL COMMENT '주행거리(km)',
                                                 last_inspected_at DATETIME NULL COMMENT '최근 점검일',

                                                 is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '운영/노출 여부',

                                                 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
                                                 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

                                                 UNIQUE KEY uk_vehicle_no (vehicle_no),
                                                 INDEX idx_vehicle_branch (branch_id),
                                                 INDEX idx_vehicle_spec (spec_id),
                                                 INDEX idx_vehicle_status (operational_status),

                                                 CONSTRAINT fk_vehicle_spec
                                                     FOREIGN KEY (spec_id) REFERENCES CAR_SPEC(spec_id)
                                                         ON UPDATE CASCADE ON DELETE RESTRICT,

                                                 CONSTRAINT fk_vehicle_branch
                                                     FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)
                                                         ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




CREATE TABLE IF NOT EXISTS VEHICLE_STATUS_HISTORY (
                                                      history_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '이력 ID',

                                                      vehicle_id INT NOT NULL COMMENT '차량 ID (FK)',
                                                      branch_id INT NOT NULL COMMENT '이벤트 발생 지점 ID (FK) - 책임 소재',

                                                      status_prev ENUM('AVAILABLE','RESERVED','RENTED','MAINTENANCE','INACTIVE') NULL
                                                          COMMENT '변경 전 상태(NULL=최초등록)',
                                                      status_curr ENUM('AVAILABLE','RESERVED','RENTED','MAINTENANCE','INACTIVE') NOT NULL
                                                          COMMENT '변경 후 상태',

                                                      mileage INT NULL COMMENT '시점 주행거리(km)',
                                                      fuel_level INT NULL COMMENT '연료/배터리 잔량(%)',

                                                      comments TEXT NULL COMMENT '비고/정비내용/스크래치 위치 등',
                                                      photo_url VARCHAR(255) NULL COMMENT '증빙 사진 URL',

                                                      manager_id VARCHAR(50) NULL COMMENT '처리 담당자 ID/이름',
                                                      recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '기록 일시',

                                                      CONSTRAINT fk_vsh_vehicle
                                                          FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id)
                                                              ON UPDATE CASCADE ON DELETE CASCADE,

                                                      CONSTRAINT fk_vsh_branch
                                                          FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)
                                                              ON UPDATE CASCADE ON DELETE RESTRICT,

                                                      INDEX idx_vehicle_history_lookup (vehicle_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/* =========================================================
   RESERVATION
   - 렌터카 비즈니스 핵심 트랜잭션
   - 가격/보험/할인은 예약 시점 스냅샷으로 영구 보존
   - VISIT / DELIVERY / COLLECTION 흐름 대응
   ========================================================= */

CREATE TABLE IF NOT EXISTS RESERVATION (
                                           reservation_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '내부 관리 ID',
                                           reservation_no VARCHAR(50) NOT NULL COMMENT '예약번호 (고객용, UNIQUE)',

    /* 1) 관계 (WHO & WHAT) */
                                           user_id INT NOT NULL COMMENT '예약자(회원) ID',
                                           vehicle_id INT NOT NULL COMMENT '차량 ID (실물차: VEHICLE_INVENTORY)',

    /* 2) 운전자 정보 스냅샷 */
                                           driver_name VARCHAR(60) NOT NULL COMMENT '운전자 성명',
                                           driver_birthdate DATE NOT NULL COMMENT '운전자 생년월일',
                                           driver_phone VARCHAR(20) NOT NULL COMMENT '운전자 휴대폰',
                                           driver_license_no VARCHAR(30) NULL COMMENT '면허번호',
                                           driver_license_expiry DATE NULL COMMENT '면허 만료일',
                                           driver_verified_yn CHAR(1) NOT NULL DEFAULT 'N' COMMENT '면허/본인 인증 여부(Y/N)',

    /* 3) 일정 (WHEN) */
                                           start_date DATETIME NOT NULL COMMENT '대여 시작 일시',
                                           end_date DATETIME NOT NULL COMMENT '반납 예정 일시',
                                           actual_return_date DATETIME NULL COMMENT '실제 반납 완료 일시',

    /* 4) 장소 및 방법 (WHERE & HOW)
       - 담당 지점은 항상 지정 (운영 주체)
       - VISIT  → address NULL
       - DELIVERY / COLLECTION → address NOT NULL (서비스에서 검증)
    */
                                           pickup_type ENUM('VISIT','DELIVERY') NOT NULL DEFAULT 'VISIT' COMMENT '인수 방법',
                                           pickup_branch_id INT NOT NULL COMMENT '인수 담당 지점 ID',
                                           pickup_address VARCHAR(255) NULL COMMENT '배달 시 고객 주소',

                                           return_type ENUM('VISIT','COLLECTION') NOT NULL DEFAULT 'VISIT' COMMENT '반납 방법',
                                           return_branch_id INT NOT NULL COMMENT '반납 담당 지점 ID',
                                           return_address VARCHAR(255) NULL COMMENT '수거 시 고객 주소',

    /* 5) 보험 및 가격 스냅샷 (HOW MUCH) */
                                           insurance_id INT NOT NULL COMMENT '선택한 보험 상품 ID',

    /* 대여료 스냅샷 */
                                           base_rent_fee_snapshot INT NOT NULL COMMENT '원 대여료(할인 전, 스냅샷)',
                                           rent_discount_amount_snapshot INT NOT NULL DEFAULT 0 COMMENT '대여료 할인 금액(스냅샷)',
                                           applied_rent_fee_snapshot INT NOT NULL COMMENT '적용된 대여료(할인 후, 스냅샷)',

    /* 보험료 스냅샷 */
                                           base_insurance_fee_snapshot INT NOT NULL COMMENT '원 보험료(할인 전, 스냅샷)',
                                           insurance_discount_amount_snapshot INT NOT NULL DEFAULT 0 COMMENT '보험 할인 금액(스냅샷)',
                                           applied_insurance_fee_snapshot INT NOT NULL COMMENT '적용된 보험료(할인 후, 스냅샷)',
                                           member_grade_code_snapshot VARCHAR(20) NULL COMMENT '예약 당시 회원등급(스냅샷)',
                                         member_discount_rate_snapshot DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '예약 당시 회원할인율%(스냅샷)',

    /* 이벤트/쿠폰 스냅샷 */
                                           event_discount_amount_snapshot INT NOT NULL DEFAULT 0 COMMENT '이벤트/쿠폰 할인 금액(스냅샷)',

    /* 최종 결제 금액 스냅샷 */
                                           total_amount_snapshot INT NOT NULL COMMENT '총 결제 금액(스냅샷, 최종)',

    /* 6) 약관 동의 (JSON agreement 대응) */
                                           agreement_yn CHAR(1) NOT NULL DEFAULT 'Y' COMMENT '약관 동의 여부(Y/N)',

    /* 7) 예약 상태 (Lifecycle) */
                                           status ENUM('PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELED')
                                               NOT NULL DEFAULT 'PENDING' COMMENT '예약 상태',
                                           cancel_reason VARCHAR(255) NULL COMMENT '취소 사유',
                                           cancelled_at DATETIME NULL COMMENT '취소 일시',

                                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                           updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    /* 인덱스 */
                                           UNIQUE KEY uk_reservation_no (reservation_no),
                                           INDEX idx_res_vehicle_period (vehicle_id, start_date, end_date),
                                           INDEX idx_res_pickup_branch_period (pickup_branch_id, start_date, end_date),
                                           INDEX idx_res_return_branch_period (return_branch_id, start_date, end_date),

    /* FK 제약 */
                                           CONSTRAINT fk_reservation_vehicle
                                               FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id)
                                                   ON UPDATE CASCADE ON DELETE RESTRICT,

                                           CONSTRAINT fk_reservation_pickup_branch
                                               FOREIGN KEY (pickup_branch_id) REFERENCES BRANCH(branch_id)
                                                   ON UPDATE CASCADE ON DELETE RESTRICT,

                                           CONSTRAINT fk_reservation_return_branch
                                               FOREIGN KEY (return_branch_id) REFERENCES BRANCH(branch_id)
                                                   ON UPDATE CASCADE ON DELETE RESTRICT,

                                           CONSTRAINT fk_reservation_insurance
                                               FOREIGN KEY (insurance_id) REFERENCES INSURANCE(insurance_id)
                                                   ON UPDATE CASCADE ON DELETE RESTRICT

    /* USERS FK는 로그인 파트 완료 후 연결
    ,CONSTRAINT fk_reservation_user
        FOREIGN KEY (user_id) REFERENCES USERS(user_id)
        ON UPDATE CASCADE ON DELETE RESTRICT
    */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* =========================================
   예약 상태 이력 (RESERVATION 종속)
   - 마이페이지 타임라인/운영 추적용
   ========================================= */
CREATE TABLE IF NOT EXISTS RESERVATION_STATUS_HISTORY (
                                                          history_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '예약 상태 이력 ID',

                                                          reservation_id INT NOT NULL COMMENT '예약 ID (FK)',
                                                          status_prev ENUM('PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELED') NULL
                                                              COMMENT '변경 전 상태(NULL=최초)',
                                                          status_curr ENUM('PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELED') NOT NULL
                                                              COMMENT '변경 후 상태',

                                                          reason VARCHAR(255) NULL COMMENT '변경 사유(취소사유/운영메모)',
                                                          actor_type VARCHAR(20) NULL COMMENT '변경 주체(USER/ADMIN/SYSTEM)',
                                                          actor_id VARCHAR(50) NULL COMMENT '변경자 ID(회원/관리자 식별자)',

                                                          recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '기록 일시',

                                                          CONSTRAINT fk_rsh_reservation
                                                              FOREIGN KEY (reservation_id) REFERENCES RESERVATION(reservation_id)
                                                                  ON UPDATE CASCADE ON DELETE CASCADE,

                                                          INDEX idx_rsh_lookup (reservation_id, recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* 회원 등급(정책) */
# CREATE TABLE IF NOT EXISTS MEMBER_GRADE (
#                                             grade_code VARCHAR(20) PRIMARY KEY COMMENT '등급 코드 (BRONZE/SILVER/GOLD/VIP)',
#                                             grade_name VARCHAR(50) NOT NULL COMMENT '등급명',
#                                             discount_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '할인율(%) 예: 5.00',
#                                             is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '사용 여부',
#                                             created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
#                                             updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
# ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
