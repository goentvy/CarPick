// com.carpick.domain.member.entity.Favorite.java
package com.carpick.domain.member.entity;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Favorite {
    private Long id;
    private Long userId;
    private Long carId;
    private String carName;
    private String carImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
