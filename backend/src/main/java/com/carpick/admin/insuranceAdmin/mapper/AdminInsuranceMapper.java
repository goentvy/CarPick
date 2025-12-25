package com.carpick.admin.insuranceAdmin.mapper;

import com.carpick.admin.insuranceAdmin.dto.AdminInsuranceDto;
import com.carpick.domain.insurance.enums.InsuranceCode;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminInsuranceMapper {

    /**
     * 보험 목록 조회
     * - use_yn = 'Y'인 것만 조회 (삭제되지 않은 데이터)
     * - sort_order 오름차순 정렬 (숫자 낮을수록 위에 표시)
     *
     * @return 보험 목록
     */
    List<AdminInsuranceDto> selectList();

    /**
     * 보험 단건 조회
     * - use_yn = 'Y'인 것만 조회
     *
     * @param insuranceId 보험 ID (PK)
     * @return 보험 정보 (없으면 null)
     */
    AdminInsuranceDto selectById(@Param("insuranceId") Long insuranceId);

    /**
     * 보험 등록
     * - useGeneratedKeys로 생성된 PK를 dto.insuranceId에 자동 세팅
     *
     * @param dto 등록할 보험 정보
     */
    int insert(AdminInsuranceDto dto);

    /**
     * 보험 수정
     * - use_yn = 'Y'인 데이터만 수정 가능
     *
     * @param dto 수정할 보험 정보 (insuranceId 필수)
     * @return 수정된 row 수 (정상이면 1, 없으면 0)
     */
    int update(AdminInsuranceDto dto);

    /**
     * 보험 Soft Delete (논리 삭제)
     * - 실제 DELETE가 아닌 use_yn = 'N', deleted_at = NOW() 처리
     * - 데이터는 남아있고, 조회에서만 제외됨
     *
     * @param insuranceId 삭제할 보험 ID
     * @return 삭제된 row 수 (정상이면 1, 없으면 0)
     */
    int softDelete(@Param("insuranceId") Long insuranceId);

    /**
     * 삭제된 동일 데이터 조회 (code 기준)
     * - 신규 등록 시, 이미 삭제된 같은 code가 있는지 확인
     * - 있으면 복구(restore) 후 update 처리
     *
     * @param insuranceCode 보험 코드 (NONE / STANDARD / FULL)
     * @return 삭제된 보험 정보 (없으면 null)
     */
    AdminInsuranceDto selectDeletedByCode( InsuranceCode insuranceCode);

    /**
     * 보험 복구 (Soft Delete 취소)
     * - use_yn = 'Y', deleted_at = NULL 처리
     * - 삭제된 데이터를 다시 살릴 때 사용
     *
     * @param insuranceId 복구할 보험 ID
     * @return 복구된 row 수 (정상이면 1, 없으면 0)
     */
    int restore(@Param("insuranceId") Long insuranceId);

    /**
     * 참조 체크: 이 보험을 사용 중인 예약이 있는지 확인
     * - 삭제 전에 호출하여 참조 무결성 체크
     * - 예약이 있으면 삭제 불가 처리
     *
     * @param insuranceId 확인할 보험 ID
     * @return 이 보험을 사용 중인 예약 수
     */
    int countReservationByInsuranceId(@Param("insuranceId") Long insuranceId);


}
