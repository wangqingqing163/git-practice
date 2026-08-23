package com.example.bookstore.controller;

import com.example.bookstore.entity.Cart;
import com.example.bookstore.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private static final Logger log = LoggerFactory.getLogger(CartController.class);

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public List<Cart> findByUserId(@PathVariable Integer userId) {
        try {
            log.info("=== 查询购物车，userId={} ===", userId);
            List<Cart> cartList = cartService.findByUserId(userId);
            log.info("=== 购物车查询成功，数量={} ===", cartList != null ? cartList.size() : 0);
            return cartList;
        } catch (Exception e) {
            log.error("=== 查询购物车失败，userId={} ===", userId, e);
            throw e;
        }
    }

    @PostMapping("/add")
    public Map<String, Object> addCart(@RequestBody Map<String, Object> params) {
        Integer userId = params.get("userId") != null ? Integer.valueOf(params.get("userId").toString()) : null;
        Integer secondBookId = params.get("secondBookId") != null
                ? Integer.valueOf(params.get("secondBookId").toString())
                : null;
        return cartService.addCart(userId, secondBookId);
    }

    @PutMapping("/updateNum")
    public Map<String, Object> updateNum(@RequestBody Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        try {
            Integer id = Integer.valueOf(params.get("id").toString());
            Integer num = Integer.valueOf(params.get("num").toString());
            Cart cart = new Cart();
            cart.setId(id);
            cart.setQuantity(num);
            cartService.update(cart);
            result.put("code", 200);
            result.put("msg", "修改成功");
        } catch (Exception e) {
            result.put("code", 500);
            result.put("msg", "修改失败");
        }
        return result;
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteById(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            cartService.deleteById(id);
            result.put("code", 200);
            result.put("msg", "删除成功");
        } catch (Exception e) {
            log.error("删除购物车失败", e);
            result.put("code", 500);
            result.put("msg", "删除失败");
        }
        return result;
    }
}