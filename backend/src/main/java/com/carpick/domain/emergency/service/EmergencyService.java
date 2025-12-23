package com.carpick.domain.emergency.service;

import com.carpick.domain.emergency.dto.EmergencyDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyService {

    public List<EmergencyDto> getEmergencyServices() {
        return List.of(
            new EmergencyDto(
                "잠금 해제 서비스",
                "차 안에 열쇠를 두고 문을 잠가버린 경우 차량 문을 열어주는 서비스"
            ),
            new EmergencyDto(
                "타이어 펑크 지원 및 교체 / 견인",
                "스페어 타이어 교체 또는 정비소·주유소로 견인"
            ),
            new EmergencyDto(
                "배터리 방전 점프스타트",
                "배터리 방전 시 점프스타트로 시동 지원"
            ),
            new EmergencyDto(
                "연료 배송 / 연료 보충",
                "연료 부족 시 최소 주행 가능한 연료 공급"
            ),
            new EmergencyDto(
                "사고 / 고장 견인",
                "사고·고장으로 주행 불가 시 지정 장소까지 견인"
            ),
            new EmergencyDto(
                "24시간 긴급출동 로드서비스",
                "연중무휴 또는 지정 시간 내 긴급 출동 지원"
            )
        );
    }
}
