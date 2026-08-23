
package com.example.bookstore.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Integer id;
    private String username;
    private String password;
    private String name;
    private String phone;
    private String email;
    private String address;
    private Integer role;

    // 卖家主页扩展字段
    private String avatar;      // 头像URL
    private String background;  // 背景渐变/颜色
    private String textColor;   // 文字颜色（#ffffff 或 #1a1a1a）
    private String textColorMode; // 文字颜色模式：auto/light/dark/custom
    private String ip;          // IP地址
    private LocalDateTime createTime;  // 注册时间
    private LocalDateTime updateTime;  // 最后更新时间
    private String tags;        // 个性标签（逗号分隔）
}