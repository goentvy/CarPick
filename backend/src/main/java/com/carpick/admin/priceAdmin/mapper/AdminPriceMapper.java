package com.carpick.admin.priceAdmin.mapper;

import com.carpick.admin.priceAdmin.dto.AdminPriceDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminPriceMapper {
    /**
     * [1] 전체 목록 조회
     * - 차종별로 단기/장기 원가와 할인율 정보를 조인하여 가져옵니다.
     * - 화면의 메인 리스트를 구성하는 데이터를 제공합니다.
     */
    List<AdminPriceDto> selectList();

    /**
     * [2] 단건 조회
     * - 특정 차종(carSpecId)에 대한 가격 정보를 상세히 조회합니다.
     * - 수정 후 데이터 검증이나 상세 페이지 이동 시 사용됩니다.
     */
    AdminPriceDto selectBySpecId(@Param("specId") Long SpecId);


// ==========================================
    // ⬇️ [추가] 신규 등록 (Insert) 메서드
    // ==========================================

    /** [5] 기본 가격 신규 등록 (Insert) */
    int insertPrice(AdminPriceDto dto);


    /** 🔹 낙관적 락 적용 업데이트 */
    int updatePriceWithVersion(AdminPriceDto dto);
// ======================================================
//  [가격 상태 제어용 - 보험성 기능]
//  ※ 가격 데이터는 원칙적으로 삭제하지 않는다.
//  ※ 값 자체를 바꾸지 않고, '상태(use_yn)'만 전환하여
//    즉시 노출/판매를 차단하거나 복구하기 위한 용도이다.
// ======================================================
//[보험용] 가격 논리 삭제(비활성) + 낙관적 락
// *
// * 사용 목적:
// * - 가격 입력 실수 발생 시, 값 수정 전에 즉시 노출/판매 차단
// * - 운영 이슈로 특정 가격을 잠시 숨겨야 할 때
// * - 가격 값 자체는 보존하고, 상태만 변경하여 데이터 오염을 방지
//     동작 방식:
// * - use_yn = 'N'
// * - deleted_at = NOW()
// * - version = version + 1

    int softDeletePrice(@Param("priceId") Long priceId,
                        @Param("version") Integer version);

//     [보험용] 가격 복구(재활성) + 낙관적 락
// *
// * 사용 목적:
// * - 임시로 비활성화했던 가격을 다시 정상 상태로 복구
// * - QA/데모 종료 후 원래 가격 재노출
// * - 실수로 비활성 처리한 경우의 안전한 원복 수단
//* 동작 방식:
// * - use_yn = 'Y'
// * - deleted_at = NULL
// * - version = version + 1
int restorePrice(@Param("priceId") Long priceId,
                 @Param("version") Integer version);



}
