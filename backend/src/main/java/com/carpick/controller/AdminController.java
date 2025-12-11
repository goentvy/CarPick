package com.carpick.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

	@GetMapping()
	public String adminMain() {
	    return "index";
	}
    
	// 차량 관리
    @GetMapping("/car")
    public String carList() {
        return "car";
    }
    
    // 회원 관리
    @GetMapping("/user")
    public String userList() {
        return "user";
    }
    
    // 예약 관리
    @GetMapping("/reserve")
    public String reserveList() {
        return "reserve";
    }
}
