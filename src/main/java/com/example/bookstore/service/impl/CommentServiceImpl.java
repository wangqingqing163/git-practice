package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Comment;
import com.example.bookstore.mapper.CommentMapper;
import com.example.bookstore.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public List<Comment> findByOrderId(Integer orderId) {
        return commentMapper.findByOrderId(orderId);
    }

    @Override
    public List<Comment> findAll() {
        return commentMapper.findAll();
    }

    @Override
    @Transactional
    public int insert(Comment comment) {
        return commentMapper.insert(comment);
    }

    @Override
    @Transactional
    public int deleteById(Integer id) {
        return commentMapper.deleteById(id);
    }
}