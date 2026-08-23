package com.example.bookstore.service;

import com.example.bookstore.entity.Cart;

import java.util.List;
import java.util.Map;

public interface CartService {

    List<Cart> findByUserId(Integer userId);

    Cart selectByUidAndBid(Integer userId, Integer bookId);

    Cart findByBuyerIdAndBookId(Integer buyerId, Integer bookId);

    int insert(Cart cart);

    int update(Cart cart);

    int deleteById(Integer id);

    int deleteByBookId(Integer bookId);

    int deleteByBuyerIdAndBookId(Integer buyerId, Integer bookId);

    Map<String, Object> addCart(Integer userId, Integer secondBookId);
}