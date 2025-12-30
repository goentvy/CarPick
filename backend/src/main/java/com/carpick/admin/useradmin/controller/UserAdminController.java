package com.carpick.admin.useradmin.controller;

import com.carpick.admin.useradmin.dto.UserAdminRequest;
import com.carpick.admin.useradmin.dto.UserAdminResponse;
import com.carpick.admin.useradmin.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/admin/user")
public class UserAdminController {

    private final UserAdminService userAdminService;

    /**
     * 고객관리 메인 (기존 user.html)
     * GET  /admin/user
     */
    @GetMapping
    public String userList(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            Model model
    ) {
        // user.html을 안 건드린다고 했으니, model은 있어도 없어도 됨.
        // 나중에 user.html을 동적으로 바꾸고 싶으면 아래 값 사용 가능.
        model.addAttribute("userList", userAdminService.getUserList(search, page, size));
        model.addAttribute("search", search);
        model.addAttribute("page", page);
        model.addAttribute("size", size);
        model.addAttribute("totalCount", userAdminService.getTotalCount(search));

        return "user";
    }

    /**
     * 등록 폼
     * GET  /admin/user/write
     */
    @GetMapping("/write")
    public String writeForm(Model model) {
        model.addAttribute("user", new UserAdminRequest());
        return "user_write";
    }

    /**
     * 등록 처리
     * POST /admin/user/write
     */
    @PostMapping("/write")
    public String write(@ModelAttribute UserAdminRequest request) {
        userAdminService.createUser(request);
        return "redirect:/admin/user";
    }

    /**
     * 수정 폼
     * GET  /admin/user/edit?id=1
     */
    @GetMapping("/edit")
    public String editForm(@RequestParam Long id, Model model) {
        UserAdminResponse user = userAdminService.getUser(id);
        model.addAttribute("user", user);
        return "user_edit";
    }

    /**
     * 수정 처리
     * POST /admin/user/edit
     */
    @PostMapping("/edit")
    public String edit(@ModelAttribute UserAdminRequest request) {
        userAdminService.updateUser(request);
        return "redirect:/admin/user";
    }

    /**
     * 삭제 처리 (휴지통 버튼이 이 URL로 POST 하면 즉시 삭제됨)
     * POST /admin/user/delete
     */
    @PostMapping("/delete")
    public String delete(@RequestParam Long id) {
        userAdminService.deleteUser(id);
        return "redirect:/admin/user";
    }
}
