package com.example.bookstore.service;

import com.example.bookstore.entity.User;

import java.util.Map;

public interface UserService {

    User findById(Integer id);

    User findByUsername(String username);

    int insert(User user);

    int update(User user);

    int countUsers();

    java.util.List<User> findAll();

    int deleteById(Integer id);

    Map<String, Object> register(User user);

    Map<String, Object> login(User user);

    Map<String, Object> updateProfile(User user);

    Map<String, Object> getSellerDetail(Integer sellerId);
}