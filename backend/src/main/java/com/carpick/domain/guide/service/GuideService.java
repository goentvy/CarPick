package com.carpick.domain.guide.service;

import com.carpick.domain.guide.dto.GuideDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GuideService {

    public List<GuideDto> getGuide() {

        return List.of(

            new GuideDto(
                1,
                "예약 전 필수 확인 사항✅",
                List.of(
                    new GuideDto.Section(
                        "운전 자격 및 조건 확인",
                        List.of(
                            "운전면허: 국내 면허 또는 국제 운전면허증 소지 여부 확인",
                            "운전 경력/나이: 만 21세 이상, 운전 경력 1년 이상"
                        )
                    ),
                    new GuideDto.Section(
                        "보험 및 보장 범위",
                        List.of(
                            "자차 보험(CDW/LDW): 자기부담금 및 면책 범위 확인",
                            "대인/대물/자손 보험: 기본 포함 여부 및 보상 한도 확인",
                            "추가 보험 옵션: 완전 자차, 긴급 출동 서비스 등"
                        )
                    ),
                    new GuideDto.Section(
                        "요금 및 계약 조건",
                        List.of(
                            "총 요금 포함 내역 확인 (대여료, 보험료, 세금 등)",
                            "취소 및 변경 수수료 규정 사전 확인"
                        )
                    )
                )
            ),

            new GuideDto(
                2,
                "차량 인수 시 (출발 전)✅",
                List.of(
                    new GuideDto.Section(
                        "필수 서류 지참",
                        List.of(
                            "예약 확인서, 운전면허증, 신분증, 결제 카드 지참"
                        )
                    ),
                    new GuideDto.Section(
                        "차량 상태 점검",
                        List.of(
                            "외관 흠집 및 파손 부위 직원과 함께 확인",
                            "휠, 범퍼, 사이드 미러 등 사진 촬영"
                        )
                    ),
                    new GuideDto.Section(
                        "연료 및 연락처 확인",
                        List.of(
                            "연료량 및 반납 방식 확인",
                            "사고/고장 시 긴급 연락처 저장"
                        )
                    )
                )
            ),

            new GuideDto(
                3,
                "차량 이용 중 유의 사항✅",
                List.of(
                    new GuideDto.Section(
                        "교통 법규 준수",
                        List.of(
                            "속도 제한 및 주정차 규정 준수",
                            "지역별 교통 법규 숙지"
                        )
                    ),
                    new GuideDto.Section(
                        "사고 발생 시",
                        List.of(
                            "차량을 안전한 곳으로 이동 후 부상자 확인",
                            "경찰, 보험사, 렌터카 업체에 즉시 연락",
                            "업체 허락 없이 임의 합의 금지"
                        )
                    ),
                    new GuideDto.Section(
                        "차량 이용 제한",
                        List.of(
                            "금연 차량 원칙 준수",
                            "반려동물 탑승 제한 및 추가 비용 여부 확인"
                        )
                    )
                )
            ),

            new GuideDto(
                4,
                "차량 반납 시 (도착 후)✅",
                List.of(
                    new GuideDto.Section(
                        "연료 충전",
                        List.of(
                            "계약 조건에 따라 주유 후 반납",
                            "주유 미이행 시 추가 요금 발생 가능"
                        )
                    ),
                    new GuideDto.Section(
                        "차량 상태 재확인",
                        List.of(
                            "인수 시 기록된 손상 외 추가 손상 여부 확인",
                            "새로운 손상 발생 시 보험 처리 안내 받기"
                        )
                    ),
                    new GuideDto.Section(
                        "반납 절차 완료",
                        List.of(
                            "차량 내 개인 물품 확인",
                            "반납 확인서 또는 영수증 수령 및 보관"
                        )
                    )
                )
            )
        );
    }
}