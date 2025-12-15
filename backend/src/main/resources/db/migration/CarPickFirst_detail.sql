/* =========================================================
   AllInOne Rentcar Schema (MariaDB Compatible)
   - FK/INDEX 뒤에 COMMENT 붙이지 않음
   - created_at/updated_at: CURRENT_TIMESTAMP 통일
   ========================================================= */

SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;

/* ==================================================
   1. 기초 정보 테이블 (독립적인 테이블들)
   ================================================== */


    use carpick;
/* 차량 스펙/모델 정보 */
CREATE TABLE IF NOT EXISTS CAR_SPEC (
                                        spec_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '모델 고유 ID',
                                        brand VARCHAR(50) NOT NULL COMMENT '브랜드 (현대, 기아)',
                                        model_name VARCHAR(100) NOT NULL COMMENT '모델명 (소나타, 아반떼)',
                                        car_class VARCHAR(20) NOT NULL COMMENT '차급 (경차, SUV, 대형)',
                                        fuel_type VARCHAR(20) NOT NULL COMMENT '연료 (가솔린, 전기, 하이브리드)',
                                        model_year_base VARCHAR(4) NOT NULL COMMENT '대표 연식 (구형/신형 구분용)',
                                        seating_capacity INT NOT NULL COMMENT '승차 정원',
                                        trunk_capacity VARCHAR(50) COMMENT '적재 공간 설명',
                                        fuel_efficiency VARCHAR(50) COMMENT '연비',
                                        release_price INT COMMENT '신차 출고가',

                                        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (수정)',
                                        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (수정)',

                                        UNIQUE KEY uk_car_spec (brand, model_name, model_year_base) COMMENT '모델 중복 방지 (수정)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* 할인/이벤트 정책 */
CREATE TABLE IF NOT EXISTS PRICE_POLICY (
                                            policy_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '정책 고유번호',
                                            policy_name VARCHAR(100) NOT NULL COMMENT '정책명',
                                            discount_type VARCHAR(20) NOT NULL COMMENT '할인 유형 (FIXED=원/RATE=%) (수정)',
                                            discount_value INT NOT NULL DEFAULT 0 COMMENT '할인값',
                                            min_duration INT DEFAULT 0 COMMENT '적용 최소 기간 (일)',
                                            is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '활성화 여부',

                                            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (수정)',
                                            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (수정)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* 보험 상품 */
CREATE TABLE IF NOT EXISTS INSURANCE (
                                         insurance_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '보험 고유번호',
                                         insurance_name VARCHAR(100) NOT NULL COMMENT '보험 상품명',
                                         coverage_details TEXT COMMENT '보장 내역 설명',
                                         daily_premium INT NOT NULL COMMENT '1일 보험료',
                                         target_car_class VARCHAR(50) COMMENT '적용 차종 등급',

                                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (수정)',
                                         updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (수정)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* 지점 정보 */
CREATE TABLE IF NOT EXISTS BRANCH (
                                      branch_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '지점 고유번호',
                                      branch_code VARCHAR(20) NOT NULL UNIQUE COMMENT '지점 코드',
                                      branch_name VARCHAR(100) NOT NULL COMMENT '지점명',
                                      address_basic VARCHAR(255) NOT NULL COMMENT '기본 주소',
                                      address_detail VARCHAR(255) COMMENT '상세 주소',
                                      phone VARCHAR(20) NOT NULL COMMENT '전화번호',

                                      open_time TIME COMMENT '운영 시작 시간',
                                      close_time TIME COMMENT '운영 종료 시간',
                                      business_hours VARCHAR(255) COMMENT '영업시간 텍스트(예: 주말/공휴일 휴무 등 표시용)',

                                      latitude DECIMAL(10,8) COMMENT '위도',
                                      longitude DECIMAL(11,8) COMMENT '경도',
                                      region_code VARCHAR(20) COMMENT '지역코드',
                                      region_name VARCHAR(50) COMMENT '지역명',
                                      is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '예약 가능 여부',

                                      region_dept1 VARCHAR(50) COMMENT '지역 검색 필터(서울/경기/제주)',

                                      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (수정)',
                                      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (수정)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/* ==================================================
   2. 종속 정보 테이블 (FK 연결)
   ================================================== */

/* 차량 옵션 (CAR_SPEC 종속) */
CREATE TABLE IF NOT EXISTS CAR_OPTION (
                                          option_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '옵션 ID',
                                          car_spec_id INT NOT NULL COMMENT '차량 스펙 ID',
                                          option_name VARCHAR(100) NOT NULL COMMENT '옵션명',
                                          description TEXT COMMENT '옵션 상세 설명',
                                          is_highlight BOOLEAN NOT NULL DEFAULT FALSE COMMENT '주요 옵션 노출 여부',
                                          icon_url VARCHAR(255) COMMENT '아이콘 이미지 URL',

                                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (수정)',
                                          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (수정)',

                                          UNIQUE KEY uk_car_option (car_spec_id, option_name) COMMENT '옵션 중복 방지 (수정)',
                                          FOREIGN KEY (car_spec_id) REFERENCES CAR_SPEC(spec_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


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


/* 지점 상세 서비스 장소 (BRANCH 종속) */
CREATE TABLE IF NOT EXISTS BRANCH_SERVICE_POINT (
                                                    point_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '장소 고유 ID',
                                                    branch_id INT NOT NULL COMMENT '지점 ID',
                                                    point_name VARCHAR(100) NOT NULL COMMENT '장소명',

                                                    service_start_time TIME COMMENT '업무 시작 시간 (수정)',
                                                    service_end_time TIME COMMENT '업무 종료 시간',
                                                    service_hours VARCHAR(100) COMMENT '업무 가능 시간 텍스트(표시용)',

                                                    service_type VARCHAR(20) NOT NULL COMMENT '타입 (PICKUP/RETURN)',
                                                    location_desc TEXT COMMENT '상세 위치 설명',
                                                    walking_time INT COMMENT '도보 소요 시간(분)',

                                                    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시 (수정)',
                                                    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시 (수정)',

                                                    FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



/* ==================================================
   3. 핵심 비즈니스 테이블 (재고 및 예약)
   ================================================== */

/* 차량 재고 (CAR_SPEC, PRICE, BRANCH 종속) */
CREATE TABLE IF NOT EXISTS VEHICLE_INVENTORY (
                                                 vehicle_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '개별차량 ID',
                                                 car_spec_id INT NOT NULL COMMENT '차량 스펙 (모델)',
                                                 price_id INT NOT NULL COMMENT '적용 요금표 ID',
                                                 branch_id INT NOT NULL COMMENT '현재 소속 지점 ID',

                                                 license_plate VARCHAR(20) NOT NULL UNIQUE COMMENT '차량 번호판',
                                                 color VARCHAR(20) NOT NULL COMMENT '차량 색상',
                                                 model_year VARCHAR(4) NOT NULL COMMENT '연식 (예: 2024)',
                                                 current_mileage INT NOT NULL DEFAULT 0 COMMENT '현재 총 주행거리',
                                                 status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' COMMENT '상태 (AVAILABLE, RENTED, MAINTENANCE)',

                                                 created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
                                                 updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시',

    /* FK: 차량 스펙 */
                                                 CONSTRAINT fk_vehicle_car_spec
                                                     FOREIGN KEY (car_spec_id) REFERENCES CAR_SPEC(spec_id),

    /* FK: 요금표 */
                                                 CONSTRAINT fk_vehicle_price
                                                     FOREIGN KEY (price_id) REFERENCES PRICE(price_id),

    /* FK: 지점 연결 (수정) */
                                                 CONSTRAINT fk_vehicle_branch
                                                     FOREIGN KEY (branch_id) REFERENCES BRANCH(branch_id)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- (수정) INDEX에 COMMENT를 붙이면 MariaDB에서 에러 날 수 있어서 분리 생성 권장
CREATE INDEX idx_vehicle_branch_status ON VEHICLE_INVENTORY (branch_id, status);



/* 차량 상태 이력 (VEHICLE_INVENTORY 종속) */
CREATE TABLE IF NOT EXISTS VEHICLE_STATUS_HISTORY (
                                                      history_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '이력 ID',
                                                      vehicle_id INT NOT NULL COMMENT '차량 ID',
                                                      status_prev VARCHAR(20) COMMENT '변경 전 상태',
                                                      status_curr VARCHAR(20) NOT NULL COMMENT '변경 후 상태',
                                                      comments TEXT COMMENT '비고/정비내용',
                                                      mileage INT NOT NULL DEFAULT 0 COMMENT '시점 주행거리',
                                                      fuel_level INT COMMENT '연료량 (%)',
                                                      photo_url VARCHAR(255) COMMENT '증빙 사진 URL',
                                                      recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '기록일시 (수정)',
                                                      manager_id VARCHAR(50) COMMENT '처리 담당자 ID',

                                                      FOREIGN KEY (vehicle_id) REFERENCES VEHICLE_INVENTORY(vehicle_id) ON DELETE CASCADE,
                                                      INDEX idx_vehicle_history_vehicle_time (vehicle_id, recorded_at) COMMENT '차량별 이력 조회 성능 (수정)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


/* 예약 (VEHICLE_INVENTORY 종속, USERS 종속, BRANCH/INSURANCE 연결) */
CREATE TABLE IF NOT EXISTS RESERVATION (
                                           reservation_id INT AUTO_INCREMENT PRIMARY KEY COMMENT '내부 관리 ID',
                                           reservation_no VARCHAR(50) NOT NULL COMMENT '예약번호 (고객용)',
                                           user_id INT NOT NULL COMMENT '유저 ID',
                                           vehicle_id INT NOT NULL COMMENT '차량 ID',

    /* 운전자 정보 */
                                           driver_last_name VARCHAR(30) NOT NULL COMMENT '운전자 성(Last name)',
                                           driver_first_name VARCHAR(30) NOT NULL COMMENT '운전자 이름(First name)',
                                           driver_birthdate DATE NOT NULL COMMENT '운전자 생년월일',
                                           driver_phone VARCHAR(20) NOT NULL COMMENT '운전자 휴대폰 번호',
                                           driver_email VARCHAR(100) NOT NULL COMMENT '운전자 이메일',
                                           driver_license_no VARCHAR(30) NULL COMMENT '운전면허번호',
                                           driver_license_expiry DATE NULL COMMENT '면허 유효기간(만료일)',
                                           driver_verified_yn CHAR(1) NOT NULL DEFAULT 'N' COMMENT '본인인증 여부(Y/N)',

                                           pickup_branch_id INT NOT NULL COMMENT '인수 지점 ID',
                                           return_branch_id INT NOT NULL COMMENT '반납 지점 ID',
                                           start_date DATETIME NOT NULL COMMENT '대여 시작 일시',
                                           end_date DATETIME NOT NULL COMMENT '반납 예정 일시',
                                           actual_return_date DATETIME COMMENT '실제 반납 일시',

                                           insurance_id INT NOT NULL COMMENT '보험 상품 ID',

                                           status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT '예약 상태',
                                           cancel_reason VARCHAR(255) COMMENT '취소 사유',
                                           total_amount INT NOT NULL COMMENT '결제 금액',

                                           created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                           updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                                           UNIQUE KEY uk_reservation_no (reservation_no),
                                           INDEX idx_reservation_vehicle_period (vehicle_id, start_date, end_date),
                                           INDEX idx_reservation_branch_period (pickup_branch_id, start_date, end_date),
                                           INDEX idx_reservation_return_branch_period (return_branch_id, start_date, end_date), /* (수정) 반납지점 기준 조회 대비 */

    /* FK 제약조건 */
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

    /* CONSTRAINT fk_reservation_user
        FOREIGN KEY (user_id) REFERENCES USERS(user_id)
        ON UPDATE CASCADE ON DELETE RESTRICT */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
