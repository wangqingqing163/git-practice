package com.example.bookstore.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Comment {
    private Integer id;
    private Integer orderId;
    private Integer userId;
    private Integer bookId;
    private Integer score;
    private String content;
    private Integer status;
    private String reply;
    private LocalDateTime replyTime;
    private LocalDateTime createTime;
    private String username;
}