package com.carpick.domain.member.mapper;

import com.carpick.domain.member.dto.FavoriteResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface FavoritesMapper {
    List<FavoriteResponse> findByUserId(Long userId);
    int existsByUserIdAndCarId(Map<String, Object> params);
    void insertFavorite(Map<String, Object> params);
    void deleteByIdAndUserId(Map<String, Object> params);
}
