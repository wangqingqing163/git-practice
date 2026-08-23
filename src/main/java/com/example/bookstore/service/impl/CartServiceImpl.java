package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Cart;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.mapper.CartMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import com.example.bookstore.service.CartService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartServiceImpl implements CartService {

    private static final Logger log = LoggerFactory.getLogger(CartServiceImpl.class);

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private SecondBookMapper secondBookMapper;

    @Override
    public List<Cart> findByUserId(Integer userId) {
        return cartMapper.findByUserId(userId);
    }

    @Override
    public Cart findByBuyerIdAndBookId(Integer buyerId, Integer bookId) {
        return cartMapper.findByBuyerIdAndBookId(buyerId, bookId);
    }

    @Override
    public Cart selectByUidAndBid(Integer userId, Integer bookId) {
        return cartMapper.findByBuyerIdAndBookId(userId, bookId);
    }

    @Override
    @Transactional
    public int update(Cart cart) {
        return cartMapper.update(cart);
    }

    @Override
    @Transactional
    public int insert(Cart cart) {
        return cartMapper.insert(cart);
    }

    @Override
    @Transactional
    public int deleteById(Integer id) {
        return cartMapper.deleteById(id);
    }

    @Override
    @Transactional
    public int deleteByBuyerIdAndBookId(Integer buyerId, Integer bookId) {
        return cartMapper.deleteByBuyerIdAndBookId(buyerId, bookId);
    }

    @Override
    @Transactional
    public int deleteByBookId(Integer bookId) {
        return cartMapper.deleteByBookId(bookId);
    }

    @Override
    @Transactional
    public Map<String, Object> addCart(Integer userId, Integer secondBookId) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (userId == null) {
                result.put("code", 400);
                result.put("msg", "请先登录");
                return result;
            }
            if (secondBookId == null) {
                result.put("code", 400);
                result.put("msg", "请选择商品");
                return result;
            }

            SecondBook book = secondBookMapper.findById(secondBookId);
            if (book != null && book.getSellerId().equals(userId)) {
                result.put("code", 400);
                result.put("msg", "不能购买自己发布的商品");
                return result;
            }

            Cart oldCart = cartMapper.findByBuyerIdAndBookId(userId, secondBookId);

            if (oldCart != null) {
                oldCart.setQuantity(oldCart.getQuantity() + 1);
                cartMapper.update(oldCart);
            } else {
                Cart cart = new Cart();
                cart.setUserId(userId);
                cart.setBookId(secondBookId);
                cart.setQuantity(1);
                cartMapper.insert(cart);
            }
            result.put("code", 200);
            result.put("msg", "添加成功");
        } catch (Exception e) {
            log.error("添加购物车失败", e);
            result.put("code", 500);
            result.put("msg", "添加失败: " + e.getMessage());
        }
        return result;
    }
}