package com.example.bookstore.controller;

import com.example.bookstore.entity.Orders;
import com.example.bookstore.service.OrdersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private static final Logger log = LoggerFactory.getLogger(OrdersController.class);

    @Autowired
    private OrdersService ordersService;

    @GetMapping("/{id}")
    public Orders getOrderById(@PathVariable Integer id) {
        log.info("获取订单详情: id={}", id);
        return ordersService.findById(id);
    }

    @PostMapping("/create")
    public Map<String, Object> createOrder(@RequestBody Map<String, Object> params) {
        Integer buyerId = params.get("buyerId") != null ? Integer.valueOf(params.get("buyerId").toString()) : null;
        Integer bookId = params.get("bookId") != null ? Integer.valueOf(params.get("bookId").toString()) : null;
        String address = params.get("address") != null ? params.get("address").toString() : "";
        String phone = params.get("phone") != null ? params.get("phone").toString() : "";
        String receiverName = params.get("receiverName") != null ? params.get("receiverName").toString() : "";
        Double totalPrice = params.get("totalPrice") != null ? Double.valueOf(params.get("totalPrice").toString()) : 0.0;

        log.info("创建订单: buyerId={}, bookId={}, receiverName={}, totalPrice={}", buyerId, bookId, receiverName, totalPrice);

        return ordersService.createOrder(buyerId, bookId, address, phone, receiverName, totalPrice);
    }

    @PutMapping("/ship/{id}")
    public Map<String, Object> ship(@PathVariable Integer id, @RequestBody Map<String, Object> params) {
        String trackingNo = params.get("trackingNo") != null ? params.get("trackingNo").toString().trim() : "";
        return ordersService.shipOrder(id, trackingNo);
    }

    @PutMapping("/urge/{id}")
    public Map<String, Object> urge(@PathVariable Integer id) {
        return ordersService.urgeOrder(id);
    }

    @GetMapping("/urged/{sellerId}")
    public List<Orders> getUrgedOrders(@PathVariable Integer sellerId) {
        return ordersService.findUrgedBySellerId(sellerId);
    }

    @PutMapping("/confirm-ship-info/{id}")
    public Map<String, Object> confirmShipInfo(@PathVariable Integer id) {
        return ordersService.confirmShipInfo(id);
    }

    @GetMapping("/confirmed/{sellerId}")
    public List<Orders> getConfirmedOrders(@PathVariable Integer sellerId) {
        return ordersService.findConfirmedBySellerId(sellerId);
    }

    @PutMapping("/receive/{id}")
    public Map<String, Object> receive(@PathVariable Integer id) {
        return ordersService.receiveOrder(id);
    }

    @PutMapping("/cancel/{id}")
    public Map<String, Object> cancel(@PathVariable Integer id) {
        return ordersService.cancelOrder(id);
    }

    @GetMapping("/buyer/{buyerId}")
    public List<Orders> getBuyerOrders(@PathVariable Integer buyerId) {
        return ordersService.findByBuyerId(buyerId);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Orders> getSellerOrders(@PathVariable Integer sellerId) {
        return ordersService.findBySellerId(sellerId);
    }

    @GetMapping("/my/{userId}")
    public List<Orders> getMyOrders(@PathVariable Integer userId) {
        List<Orders> buyerOrders = ordersService.findByBuyerId(userId);
        List<Orders> sellerOrders = ordersService.findBySellerId(userId);
        buyerOrders.addAll(sellerOrders);
        return buyerOrders;
    }
}