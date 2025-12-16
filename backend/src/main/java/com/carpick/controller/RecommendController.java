//package com.carpick.controller;
//
//import lombok.Data;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//import com.carpick.service.RecommendService;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api")
//public class RecommendController {
//
//    private final RecommendService recommendService;
//
//    @PostMapping("/recommend-cars")
//    public Map<String, Object> recommendCars(@RequestBody RecommendRequest request) {
//
//        Map<String, String> segment = recommendService.getRecommendedSegment(request.getOptions());
//
//        return Map.of(
//                "recommendedSegment", segment
//        );
//    }
//
//    @Data
//    public static class RecommendRequest {
//        private List<String> options;  // 체크박스 데이터 배열
//    }
//}