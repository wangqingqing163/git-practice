package com.example.bookstore.mapper;

import com.example.bookstore.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {

    User findById(Integer id);

    User findByUsername(@Param("username") String username);

    int insert(User user);

    int update(User user);

    int countUsers();

    java.util.List<User> findAll();

    int deleteById(@Param("id") Integer id);
}