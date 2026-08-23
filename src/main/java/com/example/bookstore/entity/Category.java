
package com.example.bookstore.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Category {
    private Integer id;
    private String name;
    private String description;
    private String icon;
    private Integer sortOrder;
    private Integer parentId;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}