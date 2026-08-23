package com.example.bookstore.service;

import com.example.bookstore.entity.Orders;

import java.util.List;
import java.util.Map;

public interface OrdersService {

    List<Orders> findByBuyerId(Integer buyerId);

    List<Orders> findBySellerId(Integer sellerId);

    Orders findById(Integer id);

    int insert(Orders orders);

    int update(Orders orders);

    List<Orders> findAll();

    int countAll();

    List<Orders> findUrgedBySellerId(Integer sellerId);

    List<Orders> findConfirmedBySellerId(Integer sellerId);

    List<Orders> findByBookId(Integer bookId);

    int deleteByBookId(Integer bookId);

    int deleteById(Integer id);

    Map<String, Object> createOrder(Integer buyerId, Integer bookId, String address, String phone, String receiverName, Double totalPrice);

    Map<String, Object> shipOrder(Integer id, String trackingNo);

    Map<String, Object> urgeOrder(Integer id);

    Map<String, Object> confirmShipInfo(Integer id);

    Map<String, Object> receiveOrder(Integer id);

    Map<String, Object> cancelOrder(Integer id);
}