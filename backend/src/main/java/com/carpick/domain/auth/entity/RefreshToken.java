package com.carpick.domain.auth.entity;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    private Long userId;

    private String token;

    private LocalDateTime createdAt;
}
