package com.carpick.domain.event.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.carpick.domain.event.model.EventDTO;
import com.carpick.domain.event.service.EventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/event")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // 이벤트 목록 (JSON 반환)
    @GetMapping
    public ResponseEntity<List<EventDTO>> getList() {
        return ResponseEntity.ok(eventService.getList());
    }
    
    @GetMapping("/ended")
    public ResponseEntity<List<EventDTO>> getEndList() {
        return ResponseEntity.ok(eventService.getEndList());
    }

    // 이벤트 상세조회
    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEvent(@PathVariable("id") int id) {
        return ResponseEntity.ok(eventService.getEvent(id));
    }
    
}
