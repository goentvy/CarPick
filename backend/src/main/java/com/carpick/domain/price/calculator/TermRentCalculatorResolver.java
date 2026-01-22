package com.carpick.domain.price.calculator;


import com.carpick.domain.reservation.enums.RentType;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class TermRentCalculatorResolver {
//똑똑한 배차 반장  어떤 계산기를 쓸지 결정하는 책임'을 위임
    // [핵심 최적화]
    // 리스트를 매번 뒤지는 게 아니라, 미리 '표(Map)'로 정리해둡니다.
    // EnumMap은 일반 HashMap보다 속도가 훨씬 빠릅니다. (Enum 전용 최적화)
    private final Map<RentType, TermRentCalculator> map = new EnumMap<>(RentType.class);

    /**
     * [생성자: 초기 셋팅 & 검증]
     * 서버가 켜질 때 딱 한 번 실행됩니다. 여기서 모든 계산기 직원을 점검합니다.
     */
    public TermRentCalculatorResolver(List<TermRentCalculator> calculators) {

        // 1. 방어 로직: 계산기가 하나도 없으면 서버 띄우지 마라 (치명적 오류 방지)
        if (calculators == null || calculators.isEmpty()) {
            throw new IllegalStateException("TermRentCalculator 구현체가 등록되어 있지 않습니다.");
        }

        // 2. 리스트를 돌면서 Map(창구)에 배치하기
        for (TermRentCalculator c : calculators) {
            RentType type = c.supports(); // "너 무슨 담당이야?" (단기? 장기?)

            // 담당이 없는 무책임한 계산기가 있으면 에러!
            if (type == null) {
                throw new IllegalStateException("supports()가 null을 반환하는 TermRentCalculator가 있습니다: " + c.getClass().getName());
            }

            // 3. [중복 검사 - 아주 중요!]
            // 만약 '단기' 담당이 이미 앉아있는데, 또 다른 '단기' 담당이 오면? 충돌!
            // 나중에 꼬이지 않게 미리 경고하고 서버를 멈춥니다.
            if (map.containsKey(type)) {
                throw new IllegalStateException(
                        "RentType 중복 등록: " + type +
                                " / " + map.get(type).getClass().getName() +
                                " vs " + c.getClass().getName()
                );
            }

            // 검증 통과! 해당 창구(Key)에 계산기(Value) 배치
            map.put(type, c);
        }
    }

    /**
     * [실제 사용 메서드]
     * 손님이 오면 Map에서 바로 꺼내줍니다. (속도: O(1) - 즉시 찾음)
     */
    public TermRentCalculator resolve(RentType rentType) {

        // 1. null 방어: 타입이 안 들어오면 '단기(SHORT)'를 기본값으로 설정 (안전벨트)
        RentType safe = (rentType == null) ? RentType.SHORT : rentType;

        // 2. Map에서 바로 꺼내기 (반복문 X, 검색 필요 X -> 엄청 빠름)
        TermRentCalculator calculator = map.get(safe);

        // 3. 만약 해당 타입의 계산기가 없다면 에러 발생
        if (calculator == null) {
            throw new IllegalStateException("지원하지 않는 RentType 입니다. rentType=" + safe);
        }

        return calculator;
    }

}
