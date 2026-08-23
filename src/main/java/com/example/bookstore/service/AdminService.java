package com.example.bookstore.service;

import com.example.bookstore.entity.Orders;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.entity.User;

import java.util.List;
import java.util.Map;

public interface AdminService {

    Map<String, Object> getStats();

    Map<String, Object> deleteBook(Integer id);

    Map<String, Object> updateOrderStatus(Integer id, String status);
}