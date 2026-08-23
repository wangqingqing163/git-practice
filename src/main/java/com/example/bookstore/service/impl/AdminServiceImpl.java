package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Orders;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.mapper.CartMapper;
import com.example.bookstore.mapper.CommentMapper;
import com.example.bookstore.mapper.FavoriteMapper;
import com.example.bookstore.mapper.OrderItemMapper;
import com.example.bookstore.mapper.OrdersMapper;
import com.example.bookstore.service.AdminService;
import com.example.bookstore.service.OrdersService;
import com.example.bookstore.service.SecondBookService;
import com.example.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserService userService;

    @Autowired
    private SecondBookService secondBookService;

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private OrdersMapper ordersMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Override
    public Map<String, Object> getStats() {
        Map<String, Object> result = new HashMap<>();
        result.put("userCount", userService.countUsers());
        result.put("bookCount", secondBookService.countAll());
        result.put("orderCount", ordersService.countAll());
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> deleteBook(Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 1. 删除关联的订单、评论等
            List<Orders> orders = ordersMapper.findByBookId(id);
            if (orders != null && !orders.isEmpty()) {
                List<Integer> orderIds = orders.stream().map(Orders::getId).collect(Collectors.toList());
                commentMapper.deleteByOrderIds(orderIds);
                orderItemMapper.deleteByBookId(id);
                ordersMapper.deleteByBookId(id);
            }

            // 2. 删除购物车记录
            cartMapper.deleteByBookId(id);

            // 3. 删除收藏记录（修复外键约束问题）
            favoriteMapper.deleteByBookId(id);

            // 4. 最后删除图书本身（会级联删除其他关联数据）
            int rows = secondBookService.deleteById(id);

            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "删除成功" : "商品不存在");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "删除失败: " + e.getMessage());
        }
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> updateOrderStatus(Integer id, String status) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (!"pending".equals(status) && !"shipped".equals(status) && !"received".equals(status)) {
                result.put("success", false);
                result.put("msg", "无效状态值，只支持 pending/shipped/received");
                return result;
            }
            Orders order = ordersService.findById(id);
            if (order == null) {
                result.put("success", false);
                result.put("msg", "订单不存在");
                return result;
            }
            order.setStatus(status);
            int rows = ordersService.update(order);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "状态更新成功" : "更新失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "更新失败: " + e.getMessage());
        }
        return result;
    }
}