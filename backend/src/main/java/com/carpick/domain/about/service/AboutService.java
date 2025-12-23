package com.carpick.domain.about.service;

import com.carpick.domain.about.dto.AboutDto;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;

@Service
public class AboutService {

    /**
     * 카픽의 5대 핵심 가치 데이터를 생성하여 반환합니다.
     */
    public List<AboutDto> getBrandValues() {
        return Arrays.asList(
            new AboutDto("Simple", "복잡함을 걷어낸 직관적인 이용 경험", "Smile"),
            new AboutDto("Smart", "AI 기반 맞춤 추천과 자동화 프로세스", "Brain"),
            new AboutDto("Fast", "기다림 없는 픽업·반납 시스템", "Zap"),
            new AboutDto("Safe", "투명한 정보 제공과 엄격한 관리", "Shield"),
            new AboutDto("Free", "여행의 시작을 가볍게 만드는 자유로움", "MapPin")
        );
    }
}