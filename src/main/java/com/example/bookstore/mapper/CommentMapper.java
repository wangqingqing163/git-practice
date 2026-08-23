package com.example.bookstore.mapper;

import com.example.bookstore.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {

    List<Comment> findByOrderId(@Param("orderId") Integer orderId);

    List<Comment> findByBookId(@Param("bookId") Integer bookId);

    List<Comment> findAll();

    int insert(Comment comment);

    int deleteByOrderIds(@Param("orderIds") List<Integer> orderIds);

    int deleteById(@Param("id") Integer id);
}