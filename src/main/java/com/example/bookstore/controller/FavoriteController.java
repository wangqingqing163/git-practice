package com.example.bookstore.controller;

import com.example.bookstore.entity.Favorite;
import com.example.bookstore.service.FavoriteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorite")
public class FavoriteController {
    private static final Logger log = LoggerFactory.getLogger(FavoriteController.class);

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping("/{userId}")
    public Map<String, Object> getFavorites(@PathVariable Integer userId) {
        Map<String, Object> result = new HashMap<>();
        try {
            log.info("=== 查询用户收藏列表，userId={} ===", userId);
            List<Favorite> favorites = favoriteService.findByUserId(userId);
            log.info("=== 收藏列表查询成功，数量={} ===", favorites != null ? favorites.size() : 0);
            result.put("code", 200);
            result.put("data", favorites);
        } catch (Exception e) {
            log.error("=== 获取收藏列表失败，userId={} ===", userId, e);
            result.put("code", 500);
            result.put("msg", "获取收藏列表失败: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/check")
    public Map<String, Object> checkFavorite(@RequestParam Integer userId, @RequestParam Integer bookId) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean isFavorited = favoriteService.isFavorited(userId, bookId);
            result.put("code", 200);
            result.put("data", isFavorited);
        } catch (Exception e) {
            log.error("查询收藏状态失败", e);
            result.put("code", 500);
            result.put("msg", "查询收藏状态失败");
        }
        return result;
    }

    @PostMapping("/add")
    public Map<String, Object> addFavorite(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            Integer userId = params.get("userId") != null ? Integer.valueOf(params.get("userId").toString()) : null;
            Integer bookId = params.get("bookId") != null ? Integer.valueOf(params.get("bookId").toString()) : null;
            
            if (userId == null || bookId == null) {
                result.put("code", 400);
                result.put("msg", "参数错误");
                return result;
            }
            
            if (favoriteService.isFavorited(userId, bookId)) {
                result.put("code", 400);
                result.put("msg", "已经收藏过了");
                return result;
            }
            
            boolean success = favoriteService.addFavorite(userId, bookId);
            if (success) {
                result.put("code", 200);
                result.put("msg", "收藏成功");
            } else {
                result.put("code", 500);
                result.put("msg", "收藏失败");
            }
        } catch (Exception e) {
            log.error("收藏失败", e);
            result.put("code", 500);
            result.put("msg", "收藏失败");
        }
        return result;
    }

    @DeleteMapping("/remove")
    public Map<String, Object> removeFavorite(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            Integer userId = params.get("userId") != null ? Integer.valueOf(params.get("userId").toString()) : null;
            Integer bookId = params.get("bookId") != null ? Integer.valueOf(params.get("bookId").toString()) : null;
            
            if (userId == null || bookId == null) {
                result.put("code", 400);
                result.put("msg", "参数错误");
                return result;
            }
            
            boolean success = favoriteService.removeFavorite(userId, bookId);
            if (success) {
                result.put("code", 200);
                result.put("msg", "取消收藏成功");
            } else {
                result.put("code", 500);
                result.put("msg", "取消收藏失败");
            }
        } catch (Exception e) {
            log.error("取消收藏失败", e);
            result.put("code", 500);
            result.put("msg", "取消收藏失败");
        }
        return result;
    }
}