package com.example.bookstore.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Orders {
    private Integer id;
    private String orderNo;
    private Integer buyerId;
    private Integer sellerId;
    private Integer bookId;
    private Double totalPrice;
    private String status;
    private String address;
    private String phone;
    private String receiverName;
    private String remark;
    private String trackingNo;
    private Integer urged;
    private Integer buyerConfirmed;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    /** 订单状态中文转换，前端用 getStatusText 替代 getStatus */
    public String getStatusText() {
        if (status == null) return "未知";
        switch (status) {
            case "pending":   return "待发货";
            case "shipped":   return "已发货";
            case "received":  return "已收货";
            case "cancelled": return "已取消";
            default:          return status;
        }
    }
}