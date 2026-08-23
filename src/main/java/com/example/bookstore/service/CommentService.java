package com.example.bookstore.service;

import com.example.bookstore.entity.Comment;

import java.util.List;

public interface CommentService {

    List<Comment> findByOrderId(Integer orderId);

    List<Comment> findAll();

    int insert(Comment comment);

    int deleteById(Integer id);
}