package com.example.bookstore.service.impl;

import com.example.bookstore.entity.OrderItem;
import com.example.bookstore.entity.Orders;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.mapper.OrderItemMapper;
import com.example.bookstore.mapper.OrdersMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import com.example.bookstore.service.OrdersService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class OrdersServiceImpl implements OrdersService {

    private static final Logger log = LoggerFactory.getLogger(OrdersServiceImpl.class);

    @Autowired
    private OrdersMapper ordersMapper;

    @Autowired
    private OrderItemMapper orderItemMapper;

    @Autowired
    private SecondBookMapper secondBookMapper;

    @Override
    public List<Orders> findByBuyerId(Integer buyerId) {
        return ordersMapper.findByBuyerId(buyerId);
    }

    @Override
    public List<Orders> findBySellerId(Integer sellerId) {
        return ordersMapper.findBySellerId(sellerId);
    }

    @Override
    public Orders findById(Integer id) {
        return ordersMapper.findById(id);
    }

    @Override
    @Transactional
    public int insert(Orders orders) {
        orders.setStatus("pending");
        return ordersMapper.insert(orders);
    }

    @Override
    @Transactional
    public int update(Orders orders) {
        return ordersMapper.update(orders);
    }

    @Override
    public List<Orders> findAll() {
        return ordersMapper.findAll();
    }

    @Override
    public int countAll() {
        return ordersMapper.countAll();
    }

    @Override
    public List<Orders> findUrgedBySellerId(Integer sellerId) {
        return ordersMapper.findUrgedBySellerId(sellerId);
    }

    @Override
    public List<Orders> findConfirmedBySellerId(Integer sellerId) {
        return ordersMapper.findConfirmedBySellerId(sellerId);
    }

    @Override
    public List<Orders> findByBookId(Integer bookId) {
        return ordersMapper.findByBookId(bookId);
    }

    @Override
    @Transactional
    public int deleteByBookId(Integer bookId) {
        return ordersMapper.deleteByBookId(bookId);
    }

    @Override
    @Transactional
    public int deleteById(Integer id) {
        return ordersMapper.deleteById(id);
    }

    @Override
    @Transactional
    public Map<String, Object> createOrder(Integer buyerId, Integer bookId, String address, String phone, String receiverName, Double totalPrice) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (buyerId == null) {
                result.put("code", 400);
                result.put("msg", "请先登录");
                return result;
            }
            if (bookId == null) {
                result.put("code", 400);
                result.put("msg", "请选择商品");
                return result;
            }

            SecondBook book = secondBookMapper.findById(bookId);
            if (book == null) {
                result.put("code", 400);
                result.put("msg", "商品不存在");
                return result;
            }
            if (book.getStatus() == null || !"1".equals(book.getStatus())) {
                result.put("code", 400);
                result.put("msg", "商品已下架或已卖出");
                return result;
            }
            if (book.getSellerId().equals(buyerId)) {
                result.put("code", 400);
                result.put("msg", "不能购买自己发布的商品");
                return result;
            }

            String orderNo = "ORD" + System.currentTimeMillis() + String.format("%04d", new Random().nextInt(10000));

            Orders orders = new Orders();
            orders.setOrderNo(orderNo);
            orders.setBuyerId(buyerId);
            orders.setSellerId(book.getSellerId());
            orders.setBookId(bookId);
            orders.setTotalPrice(totalPrice != null ? totalPrice : book.getPrice());  // 使用传入的总价或图书价格
            orders.setStatus("pending");
            orders.setAddress(address != null ? address : "");
            orders.setPhone(phone != null ? phone : "");
            orders.setReceiverName(receiverName != null && !receiverName.trim().isEmpty() ? receiverName.trim() : "用户" + buyerId);  // 使用传入的收货人或默认值
            ordersMapper.insert(orders);

            book.setStatus("2");
            secondBookMapper.update(book);

            OrderItem item = new OrderItem();
            item.setOrderId(orders.getId());
            item.setBookId(bookId);
            item.setQuantity(1);
            item.setPrice(book.getPrice());
            orderItemMapper.insert(item);

            result.put("code", 200);
            result.put("msg", "下单成功");
            result.put("orderNo", orderNo);
        } catch (Exception e) {
            log.error("下单失败", e);
            result.put("code", 500);
            result.put("msg", "下单失败:" + e.getMessage());
        }
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> shipOrder(Integer id, String trackingNo) {//发货
        Map<String, Object> result = new HashMap<>();
        try {
            if (trackingNo == null || trackingNo.trim().isEmpty()) {
                result.put("code", 400);
                result.put("msg", "请填写快递单号");
                return result;
            }
            Orders orders = ordersMapper.findById(id);
            if (orders != null && "pending".equals(orders.getStatus())) {
                orders.setStatus("shipped");
                orders.setTrackingNo(trackingNo);
                ordersMapper.update(orders);
                result.put("code", 200);
                result.put("msg", "发货成功");
            } else {
                result.put("code", 400);
                result.put("msg", "订单状态异常");
            }
        } catch (Exception e) {
            log.error("发货失败", e);
            result.put("code", 500);
            result.put("msg", "发货失败");
        }
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> urgeOrder(Integer id) {//催发货
        Map<String, Object> result = new HashMap<>();
        try {
            Orders orders = ordersMapper.findById(id);
            if (orders == null) {
                result.put("code", 400);
                result.put("msg", "订单不存在");
                return result;
            }
            if (!"pending".equals(orders.getStatus())) {
                result.put("code", 400);
                result.put("msg", "当前订单状态不支持催发货");
                return result;
            }
            orders.setUrged(1);
            ordersMapper.update(orders);
            result.put("code", 200);
            result.put("msg", "已提醒卖家发货");
        } catch (Exception e) {
            log.error("催发货失败", e);
            result.put("code", 500);
            result.put("msg", "操作失败");
        }
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> confirmShipInfo(Integer id) {//确认发货信息
        Map<String, Object> result = new HashMap<>();
        try {
            Orders orders = ordersMapper.findById(id);
            if (orders == null) {
                result.put("code", 400);
                result.put("msg", "订单不存在");
                return result;
            }
            if (!"shipped".equals(orders.getStatus())) {
                result.put("code", 400);
                result.put("msg", "当前订单状态不支持此操作");
                return result;
            }
            orders.setBuyerConfirmed(1);
            ordersMapper.update(orders);
            result.put("code", 200);
            result.put("msg", "已确认发货信息");
        } catch (Exception e) {
            log.error("确认发货信息失败", e);
            result.put("code", 500);
            result.put("msg", "操作失败");
        }
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> receiveOrder(Integer id) {//确认收货
        Map<String, Object> result = new HashMap<>();
        try {
            Orders orders = ordersMapper.findById(id);
            if (orders != null && "shipped".equals(orders.getStatus())) {
                orders.setStatus("received");
                ordersMapper.update(orders);
                result.put("code", 200);
                result.put("msg", "收货成功");
            } else {
                result.put("code", 400);
                result.put("msg", "订单状态异常");
            }
        } catch (Exception e) {
            log.error("收货失败", e);
            result.put("code", 500);
            result.put("msg", "收货失败");
        }
        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> cancelOrder(Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            Orders orders = ordersMapper.findById(id);
            if (orders == null) {
                result.put("code", 400);
                result.put("msg", "订单不存在");
                return result;
            }
            if (!"pending".equals(orders.getStatus())) {
                result.put("code", 400);
                result.put("msg", "只有待发货订单可以取消");
                return result;
            }
            orders.setStatus("cancelled");
            ordersMapper.update(orders);

            SecondBook book = secondBookMapper.findById(orders.getBookId());
            if (book != null) {
                book.setStatus("1");//将书的状态改为上架
                secondBookMapper.update(book);
            }
            result.put("code", 200);
            result.put("msg", "订单已取消");
        } catch (Exception e) {
            log.error("取消订单失败", e);
            result.put("code", 500);
            result.put("msg", "取消失败");
        }
        return result;
    }
}