package com.carpick.domain.admin.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.carpick.domain.event.model.EventDTO;
import com.carpick.domain.event.service.EventService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class EventAdminController {
	
	@Value("${file.upload.path}")
    private String uploadPath;
	// 첨부 이미지 경로
	
	private final EventService eventService;
	
	
	// 이벤트 관리
	@GetMapping("/event")
	public String eventList(
	        @RequestParam(value = "type", defaultValue = "ongoing") String type,
	        @RequestParam(value = "search", required = false) String search,  // 검색어 처리
	        Model model) {

	    List<EventDTO> list;

	    // 검색어가 있을 경우 title 또는 content로 검색
	    if (search != null && !search.isEmpty()) {
	        list = eventService.searchEvents(search, type);  // 서비스 메서드에서 검색 처리
	    } else {
	        if ("end".equals(type)) {
	            list = eventService.getEndList();
	        } else {
	            list = eventService.getList();
	        }
	    }

	    model.addAttribute("eventList", list);
	    model.addAttribute("type", type);  // 버튼 텍스트용
	    model.addAttribute("search", search);  // 검색어 값 유지

	    return "event";
	}



    
    // 이벤트 상세보기
    @GetMapping("/event_write")
    public String eventWrite(Model model) {
    	model.addAttribute("event", new EventDTO());
        return "eventWrite";
    }
    
    @GetMapping("/event_write/{id:\\d+}")
    public String updateForm(@PathVariable("id") int id, Model model) {
        EventDTO event = eventService.getEvent(id);
        if (event == null) {
            return "redirect:/admin/event_list";
        }
        model.addAttribute("event", event);
        return "eventWrite";
    }
    
    @PostMapping("/event_write")
    public String writeOrUpdate(
            @ModelAttribute EventDTO event,
            @RequestParam(value = "thumbnailDelete", required = false) String thumbnailDelete
    ) throws IOException {

        // 1. 수정인 경우 기존 데이터 조회
        EventDTO existingEvent = null;
        if (event.getId() != 0) {
            existingEvent = eventService.getEvent(event.getId());
        }

        MultipartFile file = event.getThumbnailFile();

        // 2. 썸네일 삭제 체크한 경우
        if ("on".equals(thumbnailDelete) && existingEvent != null) {
            deleteThumbnailFile(existingEvent.getThumbnail());
            event.setThumbnail(null);
        }

        // 3. 새 파일 업로드한 경우 (삭제 체크 여부와 무관)
        if (file != null && !file.isEmpty()) {

            // 기존 파일 삭제
            if (existingEvent != null && existingEvent.getThumbnail() != null) {
                deleteThumbnailFile(existingEvent.getThumbnail());
            }

            String originalName = file.getOriginalFilename();
            String ext = originalName.substring(originalName.lastIndexOf("."));
            String savedName = UUID.randomUUID() + ext;

            Path savePath = Paths.get(uploadPath, "event", savedName);
            Files.createDirectories(savePath.getParent());
            file.transferTo(savePath.toFile());

            event.setThumbnail(savedName);
        }

        // 4. 아무 것도 안 한 경우 → 기존 썸네일 유지
        if ((file == null || file.isEmpty())
            && !"on".equals(thumbnailDelete)
            && existingEvent != null) {
            event.setThumbnail(existingEvent.getThumbnail());
        }

        // 5. insert / update
        if (event.getId() == 0) {
            eventService.insertEvent(event);
        } else {
            eventService.updateEvent(event);
        }

        return "redirect:/admin/event";
    }

    
    @DeleteMapping("/event_delete/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable("id") int id) {
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("삭제 중 오류가 발생했습니다.");
        }
    }


    
    // 에디터 이미지 저장
    @PostMapping("/upload/content-image")
    @ResponseBody
    public String uploadContentImage(@RequestParam("file") MultipartFile file)
            throws IOException {

        String originalName = file.getOriginalFilename();
        String ext = originalName.substring(originalName.lastIndexOf("."));
        String savedName = UUID.randomUUID() + ext;

        Path savePath = Paths.get(uploadPath, "editor", savedName);
        Files.createDirectories(savePath.getParent());
        file.transferTo(savePath.toFile());

        // 브라우저에서 접근 가능한 URL 반환
        return "/upload/editor/" + savedName;
    }
    
    private void deleteThumbnailFile(String thumbnail) {
        if (thumbnail == null || thumbnail.isEmpty()) return;

        try {
            Path path = Paths.get(uploadPath, "event", thumbnail);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            e.printStackTrace(); // 로그만
        }
    }

}
