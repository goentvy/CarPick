package com.carpick.domain.Intro.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IntroController {
	 @GetMapping("/intro")
    public String carList(Model model) {
        return "aipick";
    }
}
