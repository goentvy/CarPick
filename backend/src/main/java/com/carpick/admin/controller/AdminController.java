package com.carpick.admin.controller;

import com.carpick.admin.insuranceAdmin.service.AdminInsuranceService;
import com.carpick.domain.auth.dto.LoginRequest;
import com.carpick.domain.auth.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminInsuranceService adminInsuranceService;
    // AdminController에서 분리해서 새로 개발하실 경우, 관련 메소드를 삭제 후 이동해주세요!

    ///  관리자 메인 ///
    @GetMapping()
    public String mainAdmin() {
        return "index";
    }
    ///  관리자 메인 ///

    ///  차량관리 ///
    @GetMapping("/car")
    public String carAdmin() {
        return "car";
    }

    @GetMapping("/car_write")
    public String carWriteAdmin() {
        return "carWrite";
    }
    ///  차량관리 ///
    // "보험 관리" 메뉴를 눌렀을 때 실행되는 메서드
    @GetMapping("/insurance")
    public String insurancePage(Model model) {
        // 1. 서비스한테 보험 목록 좀 가져오라고 시킴
        // (아까 만든 getInsuranceList 메서드 재활용!)
        model.addAttribute("list", adminInsuranceService.getInsuranceList());

        // 2. insurance.html 파일을 열어라!
        return "insurance"; // 파일 위치에 따라 경로 수정 (templates/insurance.html 이라면)
    }


    ///  FAQ관리 ///
    @GetMapping("/faq")
    public String faqAdmin() {
        return "faq";
    }

    @GetMapping("/faq_write")
    public String faqWriteAdmin() {
        return "faqWrite";
    }
    ///  FAQ관리 ///

    ///  예약 관리 ///
    @GetMapping("/reserve")
    public String reserveAdmin() {
        return "reserve";
    }
    @GetMapping("/reserve_write")
    public String reserveWriteAdmin() {
        return "reserveWrite";
    }
    ///  예약 관리 ///

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
