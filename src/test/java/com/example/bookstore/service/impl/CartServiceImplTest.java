package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Cart;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.mapper.CartMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CartServiceImplTest {
    @InjectMocks
    private CartServiceImpl cartService;
    @Mock
    private CartMapper cartMapper;
    @Mock
    private SecondBookMapper secondBookMapper;

    @Test
    void testCartServicefindByUserId_Success() {
        Cart cart1 = new Cart();
        cart1.setId(1);
        cart1.setUserId(1);
        cart1.setBookId(1);
        cart1.setQuantity(1);
        Cart cart2 = new Cart();
        cart2.setId(2);
        cart2.setUserId(1);
        cart2.setBookId(2);
        cart2.setQuantity(1);
        List<Cart> carts = new ArrayList<>();
        carts.add(cart1);
        carts.add(cart2);
        when(cartMapper.findByUserId(1)).thenReturn(carts);
        List<Cart> result = cartService.findByUserId(1);
        assertEquals(carts, result);
        Mockito.verify(cartMapper, Mockito.times(1)).findByUserId(1);
    }
    @Test
    void testCartServicefindByUserId_Failure(){
        when(cartMapper.findByUserId(1)).thenReturn(null);
        List<Cart> result = cartService.findByUserId(1);
        assertEquals(null, result);
        Mockito.verify(cartMapper, Mockito.times(1)).findByUserId(1);
    }
    @Test
    void testCartServicefindByBuyerIdAndBookId_Success() {
        Cart cart = new Cart();
        cart.setId(1);
        cart.setUserId(1);
        cart.setBookId(1);
        cart.setQuantity(1);
        when(cartMapper.findByBuyerIdAndBookId(1, 1)).thenReturn(cart);
        Cart result = cartService.findByBuyerIdAndBookId(1, 1);
        assertEquals(cart, result);
        Mockito.verify(cartMapper, Mockito.times(1)).findByBuyerIdAndBookId(1, 1);
    }
    @Test
    void testCartServicefindByBuyerIdAndBookId_Failure(){
        when(cartMapper.findByBuyerIdAndBookId(1, 1)).thenReturn(null);
        Cart result = cartService.findByBuyerIdAndBookId(1, 1);
        assertEquals(null, result);
        Mockito.verify(cartMapper, Mockito.times(1)).findByBuyerIdAndBookId(1, 1);
    }
    @Test
    void testCartServiceSelectByUidAndBid_Success () {
        Cart cart = new Cart();
        cart.setId(1);
        cart.setUserId(1);
        cart.setBookId(1);
        cart.setQuantity(1);
        when(cartMapper.findByBuyerIdAndBookId(1, 1)).thenReturn(cart);
        Cart result = cartService.selectByUidAndBid(1, 1);
        assertEquals(cart, result);
        Mockito.verify(cartMapper, Mockito.times(1)).findByBuyerIdAndBookId(1, 1);
    }
    @Test
    void testCartServiceSelectByUidAndBid_Failure(){
        when(cartMapper.findByBuyerIdAndBookId(1, 1)).thenReturn(null);
        Cart result = cartService.selectByUidAndBid(1, 1);
        assertEquals(null, result);
        Mockito.verify(cartMapper, Mockito.times(1)).findByBuyerIdAndBookId(1, 1);
    }
    @Test
    void testCartServiceinsert_Success() {
        Cart cart = new Cart();
        cart.setUserId(1);
        cart.setBookId(1);
        cart.setQuantity(1);
        when(cartMapper.insert(cart)).thenReturn(1);
        int result = cartService.insert(cart);
        assertEquals(1, result);
        Mockito.verify(cartMapper, Mockito.times(1)).insert(cart);
    }
    @Test
    void testCartServiceinsert_Failure(){
        Cart cart = new Cart();
        cart.setUserId(1);
        cart.setBookId(1);
        cart.setQuantity(1);
        when(cartMapper.insert(cart)).thenReturn(0);
        int result = cartService.insert(cart);
        assertEquals(0, result);
        Mockito.verify(cartMapper, Mockito.times(1)).insert(cart);
    }
    @Test
    void testCartServiceupdate_Success() {
        Cart cart = new Cart();
        cart.setId(1);
        cart.setUserId(1);
        cart.setBookId(1);
        cart.setQuantity(1);
        when(cartMapper.update(cart)).thenReturn(1);
        int result = cartService.update(cart);
        assertEquals(1, result);
        Mockito.verify(cartMapper, Mockito.times(1)).update(cart);
    }
    @Test
    void testCartServiceupdate_Failure(){
        Cart cart = new Cart();
        cart.setId(1);
        cart.setUserId(1);
        cart.setBookId(1);
        cart.setQuantity(1);
        when(cartMapper.update(cart)).thenReturn(0);
        int result = cartService.update(cart);
        assertEquals(0, result);
        Mockito.verify(cartMapper, Mockito.times(1)).update(cart);
    }
    @Test
    void testCartServicedeleteById_Success() {
        when(cartMapper.deleteById(1)).thenReturn(1);
        int result = cartService.deleteById(1);
        assertEquals(1, result);
        Mockito.verify(cartMapper, Mockito.times(1)).deleteById(1);
    }
    @Test
    void testCartServicedeleteById_Failure(){
        when(cartMapper.deleteById(1)).thenReturn(0);
        int result = cartService.deleteById(1);
        assertEquals(0, result);
        Mockito.verify(cartMapper, Mockito.times(1)).deleteById(1);
    }
    @Test
    void testCartServicedeleteByBuyerIdAndBookId_Success() {
        when(cartMapper.deleteByBuyerIdAndBookId(1, 1)).thenReturn(1);
        int result = cartService.deleteByBuyerIdAndBookId(1, 1);
        assertEquals(1, result);
        Mockito.verify(cartMapper, Mockito.times(1)).deleteByBuyerIdAndBookId(1, 1);
    }
    @Test
    void testCartServicedeleteByBuyerIdAndBookId_Failure(){
        when(cartMapper.deleteByBuyerIdAndBookId(1, 1)).thenReturn(0);
        int result = cartService.deleteByBuyerIdAndBookId(1, 1);
        assertEquals(0, result);
        Mockito.verify(cartMapper, Mockito.times(1)).deleteByBuyerIdAndBookId(1, 1);
    }

    // ==================== 测试 deleteByBookId() 方法 ====================
    @Test
    void testDeleteByBookId_Success() {
        when(cartMapper.deleteByBookId(100)).thenReturn(3);

        int result = cartService.deleteByBookId(100);

        assertEquals(3, result);
        verify(cartMapper, times(1)).deleteByBookId(100);
    }

    @Test
    void testDeleteByBookId_NoRecords() {
        when(cartMapper.deleteByBookId(999)).thenReturn(0);

        int result = cartService.deleteByBookId(999);

        assertEquals(0, result);
        verify(cartMapper, times(1)).deleteByBookId(999);
    }

    // ==================== 测试 addCart() 方法 ====================
    @Test
    void testAddCart_NotLoggedIn() {
        Map<String, Object> result = cartService.addCart(null, 100);

        assertEquals(400, result.get("code"));
        assertEquals("请先登录", result.get("msg"));
        verify(cartMapper, never()).findByBuyerIdAndBookId(anyInt(), anyInt());
    }

    @Test
    void testAddCart_BookNotSelected() {
        Map<String, Object> result = cartService.addCart(1, null);

        assertEquals(400, result.get("code"));
        assertEquals("请选择商品", result.get("msg"));
        verify(secondBookMapper, never()).findById(anyInt());
    }

    @Test
    void testAddCart_CannotBuyOwnProduct() {
        SecondBook book = new SecondBook();
        book.setId(100);
        book.setSellerId(1);  // 卖家ID与买家ID相同

        when(secondBookMapper.findById(100)).thenReturn(book);

        Map<String, Object> result = cartService.addCart(1, 100);

        assertEquals(400, result.get("code"));
        assertEquals("不能购买自己发布的商品", result.get("msg"));
        verify(cartMapper, never()).findByBuyerIdAndBookId(anyInt(), anyInt());
    }

    @Test
    void testAddCart_AlreadyInCart() {
        SecondBook book = new SecondBook();
        book.setId(100);
        book.setSellerId(2);  // 卖家ID不同于买家

        Cart existingCart = new Cart();
        existingCart.setId(10);
        existingCart.setUserId(1);
        existingCart.setBookId(100);
        existingCart.setQuantity(2);

        when(secondBookMapper.findById(100)).thenReturn(book);
        when(cartMapper.findByBuyerIdAndBookId(1, 100)).thenReturn(existingCart);
        when(cartMapper.update(existingCart)).thenReturn(1);

        Map<String, Object> result = cartService.addCart(1, 100);

        assertEquals(200, result.get("code"));
        assertEquals("添加成功", result.get("msg"));
        assertEquals(3, existingCart.getQuantity());  // 数量+1
        verify(cartMapper, never()).insert(any());
        verify(cartMapper, times(1)).update(existingCart);
    }

    @Test
    void testAddCart_NewItemToCart() {
        SecondBook book = new SecondBook();
        book.setId(200);
        book.setSellerId(2);

        when(secondBookMapper.findById(200)).thenReturn(book);
        when(cartMapper.findByBuyerIdAndBookId(1, 200)).thenReturn(null);
        when(cartMapper.insert(any(Cart.class))).thenReturn(1);

        Map<String, Object> result = cartService.addCart(1, 200);

        assertEquals(200, result.get("code"));
        assertEquals("添加成功", result.get("msg"));
        verify(cartMapper, times(1)).insert(any(Cart.class));
        verify(cartMapper, never()).update(any());
    }

    @Test
    void testAddCart_Exception() {
        when(secondBookMapper.findById(100)).thenThrow(new RuntimeException("数据库错误"));

        Map<String, Object> result = cartService.addCart(1, 100);

        assertEquals(500, result.get("code"));
        assertTrue(result.get("msg").toString().contains("添加失败"));
    }
}