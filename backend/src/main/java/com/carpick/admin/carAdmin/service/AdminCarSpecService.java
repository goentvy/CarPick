package com.carpick.admin.carAdmin.service;


import com.carpick.admin.carAdmin.dto.AdminCarSpecDto;
import com.carpick.admin.carAdmin.mapper.AdminCarSpecMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminCarSpecService {
    private final AdminCarSpecMapper carSpecMapper;

    // 📂 이미지가 저장될 기본 경로 (프로젝트 내 static 폴더 기준)
    // 주의: 실제 배포 시에는 외부 경로(예: C:/uploads/...)로 변경하는 것이 좋습니다.
    private static final String UPLOAD_ROOT_DIR = System.getProperty("user.dir") + "/src/main/resources/static/assets/images/cars/";

    /** 🔎 목록 조회 */
    @Transactional(readOnly = true)
    public List<AdminCarSpecDto> getCarSpecList() {
        return carSpecMapper.selectList();
    }

    /** 🔎 단건 조회 */
    @Transactional(readOnly = true)
    public AdminCarSpecDto getCarSpec(Long specId) {
        if (specId == null) throw new IllegalArgumentException("specId는 null일 수 없습니다.");
        AdminCarSpecDto dto = carSpecMapper.selectById(specId);
        if (dto == null) throw new IllegalStateException("해당 스펙을 찾을 수 없습니다.");
        return dto;
    }

    /**
     * 📝 차량 스펙 등록 (파일 업로드 포함)
     * 파라미터에 MultipartFile 2개가 추가되었습니다.
     */
    public void addCarSpec(AdminCarSpecDto dto) {

        // 1. 필수값/기본값 검증
        validateRequiredFields(dto);
        normalizeFields(dto);



        // 3. 중복 확인 및 DB 저장 (기존 로직 동일)
        AdminCarSpecDto deleted = carSpecMapper.selectDeletedByName(
                dto.getBrand(), dto.getModelName(), dto.getModelYearBase()
        );

        if (deleted != null) {
            carSpecMapper.restore(deleted.getSpecId());
            dto.setSpecId(deleted.getSpecId());
            carSpecMapper.update(dto);
        } else {
            carSpecMapper.insert(dto);
        }
    }

    /**
     * 🛠 차량 스펙 수정 (파일 업로드 포함)
     */
    public void updateCarSpec(AdminCarSpecDto dto) {
        if (dto.getSpecId() == null) throw new IllegalArgumentException("수정하려면 specId가 필요합니다.");

        validateRequiredFields(dto);
        normalizeFields(dto);


    }

    /** 🚫 삭제 */
    public void softDeleteCarSpec(Long specId) {
        if (specId == null) throw new IllegalArgumentException("specId 필요");
        if (carSpecMapper.countVehicleBySpecId(specId) > 0) {
            throw new IllegalStateException("이 스펙을 사용하는 차량이 있어 삭제 불가합니다.");
        }
        carSpecMapper.softDelete(specId);
    }

    /** 🔄 복구 */
    public void restoreCarSpec(Long specId) {
        carSpecMapper.restore(specId);
    }

    // ======================================================================
    //  📸 [핵심] 파일 저장 로직 (여기가 새로 추가된 부분입니다)
    // ======================================================================



    // ======================================================================
    //  🔐 내부 유효성 검사 (기존과 동일)
    // ======================================================================
    private void validateRequiredFields(AdminCarSpecDto dto) {
        if (isBlank(dto.getBrand())) throw new IllegalArgumentException("브랜드 필수");
        if (isBlank(dto.getModelName())) throw new IllegalArgumentException("모델명 필수");
        if (dto.getModelYearBase() == null) throw new IllegalArgumentException("연식 필수");
        if (dto.getModelYearBase() < 2000 || dto.getModelYearBase() > 2030) {
            // 범위는 프로젝트 정책에 맞게
        }
        if (dto.getCarClass() == null) throw new IllegalArgumentException("등급 필수");
        if (dto.getFuelType() == null) throw new IllegalArgumentException("연료 필수");
    }

    private void normalizeFields(AdminCarSpecDto dto) {
        dto.setBrand(trimToNull(dto.getBrand()));
        dto.setModelName(trimToNull(dto.getModelName()));
        dto.setDisplayNameShort(trimToNull(dto.getDisplayNameShort()));
        dto.setAiSummary(trimToNull(dto.getAiSummary()));
        dto.setCarOptions(trimToNull(dto.getCarOptions()));

        // UseYn 기본값 처리
        if (isBlank(dto.getUseYn())) dto.setUseYn("Y");
        else dto.setUseYn(dto.getUseYn().trim().toUpperCase());

        // Transmission 기본값
        if (isBlank(dto.getTransmissionType())) dto.setTransmissionType("AUTO");
    }

    private boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private String trimToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }


}
