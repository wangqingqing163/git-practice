package com.example.bookstore.mapper;

import com.example.bookstore.entity.SecondBook;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface SecondBookMapper {

    List<SecondBook> findAll();

    List<SecondBook> findByStatus(@Param("status") Integer status);

    List<SecondBook> findByStatusPage(@Param("status") Integer status, @Param("offset") int offset, @Param("size") int size, @Param("categoryId") Integer categoryId);

    int countByStatus(@Param("status") Integer status, @Param("categoryId") Integer categoryId);

    List<SecondBook> findBySellerId(@Param("sellerId") Integer sellerId);

    SecondBook findById(Integer id);

    int insert(SecondBook book);

    int update(SecondBook book);

    int deleteById(@Param("id") Integer id);

    List<SecondBook> findByName(@Param("name") String name);

    List<SecondBook> findByNameOrAuthor(@Param("keyword") String keyword);

    int countAll();

    List<SecondBook> findHotBooks(@Param("limit") int limit);

    List<Map<String, Object>> findSellerRanking(@Param("limit") int limit);

    int clearAllCategoryIds();
}