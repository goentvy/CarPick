package com.carpick.admin.reservationAdmin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/admin/reservation/detail")
public class AdminReservationViewController {

    @GetMapping("/{reservationId}")
    public String reservationDetailPage(@PathVariable Long reservationId) {
        // Model로 데이터를 넘길 필요 없음(지금처럼 fetch로 받을 거니까)
        return "reservationDetail";
    }

    @GetMapping
    public String reservationListPage() {
        return "admin/reservation/reservation-list";
    }
}
