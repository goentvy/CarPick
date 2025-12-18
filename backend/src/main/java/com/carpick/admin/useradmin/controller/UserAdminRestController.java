package com.carpick.admin.useradmin.controller;

import com.carpick.admin.useradmin.dto.UserAdminRequest;
import com.carpick.admin.useradmin.dto.UserAdminResponse;
import com.carpick.admin.useradmin.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/users")
public class UserAdminRestController {

    private final UserAdminService userAdminService;

    /**
     * ✅ 전체 목록 + 검색
     */
    @GetMapping
    public ResponseEntity<List<UserAdminResponse>> getUsers(
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(
                userAdminService.getUserList(search)
        );
    }

    /**
     * ✅ 단건 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserAdminResponse> getUser(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                userAdminService.getUser(id)
        );
    }

    /**
     * ✅ 등록
     */
    @PostMapping
    public ResponseEntity<Void> createUser(
            @RequestBody UserAdminRequest request
    ) {
        userAdminService.insertUser(request);
        return ResponseEntity.ok().build();
    }

    /**
     * ✅ 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUser(
            @PathVariable Long id,
            @RequestBody UserAdminRequest request
    ) {
        userAdminService.updateUser(id, request);
        return ResponseEntity.ok().build();
    }

    /**
     * ✅ 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id
    ) {
        userAdminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
