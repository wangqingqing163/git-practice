package com.example.bookstore.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Favorite {
    private Integer id;
    private Integer userId;
    private Integer bookId;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    // 扩展字段 - 用于前端展示
    private String bookName;
    private String author;
    private Double price;
    private String level;
    private String image;
    private Integer status;
    private Integer categoryId;
    private String categoryName;
}