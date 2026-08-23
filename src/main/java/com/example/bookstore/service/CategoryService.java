
package com.example.bookstore.service;

import com.example.bookstore.entity.Category;

import java.util.List;

public interface CategoryService {

    List<Category> findAll();

    Category findById(Integer id);

    int insert(Category category);

    int update(Category category);

    int deleteById(Integer id);
}
