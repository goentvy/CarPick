package com.carpick.domain.admin.controller;

import lombok.RequiredArgsConstructor;

import java.io.File;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.carpick.domain.event.model.EventDTO;
import com.carpick.domain.event.service.EventService;


@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
	
	private final EventService eventService;
	
	@GetMapping()
	public String adminMain() {
	    return "index";
	}
    
	// 차량 관리
    @GetMapping("/car")
    public String carList() {
        return "car";
    }
    
    // 차량 상세 보기 관리
    @GetMapping("/car_write")
    public String carWrite() {
        return "carWrite";
    }
    
    // 회원 관리
    @GetMapping("/user")
    public String userList() {
        return "user";
    }
    
    // 회원 상세 보기 관리
    @GetMapping("/user_write")
    public String userWrite() {
        return "userWrite";
    }
    
    // 예약 관리
    @GetMapping("/reserve")
    public String reserveList() {
        return "reserve";
    }
    
    // 예약 상세 보기 관리
    @GetMapping("/reserve_write")
    public String reserveWrite() {
        return "reserveWrite";
    }
    
    // 지점 관리
    @GetMapping("/spot")
    public String spotList() {
        return "spot";
    }
    
    // 지점 상세 보기 관리
    @GetMapping("/spot_write")
    public String spotWrite() {
        return "spotWrite";
    }
    
    // 일대일 문의 관리
    @GetMapping("/inquiry")
    public String inquiryList() {
        return "inquiry";
    }
    
    // 일대일 문의 상세보기
    @GetMapping("/inquiry_write")
    public String inquiryWrite() {
        return "inquiryWrite";
    }
    
    // 자주묻는 질문 관리
    @GetMapping("/faq")
    public String faqList() {
        return "faq";
    }
    
    // 자주묻는 질문 상세보기
    @GetMapping("/faq_write")
    public String faqWrite() {
        return "faqWrite";
    }
    
    // 공지사항 관리
    @GetMapping("/notice")
    public String noticeList() {
        return "notice";
    }
    
    // 공지사항 상세보기
    @GetMapping("/notice_detail")
    public String noticeWrite() {
        return "noticeWrite";
    }
    
}
