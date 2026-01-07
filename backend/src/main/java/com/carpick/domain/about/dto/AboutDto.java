package com.carpick.domain.about.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AboutDto {
 private String title;
 private String description;
 private String iconName; // 리액트 아이콘 컴포넌트 이름과 매칭용
}