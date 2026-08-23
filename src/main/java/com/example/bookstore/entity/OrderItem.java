package com.example.bookstore.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OrderItem {
    private Integer id;
    private Integer orderId;
    private Integer bookId;
    private Integer quantity;
    private Double price;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}