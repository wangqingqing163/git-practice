package com.example.bookstore.mapper;

import com.example.bookstore.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface OrderItemMapper {

    int insert(OrderItem orderItem);

    int deleteByBookId(@Param("bookId") Integer bookId);
}