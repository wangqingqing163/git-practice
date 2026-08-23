package com.example.bookstore.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SecondBook {
    private Integer id;
    private String bookDesc;
    private Integer sellerId;
    private String status;
    private Double price;
    private String name;
    private String author;
    private String level;
    private String image;
    private Integer viewCount;
    private Integer soldCount;

    // ====分类相关====
    private Integer categoryId;
    private String categoryName;
    private String sellerName;

    // ====时间字段====
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}