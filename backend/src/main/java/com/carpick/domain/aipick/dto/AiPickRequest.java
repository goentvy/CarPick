package com.carpick.domain.aipick.dto;

import lombok.Data;

import java.util.List;

@Data
public class AiPickRequest {
    private List<String> selectedOptions; // ["가족여행", "SUV 선호", "짐이 많아요"]

}
