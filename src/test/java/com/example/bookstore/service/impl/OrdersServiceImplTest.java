package com.example.bookstore.service.impl;

import com.example.bookstore.entity.OrderItem;
import com.example.bookstore.entity.Orders;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.mapper.OrderItemMapper;
import com.example.bookstore.mapper.OrdersMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class OrdersServiceImplTest {

    @Mock
    private OrdersMapper ordersMapper;
    @Mock
    private SecondBookMapper secondBookMapper;
    @Mock
    private OrderItemMapper orderItemMapper;
    @InjectMocks
    private OrdersServiceImpl ordersService;

    // ==================== 测试1：按买家ID查询 ====================
    @Test
    void testFindByBuyerId_WithData() {
        Orders order1 = new Orders();// 创建订单1
        order1.setId(1);// 设置ID
        order1.setBuyerId(1);// 设置买家ID
        order1.setStatus("pending");// 设置状态
        order1.setTotalPrice(99.99);// 设置总价

        Orders order2 = new Orders();// 创建订单2
        order2.setId(2);// 设置ID
        order2.setBuyerId(1);// 设置买家ID
        order2.setStatus("paid");// 设置状态
        order2.setTotalPrice(199.99);// 设置总价

        List<Orders> mockList = Arrays.asList(order1, order2);

        Mockito.when(ordersMapper.findByBuyerId(1)).thenReturn(mockList);

        List<Orders> result = ordersService.findByBuyerId(1);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getBuyerId());
        Mockito.verify(ordersMapper, Mockito.times(1)).findByBuyerId(1);
    }

    @Test
    void testFindByBuyerId_Empty() {
        Mockito.when(ordersMapper.findByBuyerId(999)).thenReturn(Arrays.asList());

        List<Orders> result = ordersService.findByBuyerId(999);

        assertNotNull(result);
        assertTrue(result.isEmpty());
        Mockito.verify(ordersMapper, Mockito.times(1)).findByBuyerId(999);
    }

    // ==================== 测试2：按卖家ID查询 ====================
    @Test
    void testFindBySellerId_WithData() {
        Orders order1 = new Orders();
        order1.setId(1);
        order1.setSellerId(10);
        order1.setStatus("pending");
        order1.setTotalPrice(99.99);

        Orders order2 = new Orders();
        order2.setId(2);
        order2.setSellerId(10);
        order2.setStatus("shipped");
        order2.setTotalPrice(299.99);

        List<Orders> mockList = Arrays.asList(order1, order2);

        Mockito.when(ordersMapper.findBySellerId(10)).thenReturn(mockList);

        List<Orders> result = ordersService.findBySellerId(10);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(10, result.get(0).getSellerId());
        Mockito.verify(ordersMapper, Mockito.times(1)).findBySellerId(10);
    }

    @Test
    void testFindBySellerId_Empty() {
        Mockito.when(ordersMapper.findBySellerId(999)).thenReturn(Arrays.asList());

        List<Orders> result = ordersService.findBySellerId(999);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ==================== 测试3：根据ID查询（存在） ====================
    @Test
    void testFindById_WhenExists() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setBuyerId(1);
        mockOrder.setSellerId(10);
        mockOrder.setStatus("pending");
        mockOrder.setTotalPrice(99.99);

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);

        Orders result = ordersService.findById(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("pending", result.getStatus());
        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
    }

    @Test
    void testFindById_WhenNotFound() {
        Mockito.when(ordersMapper.findById(999)).thenReturn(null);

        Orders result = ordersService.findById(999);

        assertNull(result);
        Mockito.verify(ordersMapper, Mockito.times(1)).findById(999);
    }

    // ==================== 测试4：插入订单（⭐ 重点！有业务逻辑） ====================
    @Test
    void testInsert_Success() {
        Orders newOrder = new Orders();
        newOrder.setBuyerId(1);
        newOrder.setSellerId(10);
        newOrder.setBookId(100);
        newOrder.setTotalPrice(99.99);
        // 注意：没有设置 status

        Mockito.when(ordersMapper.insert(newOrder)).thenReturn(1);

        int result = ordersService.insert(newOrder);

        // 断言1：插入成功
        assertEquals(1, result);

        // 断言2：⭐ 关键！验证 Service 里是否自动设置了 status = "pending"
        assertEquals("pending", newOrder.getStatus());

        Mockito.verify(ordersMapper, Mockito.times(1)).insert(newOrder);
    }

    @Test
    void testInsert_Failure() {
        Orders newOrder = new Orders();
        newOrder.setBuyerId(1);
        newOrder.setSellerId(10);
        newOrder.setTotalPrice(99.99);

        Mockito.when(ordersMapper.insert(newOrder)).thenReturn(0);

        int result = ordersService.insert(newOrder);

        assertEquals(0, result);
        // 即使插入失败，status 也应该被设置为 "pending"
        assertEquals("pending", newOrder.getStatus());
        Mockito.verify(ordersMapper, Mockito.times(1)).insert(newOrder);
    }

    // ==================== 测试5：更新订单 ====================
    @Test
    void testUpdate_Success() {
        Orders existingOrder = new Orders();
        existingOrder.setId(1);
        existingOrder.setStatus("paid");

        Mockito.when(ordersMapper.update(existingOrder)).thenReturn(1);

        int result = ordersService.update(existingOrder);

        assertEquals(1, result);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(existingOrder);
    }

    @Test
    void testUpdate_NotFound() {
        Orders nonExistingOrder = new Orders();
        nonExistingOrder.setId(999);
        nonExistingOrder.setStatus("paid");

        Mockito.when(ordersMapper.update(nonExistingOrder)).thenReturn(0);

        int result = ordersService.update(nonExistingOrder);

        assertEquals(0, result);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(nonExistingOrder);
    }

    // ==================== 测试6：查询所有订单 ====================
    @Test
    void testFindAll_WithData() {
        Orders order1 = new Orders();
        order1.setId(1);
        order1.setTotalPrice(99.99);
        Orders order2 = new Orders();
        order2.setId(2);
        order2.setTotalPrice(199.99);

        List<Orders> mockList = Arrays.asList(order1, order2);
        Mockito.when(ordersMapper.findAll()).thenReturn(mockList);

        List<Orders> result = ordersService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        Mockito.verify(ordersMapper, Mockito.times(1)).findAll();
    }

    @Test
    void testFindAll_Empty() {
        Mockito.when(ordersMapper.findAll()).thenReturn(Arrays.asList());

        List<Orders> result = ordersService.findAll();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    // ==================== 测试7：统计订单总数 ====================
    @Test
    void testCountAll() {
        Mockito.when(ordersMapper.countAll()).thenReturn(10);

        int count = ordersService.countAll();

        assertEquals(10, count);
        Mockito.verify(ordersMapper, Mockito.times(1)).countAll();
    }

    @Test
    void testCountAll_Empty() {
        Mockito.when(ordersMapper.countAll()).thenReturn(0);

        int count = ordersService.countAll();

        assertEquals(0, count);
    }
    // ==================== 测试8：发货 ====================

    @Test
    void testShipOrder_Success() {//正常发货流程
        // 1. 准备数据：订单状态为 pending
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.when(ordersMapper.update(mockOrder)).thenReturn(1);

        // 2. 执行
        String trackingNo = "SF1234567890";
        Map<String, Object> result = ordersService.shipOrder(1, trackingNo);

        // 3. 断言
        assertEquals(200, result.get("code"));
        assertEquals("发货成功", result.get("msg"));
        assertEquals("shipped", mockOrder.getStatus());
        assertEquals(trackingNo, mockOrder.getTrackingNo());

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(mockOrder);
    }

    @Test
    void testShipOrder_EmptyTrackingNo() {
        // 1. 执行：快递单号为空
        Map<String, Object> result = ordersService.shipOrder(1, "");

        // 2. 断言
        assertEquals(400, result.get("code"));
        assertEquals("请填写快递单号", result.get("msg"));

        // 3. 验证 Mapper 没有被调用
        Mockito.verify(ordersMapper, Mockito.never()).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).update(Mockito.any(Orders.class));
    }

    @Test
    void testShipOrder_OrderNotFound() {
        // 1. Mock：订单不存在
        Mockito.when(ordersMapper.findById(999)).thenReturn(null);

        // 2. 执行
        Map<String, Object> result = ordersService.shipOrder(999, "SF1234567890");

        // 3. 断言
        assertEquals(400, result.get("code"));
        assertEquals("订单状态异常", result.get("msg"));

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(999);
        Mockito.verify(ordersMapper, Mockito.never()).update(Mockito.any(Orders.class));
    }

    @Test
    void testShipOrder_InvalidStatus() {
        // 1. 准备数据：订单状态不是 pending
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("shipped");  // ❌ 已经发货了

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);

        // 2. 执行
        Map<String, Object> result = ordersService.shipOrder(1, "SF1234567890");

        // 3. 断言
        assertEquals(400, result.get("code"));
        assertEquals("订单状态异常", result.get("msg"));

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).update(Mockito.any(Orders.class));
    }
    @Test
    void testshipOrder_Fails() {//异常场景
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");
        mockOrder.setBookId(100);
        mockOrder.setTrackingNo("SF1234567890");
        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.doThrow(new RuntimeException("数据库异常"))
                .when(ordersMapper).update(mockOrder);
        Map<String, Object> result = ordersService.shipOrder(1, "SF1234567890");

        // 4. 断言：返回 500
        assertEquals(500, result.get("code"));
        assertEquals("发货失败", result.get("msg"));
    }

    // ==================== 测试9：取消订单 ====================

    @Test
    void testFindByBookId_Success() {
        Orders orders1=new Orders();
        orders1.setId(1);
        orders1.setStatus("pending");
        orders1.setBookId(100);
        when(ordersMapper.findByBookId(1)).thenReturn(Arrays.asList(orders1));
        List<Orders> result = ordersService.findByBookId(1);
        assertEquals(1, result.size());
        Mockito.verify(ordersMapper, Mockito.times(1)).findByBookId(1);
    }
    @Test
    void testFindByBookId_Failure() {
        when(ordersMapper.findByBookId(999)).thenReturn(Arrays.asList());
        List<Orders> result = ordersService.findByBookId(999);
        assertEquals(0, result.size());
        Mockito.verify(ordersMapper, Mockito.times(1)).findByBookId(999);
    }
    @Test
    void testDeleteByBookId_Success() {
        Orders orders1=new Orders();
        orders1.setId(1);
        orders1.setStatus("pending");
        orders1.setBookId(100);
        when(ordersMapper.deleteByBookId(1)).thenReturn(1);
        int result = ordersService.deleteByBookId(1);
        assertEquals(1, result);
        Mockito.verify(ordersMapper, Mockito.times(1)).deleteByBookId(1);
    }
    @Test
    void testDeleteByBookId_Failure(){
        when(ordersMapper.deleteByBookId(999)).thenReturn(0);
        int result = ordersService.deleteByBookId(999);
        assertEquals(0, result);
        Mockito.verify(ordersMapper, Mockito.times(1)).deleteByBookId(999);
    }

    @Test
    void testCancelOrder_NotPending() {//取消订单，订单状态不是 pending（待发货），不能取消
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("shipped");  // ❌ 已经发货，不能取消

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);

        Map<String, Object> result = ordersService.cancelOrder(1);

        assertEquals(400, result.get("code"));
        assertEquals("只有待发货订单可以取消", result.get("msg"));

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).update(Mockito.any(Orders.class));
    }

    @Test
    void testCancelOrder_NotFound() {
        Mockito.when(ordersMapper.findById(999)).thenReturn(null);

        Map<String, Object> result = ordersService.cancelOrder(999);

        assertEquals(400, result.get("code"));
        assertEquals("订单不存在", result.get("msg"));
    }
    @Test
    void testCancelOrder_Success() {
        // 1. 准备数据：订单状态为 pending，关联的图书存在
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");
        mockOrder.setBookId(100);

        SecondBook mockBook = new SecondBook();
        mockBook.setId(100);
        mockBook.setStatus("2");  // 已售出状态

        // 2. Mock Mapper 行为
        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.when(ordersMapper.update(mockOrder)).thenReturn(1);
        Mockito.when(secondBookMapper.findById(100)).thenReturn(mockBook);
        Mockito.when(secondBookMapper.update(mockBook)).thenReturn(1);

        // 3. 执行
        Map<String, Object> result = ordersService.cancelOrder(1);

        // 4. 断言
        assertEquals(200, result.get("code"));
        assertEquals("订单已取消", result.get("msg"));
        assertEquals("cancelled", mockOrder.getStatus());
        assertEquals("1", mockBook.getStatus());  // 图书恢复为在售

        // 5. 验证调用次数
        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(mockOrder);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(100);
        Mockito.verify(secondBookMapper, Mockito.times(1)).update(mockBook);
    }
    @Test
    void testCancelOrder_BookNotFound() {
        // 1. 订单存在，但图书不存在
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");
        mockOrder.setBookId(999);

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.when(ordersMapper.update(mockOrder)).thenReturn(1);
        Mockito.when(secondBookMapper.findById(999)).thenReturn(null);  // 图书不存在

        // 2. 执行
        Map<String, Object> result = ordersService.cancelOrder(1);

        // 3. 断言：订单成功取消，但图书不更新
        assertEquals(200, result.get("code"));
        assertEquals("订单已取消", result.get("msg"));
        assertEquals("cancelled", mockOrder.getStatus());

        // 4. 验证：只更新了订单，没有更新图书
        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(mockOrder);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(999);
        Mockito.verify(secondBookMapper, Mockito.never()).update(Mockito.any(SecondBook.class));
    }
    @Test
    void testCancelOrder_UpdateFails() {
        // 1. 准备数据
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");
        mockOrder.setBookId(100);

        SecondBook mockBook = new SecondBook();
        mockBook.setId(100);
        mockBook.setStatus("2");

        // 2. 当更新订单时抛出异常
        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.doThrow(new RuntimeException("数据库异常"))
                .when(ordersMapper).update(mockOrder);

        // 3. 执行
        Map<String, Object> result = ordersService.cancelOrder(1);

        // 4. 断言：返回 500
        assertEquals(500, result.get("code"));
        assertEquals("取消失败", result.get("msg"));
    }

    // ==================== 测试10：催发货 ====================

    @Test
    void testUrgeOrder_Success() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");
        mockOrder.setUrged(0);

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.when(ordersMapper.update(mockOrder)).thenReturn(1);

        Map<String, Object> result = ordersService.urgeOrder(1);

        assertEquals(200, result.get("code"));
        assertEquals("已提醒卖家发货", result.get("msg"));
        assertEquals(1, mockOrder.getUrged());

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(mockOrder);
    }

    @Test
    void testUrgeOrder_AlreadyShipped() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("shipped");

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);

        Map<String, Object> result = ordersService.urgeOrder(1);

        assertEquals(400, result.get("code"));
        assertEquals("当前订单状态不支持催发货", result.get("msg"));

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).update(Mockito.any(Orders.class));
    }

    @Test
    void testUrgeOrder_NotFound() {
        Mockito.when(ordersMapper.findById(999)).thenReturn(null);

        Map<String, Object> result = ordersService.urgeOrder(999);

        assertEquals(400, result.get("code"));
        assertEquals("订单不存在", result.get("msg"));
    }
    @Test
    void testurgeOrder_Fails() {//异常场景
        // 1. 准备数据
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");
        mockOrder.setBookId(100);
        // 2. 当更新订单时抛出异常
        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.doThrow(new RuntimeException("数据库异常"))
                .when(ordersMapper).update(mockOrder);
        Map<String, Object> result = ordersService.urgeOrder(1);
        assertEquals(500, result.get("code"));
        assertEquals("操作失败", result.get("msg"));
    }


    // ==================== 测试11：确认发货信息 ====================

    @Test
    void testConfirmShipInfo_Success() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("shipped");
        mockOrder.setBuyerConfirmed(0);

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.when(ordersMapper.update(mockOrder)).thenReturn(1);

        Map<String, Object> result = ordersService.confirmShipInfo(1);

        assertEquals(200, result.get("code"));
        assertEquals("已确认发货信息", result.get("msg"));
        assertEquals(1, mockOrder.getBuyerConfirmed());

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(mockOrder);
    }
    @Test
    void testConfirmShipInfo_UpdateFails() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("shipped");
        mockOrder.setBookId(100);
        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.doThrow(new RuntimeException("数据库异常"))
                .when(ordersMapper).update(mockOrder);
        Map<String, Object> result = ordersService.confirmShipInfo(1);
        assertEquals(500, result.get("code"));
        assertEquals("操作失败", result.get("msg"));
    }
    @Test
    void testConfirmShipInfo_NotFound() {
        Mockito.when(ordersMapper.findById(999)).thenReturn(null);

        Map<String, Object> result = ordersService.confirmShipInfo(999);

        assertEquals(400, result.get("code"));
        assertEquals("订单不存在", result.get("msg"));
    }
    @Test
    void testConfirmShipInfo_NotShipped() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);

        Map<String, Object> result = ordersService.confirmShipInfo(1);

        assertEquals(400, result.get("code"));
        assertEquals("当前订单状态不支持此操作", result.get("msg"));

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).update(Mockito.any(Orders.class));
    }

    // ==================== 测试12：确认收货 ====================

    @Test
    void testReceiveOrder_Success() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("shipped");

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.when(ordersMapper.update(mockOrder)).thenReturn(1);

        Map<String, Object> result = ordersService.receiveOrder(1);

        assertEquals(200, result.get("code"));
        assertEquals("收货成功", result.get("msg"));
        assertEquals("received", mockOrder.getStatus());

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.times(1)).update(mockOrder);
    }

    @Test
    void testReceiveOrder_NotShipped() {
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");

        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);

        Map<String, Object> result = ordersService.receiveOrder(1);

        assertEquals(400, result.get("code"));
        assertEquals("订单状态异常", result.get("msg"));

        Mockito.verify(ordersMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).update(Mockito.any(Orders.class));
    }
    @Test
    void testReceiveOrder_Fails() {//异常场景
        // 1. 准备数据
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("shipped");
        mockOrder.setBookId(100);
        // 2. 当更新订单时抛出异常
        Mockito.when(ordersMapper.findById(1)).thenReturn(mockOrder);
        Mockito.doThrow(new RuntimeException("数据库异常"))
                .when(ordersMapper).update(mockOrder);
        Map<String, Object> result = ordersService.receiveOrder(1);
        assertEquals(500, result.get("code"));
        assertEquals("收货失败", result.get("msg"));
    }
    // ==================== 测试13：查询被催订单 ====================

    @Test
    void testFindUrgedBySellerId() {
        Orders order1 = new Orders();
        order1.setId(1);
        order1.setSellerId(10);
        order1.setUrged(1);

        Orders order2 = new Orders();
        order2.setId(2);
        order2.setSellerId(10);
        order2.setUrged(1);

        List<Orders> mockList = Arrays.asList(order1, order2);

        Mockito.when(ordersMapper.findUrgedBySellerId(10)).thenReturn(mockList);

        List<Orders> result = ordersService.findUrgedBySellerId(10);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getUrged());

        Mockito.verify(ordersMapper, Mockito.times(1)).findUrgedBySellerId(10);
    }

    // ==================== 测试14：查询已确认订单 ====================

    @Test
    void testFindConfirmedBySellerId() {
        Orders order1 = new Orders();
        order1.setId(1);
        order1.setSellerId(10);
        order1.setBuyerConfirmed(1);

        List<Orders> mockList = Arrays.asList(order1);

        Mockito.when(ordersMapper.findConfirmedBySellerId(10)).thenReturn(mockList);

        List<Orders> result = ordersService.findConfirmedBySellerId(10);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getBuyerConfirmed());

        Mockito.verify(ordersMapper, Mockito.times(1)).findConfirmedBySellerId(10);
    }
    // ==================== 测试14：创建订单 ====================
    @Test
    void testCreateOrder_Success() {
        // 1. 准备数据：正常在售的图书，买家 ID 和卖家 ID 不同
        SecondBook mockBook = new SecondBook();
        mockBook.setId(1);
        mockBook.setSellerId(2);    // 卖家 ID = 2
        mockBook.setStatus("1");    // 在售
        mockBook.setPrice(99.99);

        // 2. Mock Mapper 行为
        Mockito.when(secondBookMapper.findById(1)).thenReturn(mockBook);

        // Mock 订单插入：返回 1 表示成功
        Mockito.when(ordersMapper.insert(Mockito.any(Orders.class))).thenReturn(1);

        // Mock 图书更新：返回 1 表示成功
        Mockito.when(secondBookMapper.update(mockBook)).thenReturn(1);

        // Mock 订单项插入：返回 1 表示成功
        Mockito.when(orderItemMapper.insert(Mockito.any(OrderItem.class))).thenReturn(1);

        // 3. 执行：买家 ID = 1，图书 ID = 1
        Map<String, Object> result = ordersService.createOrder(1, 1, "北京市朝阳区", "13800138000", "张三", 99.99);

        // 4. 断言
        assertEquals(200, result.get("code"));
        assertEquals("下单成功", result.get("msg"));
        assertNotNull(result.get("orderNo"));  // 订单号不为空

        // 5. 验证：图书状态被改为 "2"（已售出）
        assertEquals("2", mockBook.getStatus());

        // 6. 验证：所有 Mapper 方法都被调用了 1 次
        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.times(1)).insert(Mockito.any(Orders.class));
        Mockito.verify(secondBookMapper, Mockito.times(1)).update(mockBook);
        Mockito.verify(orderItemMapper, Mockito.times(1)).insert(Mockito.any(OrderItem.class));
    }

    @Test
    void testCreateOrder_BuyerIdNull() {
        // buyerId 传 null，直接触发 "请先登录" 分支
        // 不需要 Mock 任何 Mapper，因为方法根本不会走到 Mapper 调用
        Map<String, Object> result = ordersService.createOrder(null, 1, "", "", "", 0.0);

        assertEquals(400, result.get("code"));
        assertEquals("请先登录", result.get("msg"));

        // 验证：Mapper 的 findById 没有被调用
        Mockito.verify(ordersMapper, Mockito.never()).findById(Mockito.anyInt());
    }
    @Test
    void testCreateOrder_BookIdNull() {
        Map<String, Object> result = ordersService.createOrder(1, null, "", "", "", 0.0);
        assertEquals(400, result.get("code"));
        assertEquals("请选择商品", result.get("msg"));
        Mockito.verify(ordersMapper, Mockito.never()).findById(Mockito.anyInt());
    }
    @Test
    void testCreateOrder_BookNotFound(){
        Mockito.when(secondBookMapper.findById(999)).thenReturn(null);

        // 2. 执行
        Map<String, Object> result = ordersService.createOrder(1, 999, "", "", "", 0.0);

        // 3. 断言
        assertEquals(400, result.get("code"));
        assertEquals("商品不存在", result.get("msg"));

        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(999);
        Mockito.verify(secondBookMapper, Mockito.never()).insert(Mockito.any(SecondBook.class));
    }
    @Test
    void testCreateOrder_SellerIdEqualsBuyerId(){
        SecondBook mockBook = new SecondBook();
        mockBook.setId(1);
        mockBook.setSellerId(1);//卖家的id为1
        mockBook.setStatus("1");    // 在售
        mockBook.setPrice(99.99);
        Mockito.when(secondBookMapper.findById(1)).thenReturn(mockBook);
        Map<String, Object> result = ordersService.createOrder(1, 1, "北京市朝阳区", "13800138000", "张三", 99.99);
        assertEquals(400, result.get("code"));
        assertEquals("不能购买自己发布的商品", result.get("msg"));
        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).insert(Mockito.any(Orders.class));
    }
    @Test
    void testCreateOrder_BookNotOnSale() {
        // 1. 准备数据：图书状态不是 "1"（比如是 "2" 已售出）
        SecondBook mockBook = new SecondBook();
        mockBook.setId(1);
        mockBook.setSellerId(2);
        mockBook.setStatus("2");  // ❌ 已售出，不是 "1"

        // 2. Mock Mapper 行为
        Mockito.when(secondBookMapper.findById(1)).thenReturn(mockBook);

        // 3. 执行：买家 ID = 1，图书 ID = 1
        Map<String, Object> result = ordersService.createOrder(1, 1, "", "", "", 0.0);

        // 4. 断言
        assertEquals(400, result.get("code"));
        assertEquals("商品已下架或已卖出", result.get("msg"));

        // 5. 验证：只调用了 findById，没有调用 insert
        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(1);
        Mockito.verify(ordersMapper, Mockito.never()).insert(Mockito.any(Orders.class));
    }

    @Test
    void testCreateOrder_BookStatusNull() {
        // 1. 准备数据：图书状态为 null
        SecondBook mockBook = new SecondBook();
        mockBook.setId(1);
        mockBook.setSellerId(2);
        mockBook.setStatus(null);  // ❌ 状态为 null

        Mockito.when(secondBookMapper.findById(1)).thenReturn(mockBook);

        Map<String, Object> result = ordersService.createOrder(1, 1, "", "", "", 0.0);

        assertEquals(400, result.get("code"));
        assertEquals("商品已下架或已卖出", result.get("msg"));
    }
    @Test
    void testCreateOrdeFails() {
        // 1. 准备数据
        Orders mockOrder = new Orders();
        mockOrder.setId(1);
        mockOrder.setStatus("pending");
        mockOrder.setBookId(100);
        SecondBook mockBook = new SecondBook();
        mockBook.setId(100);
        mockBook.setStatus("1");
        mockBook.setSellerId(12);
        Mockito.when(secondBookMapper.findById(100)).thenReturn(mockBook);
        Mockito.doThrow(new RuntimeException("数据库异常"))
                .when(ordersMapper).insert(Mockito.any(Orders.class));

        // 3. 执行
        Map<String, Object> result = ordersService.createOrder(1, 100, "", "", "", 0.0);

        // 4. 断言：返回 500
        assertEquals(500, result.get("code"));
        assertEquals("下单失败:数据库异常", result.get("msg"));
    }


}