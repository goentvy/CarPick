package com.carpick.admin.controller;

import com.carpick.admin.carAdmin.service.AdminCarOptionService;
import com.carpick.admin.insuranceAdmin.service.AdminInsuranceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private  final AdminCarOptionService adminCarOptionService;
    private final AdminInsuranceService adminInsuranceService;
    // AdminController에서 분리해서 새로 개발하실 경우, 관련 메소드를 삭제 후 이동해주세요!

    ///  관리자 메인 ///
    @GetMapping()
    public String mainAdmin() {
        return "index";
    }
    ///  관리자 메인 ///

    // ================== 1. 차종 관리 (Spec + Option) ==================
    // ================== 1. 차량 스펙 관리 (CAR_SPEC) ==================
    @GetMapping("/car")
    public String carSpecList() {
        return "car";   // car.html
    }
    // 메서드 추가
    @GetMapping("/option")
    public String optionAdmin(Model model) {
        model.addAttribute("optionList", adminCarOptionService.getOptionList());
        return "option";  // templates/option.html
    }
// 지점관리
    @GetMapping("/branch")
    public String branchAdmin() {
        return "branch";
    }

    // ================== 2. 차량 재고 관리 (Inventory - 실차) ==================
    // [NEW] 방금 만드신 기능을 위한 페이지입니다.
    @GetMapping("/inventory")
    public String vehicleInventoryList() {
        return "inventory"; // inventory.html 생성 필요
    }

    // "보험 관리" 메뉴를 눌렀을 때 실행되는 메서드
    @GetMapping("/insurance")
    public String insurancePage(Model model) {
        // 1. 서비스한테 보험 목록 좀 가져오라고 시킴
        // (아까 만든 getInsuranceList 메서드 재활용!)
        model.addAttribute("list", adminInsuranceService.getInsuranceList());

        // 2. insurance.html 파일을 열어라!
        return "insurance"; // 파일 위치에 따라 경로 수정 (templates/insurance.html 이라면)
    }

// 가격 추가
    @GetMapping("/price")
    public String priceAdmin() {
        return "price";
    }

    ///  예약 관리 ///
    @GetMapping("/reservation")
    public String reserveAdmin() {
        return "reservation";
    }
    /**
     * 2) 예약 상세 페이지
     * URL: /admin/reservation/{reservationId}
     * 파일위치: templates/reservationDetail.html
     */
    @GetMapping("/reservation/{reservationId}")
    public String reserveDetailAdmin(@PathVariable Long reservationId) {
        return "reservationDetail"; // 여기도 파일명만 적어주세요 (확장자 제외)
    }

    ///  지점 관리 ///
    @GetMapping("/spot")
    public String spotAdmin() {
        return "spot";
    }
    @GetMapping("/spot_write")
    public String spotWriteAdmin() {
        return "spotWrite";
    }
    ///  지점 관리 ///

}
