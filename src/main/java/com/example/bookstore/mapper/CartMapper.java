package com.example.bookstore.mapper;

import com.example.bookstore.entity.Cart;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CartMapper {

    List<Cart> findByUserId(@Param("userId") Integer userId);

    Cart findByBuyerIdAndBookId(@Param("buyerId") Integer buyerId, @Param("bookId") Integer bookId);

    // 新增
    Cart selectByUidAndBid(@Param("userId") Integer userId, @Param("bookId") Integer bookId);

    int update(Cart cart);

    int insert(Cart cart);

    int deleteById(Integer id);

    int deleteByBuyerIdAndBookId(@Param("buyerId") Integer buyerId, @Param("bookId") Integer bookId);

    Cart findById(@Param("id") Integer id);

    int deleteByBookId(@Param("bookId") Integer bookId);
}