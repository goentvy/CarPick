// src/main/java/com/carpick/domain/favorite/dto/FavoriteResponse.java
package com.carpick.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteResponse {
    private Long id;
    private Long carId;
    private String carName;
    private String carImageUrl;
    private LocalDateTime createdAt;
}
