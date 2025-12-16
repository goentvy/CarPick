// com/carpick/domain/member/entity/DriverLicense.java
package com.carpick.domain.member.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "driver_licenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLicense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "driver_name", nullable = false, length = 50)
    private String driverName;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

    @Column(name = "license_number", nullable = false, length = 20)
    private String licenseNumber;

    @Column(name = "serial_number", nullable = false, length = 10)
    private String serialNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
