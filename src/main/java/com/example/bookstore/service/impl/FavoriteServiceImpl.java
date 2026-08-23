package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Favorite;
import com.example.bookstore.mapper.FavoriteMapper;
import com.example.bookstore.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Override
    public List<Favorite> findByUserId(Integer userId) {
        return favoriteMapper.findByUserId(userId);
    }

    @Override
    public boolean isFavorited(Integer userId, Integer bookId) {
        return favoriteMapper.findByUserIdAndBookId(userId, bookId) != null;
    }

    @Override
    @Transactional
    public boolean addFavorite(Integer userId, Integer bookId) {
        try {
            Favorite favorite = new Favorite();
            favorite.setUserId(userId);
            favorite.setBookId(bookId);
            favoriteMapper.insert(favorite);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean removeFavorite(Integer userId, Integer bookId) {
        try {
            favoriteMapper.deleteByUserIdAndBookId(userId, bookId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}