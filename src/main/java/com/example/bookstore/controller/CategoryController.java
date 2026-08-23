package com.example.bookstore.controller;

import com.example.bookstore.entity.Category;
import com.example.bookstore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list")
    public List<Category> list() {
        return categoryService.findAll();
    }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Integer id) {
        return categoryService.findById(id);
    }

    @PostMapping("/add")
    public String add(@RequestBody Category category) {
        categoryService.insert(category);
        return "success";
    }

    @PutMapping("/update")
    public String update(@RequestBody Category category) {
        categoryService.update(category);
        return "success";
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {
        categoryService.deleteById(id);
        return "success";
    }
}