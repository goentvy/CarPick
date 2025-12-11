package com.carpick.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.carpick.model.EventDTO;
import com.carpick.service.EventService;

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

    // ★ JSON으로 받는 이벤트 생성
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createEventJson(@RequestBody EventDTO event) {
        eventService.insertEvent(event);
        return ResponseEntity.ok("success");
    }

    // ★ multipart/form-data로 받는 이벤트 생성 (썸네일 포함)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createEventMultipart(
            @RequestPart("data") EventDTO event,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {

        // 썸네일 처리
        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("C:/upload/event/");

            try {
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                file.transferTo(uploadPath.resolve(fileName).toFile());
                event.setThumbnail(fileName);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        eventService.insertEvent(event);
        return ResponseEntity.ok("success");
    }


    // ★ JSON으로 받는 수정
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateEventJson(
            @PathVariable int id,
            @RequestBody EventDTO event
    ) {
        event.setId(id);
        eventService.updateEvent(event);
        return ResponseEntity.ok("success");
    }

    // ★ Multipart로 받는 수정
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateEventMultipart(
            @PathVariable int id,
            @RequestPart("data") EventDTO event,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        event.setId(id);

        if (file != null && !file.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("C:/upload/event/");

            try {
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                file.transferTo(uploadPath.resolve(fileName).toFile());
                event.setThumbnail(fileName);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        eventService.updateEvent(event);
        return ResponseEntity.ok("success");
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable int id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok("success");
    }
}
