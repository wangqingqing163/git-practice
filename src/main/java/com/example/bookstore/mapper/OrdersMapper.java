package com.example.bookstore.mapper;

import com.example.bookstore.entity.Orders;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OrdersMapper {

    List<Orders> findByBuyerId(@Param("buyerId") Integer buyerId);

    List<Orders> findBySellerId(@Param("sellerId") Integer sellerId);

    Orders findById(Integer id);

    int insert(Orders orders);

    int update(Orders orders);

    List<Orders> findAll();

    int countAll();

    List<Orders> findByBookId(@Param("bookId") Integer bookId);

    int deleteByBookId(@Param("bookId") Integer bookId);

    int deleteById(Integer id);

    List<Orders> findUrgedBySellerId(@Param("sellerId") Integer sellerId);

    List<Orders> findConfirmedBySellerId(@Param("sellerId") Integer sellerId);
}