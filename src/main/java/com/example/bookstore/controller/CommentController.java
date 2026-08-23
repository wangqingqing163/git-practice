package com.example.bookstore.controller;

import com.example.bookstore.entity.Comment;
import com.example.bookstore.entity.Orders;
import com.example.bookstore.service.CommentService;
import com.example.bookstore.service.OrdersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    private static final Logger log = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private CommentService commentService;

    @Autowired
    private OrdersService ordersService;

    @GetMapping("/{orderId}")
    public List<Comment> findByOrderId(@PathVariable Integer orderId) {
        return commentService.findByOrderId(orderId);
    }

    @PostMapping
    public Map<String, Object> addComment(@RequestBody Comment comment) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 校验订单状态：已收货才可评价
            if (comment.getOrderId() == null) {
                result.put("code", 400);
                result.put("msg", "订单ID不能为空");
                return result;
            }
            Orders orders = ordersService.findById(comment.getOrderId());
            if (orders == null || !"received".equals(orders.getStatus())) {
                result.put("code", 400);
                result.put("msg", "只有已收货订单才能评价");
                return result;
            }
            comment.setCreateTime(LocalDateTime.now());
            commentService.insert(comment);
            result.put("success", true);
            result.put("code", 200);
            result.put("msg", "评价成功");
        } catch (Exception e) {
            log.error("评价失败", e);
            result.put("code", 500);
            result.put("msg", "评价失败: " + e.getMessage());
        }
        return result;
    }
}