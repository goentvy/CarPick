package com.carpick.domain.member.service;

import com.carpick.domain.member.dto.FavoriteResponse;
import com.carpick.domain.member.mapper.FavoritesMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoritesService {

    private final FavoritesMapper favoritesMapper;

    public List<FavoriteResponse> getMyFavorites(Long userId) {
        return favoritesMapper.findByUserId(userId);
    }

    @Transactional
    public void addFavorite(Long userId, Long carId, String carName, String carImageUrl) {
        Map<String, Object> exists = new HashMap<>();
        exists.put("userId", userId);
        exists.put("carId", carId);

        if (favoritesMapper.existsByUserIdAndCarId(exists) > 0) {
            throw new IllegalStateException("이미 찜한 차량입니다.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("carId", carId);
        params.put("carName", carName);
        params.put("carImageUrl", carImageUrl);

        favoritesMapper.insertFavorite(params);
    }

    @Transactional
    public void deleteFavorite(Long userId, Long favoriteId) {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", userId);
        params.put("favoriteId", favoriteId);
        favoritesMapper.deleteByIdAndUserId(params);
    }
}