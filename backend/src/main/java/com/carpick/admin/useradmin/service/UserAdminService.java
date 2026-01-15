package com.carpick.admin.useradmin.service;

import com.carpick.admin.useradmin.dto.UserAdminRequest;
import com.carpick.admin.useradmin.dto.UserAdminResponse;
import com.carpick.admin.useradmin.mapper.UserAdminMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserAdminMapper userAdminMapper;

    public List<UserAdminResponse> getUserList(String search, int page, int size) {
        int offset = (page - 1) * size;
        return userAdminMapper.selectUsers(search, size, offset);
    }

    public int getTotalCount(String search) {
        return userAdminMapper.countUsers(search);
    }

    public UserAdminResponse getUser(Long id) {
        return userAdminMapper.selectUserById(id);
    }
    
    // =========================
    // 회원 통계 (Dashboard)
    // =========================
    public int getWeeklyJoinedUserCount() {
        return userAdminMapper.countWeeklyJoinedUsers();
    }

    public int getMonthlyJoinedUserCount() {
        return userAdminMapper.countMonthlyJoinedUsers();
    }

    public List<UserAdminResponse> getRecentJoinedUsers(int limit) {
        return userAdminMapper.selectRecentJoinedUsers(limit);
    }

    @Transactional
    public void createUser(UserAdminRequest request) {
        // NOT NULL 방어
        if (request.getMarketingAgree() == null) request.setMarketingAgree(0);
        if (request.getMembershipGrade() == null || request.getMembershipGrade().isBlank()) {
            request.setMembershipGrade("BASIC");
        }
        userAdminMapper.insertUser(request);
    }

    @Transactional
    public void updateUser(UserAdminRequest request) {
        if (request.getMarketingAgree() == null) request.setMarketingAgree(0);
        if (request.getMembershipGrade() == null || request.getMembershipGrade().isBlank()) {
            request.setMembershipGrade("BASIC");
        }
        userAdminMapper.updateUser(request);
    }

    @Transactional
    public void deleteUser(Long id) {
        // 실제 삭제(DELETE)로 처리. 소프트삭제 원하면 UPDATE로 바꿔주면 됨.
        userAdminMapper.deleteUser(id);
    }
}
