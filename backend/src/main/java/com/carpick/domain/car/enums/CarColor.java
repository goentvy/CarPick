package com.carpick.domain.car.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum CarColor {
    WHITE("화이트", "#FFFFFF", "#111111"),
    BLACK("블랙", "#000000", "#FFFFFF"),
    RED("레드", "#D32F2F", "#FFFFFF"),
    BLUE("블루", "#1E3A8A", "#FFFFFF"), // 군청 포함
    SILVER("실버" , "#C0C0C0", "#111111");
    /** 화면 표시용 이름 */
    private final String displayName;

    /** 카드/상세페이지 대표 배경 색상 */
    private final String backgroundColor;

    /** 배경색에 대응되는 텍스트 색상 */
    private final String textColor;


}
