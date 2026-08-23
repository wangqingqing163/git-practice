package com.example.bookstore.mapper;

import com.example.bookstore.entity.Favorite;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface FavoriteMapper {
    List<Favorite> findByUserId(Integer userId);
    Favorite findByUserIdAndBookId(Integer userId, Integer bookId);
    int insert(Favorite favorite);
    int deleteById(Integer id);
    int deleteByUserIdAndBookId(Integer userId, Integer bookId);
    int deleteByBookId(Integer bookId);  // 按图书ID删除所有收藏记录（用于下架时清理）
}