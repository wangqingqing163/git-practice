package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Orders;
import com.example.bookstore.mapper.CartMapper;
import com.example.bookstore.mapper.CommentMapper;
import com.example.bookstore.mapper.OrderItemMapper;
import com.example.bookstore.mapper.OrdersMapper;
import com.example.bookstore.service.OrdersService;
import com.example.bookstore.service.SecondBookService;
import com.example.bookstore.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminServiceImplTest {

    @Mock
    private UserService userService;

    @Mock
    private SecondBookService secondBookService;

    @Mock
    private OrdersService ordersService;

    @Mock
    private OrdersMapper ordersMapper;

    @Mock
    private OrderItemMapper orderItemMapper;

    @Mock
    private CartMapper cartMapper;

    @Mock
    private CommentMapper commentMapper;

    @Mock
    private com.example.bookstore.mapper.FavoriteMapper favoriteMapper;

    @InjectMocks
    private AdminServiceImpl adminService;

    @Test
    void testGetStats_Success() {
        when(userService.countUsers()).thenReturn(10);
        when(secondBookService.countAll()).thenReturn(50);
        when(ordersService.countAll()).thenReturn(200);

        Map<String, Object> result = adminService.getStats();

        assertNotNull(result);
        assertEquals(10, result.get("userCount"));
        assertEquals(50, result.get("bookCount"));
        assertEquals(200, result.get("orderCount"));

        Mockito.verify(userService, Mockito.times(1)).countUsers();
        Mockito.verify(secondBookService, Mockito.times(1)).countAll();
        Mockito.verify(ordersService, Mockito.times(1)).countAll();
    }

    @Test
    void testDeleteBook_Success_NoOrders() {
        Integer bookId = 100;
        when(ordersMapper.findByBookId(bookId)).thenReturn(Collections.emptyList());
        when(secondBookService.deleteById(bookId)).thenReturn(1);

        Map<String, Object> result = adminService.deleteBook(bookId);

        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertEquals("删除成功", result.get("msg"));

        Mockito.verify(cartMapper, Mockito.times(1)).deleteByBookId(bookId);
        Mockito.verify(secondBookService, Mockito.times(1)).deleteById(bookId);
    }

    @Test
    void testDeleteBook_WithOrders() {
        Integer bookId = 100;
        Orders order1 = new Orders();
        order1.setId(1);
        order1.setBookId(bookId);
        Orders order2 = new Orders();
        order2.setId(2);
        order2.setBookId(bookId);

        when(ordersMapper.findByBookId(bookId)).thenReturn(Arrays.asList(order1, order2));
        when(secondBookService.deleteById(bookId)).thenReturn(1);

        Map<String, Object> result = adminService.deleteBook(bookId);

        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertEquals("删除成功", result.get("msg"));

        Mockito.verify(commentMapper, Mockito.times(1)).deleteByOrderIds(Arrays.asList(1, 2));
        Mockito.verify(orderItemMapper, Mockito.times(1)).deleteByBookId(bookId);
        Mockito.verify(ordersMapper, Mockito.times(1)).deleteByBookId(bookId);
        Mockito.verify(cartMapper, Mockito.times(1)).deleteByBookId(bookId);
        Mockito.verify(secondBookService, Mockito.times(1)).deleteById(bookId);
    }

    @Test
    void testDeleteBook_BookNotFound() {
        Integer bookId = 999;
        when(ordersMapper.findByBookId(bookId)).thenReturn(Collections.emptyList());
        when(secondBookService.deleteById(bookId)).thenReturn(0);

        Map<String, Object> result = adminService.deleteBook(bookId);

        assertNotNull(result);
        assertEquals(false, result.get("success"));
        assertEquals("商品不存在", result.get("msg"));
    }

    @Test
    void testDeleteBook_Exception() {
        Integer bookId = 100;
        when(ordersMapper.findByBookId(bookId)).thenThrow(new RuntimeException("数据库连接失败"));

        Map<String, Object> result = adminService.deleteBook(bookId);

        assertNotNull(result);
        assertEquals(false, result.get("success"));
        assertTrue(result.get("msg").toString().contains("删除失败"));
    }

    @Test
    void testUpdateOrderStatus_Success() {
        Integer orderId = 1;
        String newStatus = "shipped";

        Orders mockOrder = new Orders();
        mockOrder.setId(orderId);
        mockOrder.setStatus("pending");

        when(ordersService.findById(orderId)).thenReturn(mockOrder);
        when(ordersService.update(mockOrder)).thenReturn(1);

        Map<String, Object> result = adminService.updateOrderStatus(orderId, newStatus);

        assertNotNull(result);
        assertEquals(true, result.get("success"));
        assertEquals("状态更新成功", result.get("msg"));
        assertEquals(newStatus, mockOrder.getStatus());

        Mockito.verify(ordersService, Mockito.times(1)).findById(orderId);
        Mockito.verify(ordersService, Mockito.times(1)).update(mockOrder);
    }

    @Test
    void testUpdateOrderStatus_InvalidStatus() {
        Integer orderId = 1;
        String invalidStatus = "invalid_status";

        Map<String, Object> result = adminService.updateOrderStatus(orderId, invalidStatus);

        assertNotNull(result);
        assertEquals(false, result.get("success"));
        assertEquals("无效状态值，只支持 pending/shipped/received", result.get("msg"));

        Mockito.verify(ordersService, Mockito.never()).findById(Mockito.anyInt());
        Mockito.verify(ordersService, Mockito.never()).update(Mockito.any());
    }

    @Test
    void testUpdateOrderStatus_OrderNotFound() {
        Integer orderId = 999;
        String newStatus = "shipped";

        when(ordersService.findById(orderId)).thenReturn(null);

        Map<String, Object> result = adminService.updateOrderStatus(orderId, newStatus);

        assertNotNull(result);
        assertEquals(false, result.get("success"));
        assertEquals("订单不存在", result.get("msg"));

        Mockito.verify(ordersService, Mockito.times(1)).findById(orderId);
        Mockito.verify(ordersService, Mockito.never()).update(Mockito.any());
    }

    @Test
    void testUpdateOrderStatus_UpdateFailed() {
        Integer orderId = 1;
        String newStatus = "shipped";

        Orders mockOrder = new Orders();
        mockOrder.setId(orderId);
        mockOrder.setStatus("pending");

        when(ordersService.findById(orderId)).thenReturn(mockOrder);
        when(ordersService.update(mockOrder)).thenReturn(0);

        Map<String, Object> result = adminService.updateOrderStatus(orderId, newStatus);

        assertNotNull(result);
        assertEquals(false, result.get("success"));
        assertEquals("更新失败", result.get("msg"));
    }

    @Test
    void testUpdateOrderStatus_Exception() {
        Integer orderId = 1;
        String newStatus = "shipped";

        when(ordersService.findById(orderId)).thenThrow(new RuntimeException("数据库连接失败"));

        Map<String, Object> result = adminService.updateOrderStatus(orderId, newStatus);

        assertNotNull(result);
        assertEquals(false, result.get("success"));
        assertTrue(result.get("msg").toString().contains("更新失败"));
    }
}