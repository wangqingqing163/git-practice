package com.example.bookstore.service;

import com.example.bookstore.entity.Favorite;
import java.util.List;

public interface FavoriteService {
    List<Favorite> findByUserId(Integer userId);
    boolean isFavorited(Integer userId, Integer bookId);
    boolean addFavorite(Integer userId, Integer bookId);
    boolean removeFavorite(Integer userId, Integer bookId);
}