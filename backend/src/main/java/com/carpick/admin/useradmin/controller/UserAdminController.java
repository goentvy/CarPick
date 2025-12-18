package com.carpick.admin.useradmin.controller;

import com.carpick.admin.useradmin.dto.UserAdminRequest;
import com.carpick.admin.useradmin.dto.UserAdminResponse;
import com.carpick.admin.useradmin.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin")
public class UserAdminController {

    private final UserAdminService userAdminService;

    /**
     * ✅ 고객관리 목록 페이지
     * URL: /admin/user
     * VIEW: user.html
     */
    @GetMapping("/user")
    public String usersList(
            @RequestParam(required = false) String search,
            Model model
    ) {
        List<UserAdminResponse> userList =
                userAdminService.getUserList(search);

        model.addAttribute("userList", userList);
        model.addAttribute("search", search);

        return "user"; // templates/user.html
    }

    /**
     * ✅ 고객 등록 화면
     * URL: /admin/user_write
     * VIEW: userWrite.html
     */
    @GetMapping("/user_write")
    public String userWriteForm(Model model) {
        model.addAttribute("user", new UserAdminRequest());
        return "userWrite"; // templates/userWrite.html
    }

    /**
     * ✅ 고객 수정 화면
     * URL: /admin/user_write?id=1
     */
    @GetMapping(value = "/user_write", params = "id")
    public String userWrite(
            @RequestParam Long id,
            Model model
    ) {
        UserAdminResponse user = userAdminService.getUser(id);
        model.addAttribute("user", user);
        return "userWrite";
    }

    /**
     * ✅ 등록 / 수정 처리
     */
    @PostMapping("/user_write")
    public String saveUser(
            @ModelAttribute UserAdminRequest request
    ) {
        if (request.getUserId() == null) {
            userAdminService.insertUser(request);
        } else {
            userAdminService.updateUser(request.getUserId(), request);
        }

        return "redirect:/admin/user";
    }

    /**
     * ✅ 삭제
     */
    @PostMapping("/user_delete")
    public String deleteUser(@RequestParam Long id) {
        userAdminService.deleteUser(id);
        return "redirect:/admin/user";
    }
}
