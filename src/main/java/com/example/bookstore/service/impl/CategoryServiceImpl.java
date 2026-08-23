package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Category;
import com.example.bookstore.mapper.CategoryMapper;
import com.example.bookstore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> findAll() {
        return categoryMapper.findAll();
    }

    @Override
    public Category findById(Integer id) {
        return categoryMapper.findById(id);
    }

    @Override
    @Transactional
    public int insert(Category category) {
        return categoryMapper.insert(category);
    }

    @Override
    @Transactional
    public int update(Category category) {
        return categoryMapper.update(category);
    }

    @Override
    @Transactional
    public int deleteById(Integer id) {
        return categoryMapper.deleteById(id);
    }
}