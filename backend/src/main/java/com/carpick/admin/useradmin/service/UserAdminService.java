package com.carpick.admin.useradmin.service;

import com.carpick.admin.useradmin.dto.UserAdminRequest;
import com.carpick.admin.useradmin.dto.UserAdminResponse;
import com.carpick.admin.useradmin.entity.UserAdmin;
import com.carpick.admin.useradmin.mapper.UserAdminMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserAdminMapper userAdminMapper;

    /**
     * 전체 목록 + 검색
     */
    public List<UserAdminResponse> getUserList(String search) {
        List<UserAdmin> users = userAdminMapper.findUsers(search);

        return users.stream()
                .map(UserAdminResponse::new)
                .collect(Collectors.toList());
    }

    /**
     * 단건 조회
     */
    public UserAdminResponse getUser(Long id) {
        UserAdmin user = userAdminMapper.findUserById(id);

        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다. id=" + id);
        }

        return new UserAdminResponse(user);
    }

    /**
     * 등록
     */
    public void insertUser(UserAdminRequest request) {
        UserAdmin user = UserAdmin.builder()
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .build();

        userAdminMapper.insertUser(user);
    }

    /**
     * 수정
     */
    public void updateUser(Long userId, UserAdminRequest request) {
        UserAdmin user = UserAdmin.builder()
                .userId(userId)
                .email(request.getEmail())
                .name(request.getName())
                .phone(request.getPhone())
                .build();

        userAdminMapper.updateUser(user);
    }

    /**
     * 삭제
     */
    public void deleteUser(Long id) {
        userAdminMapper.deleteUser(id);
    }
}
