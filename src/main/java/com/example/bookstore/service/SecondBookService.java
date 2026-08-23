package com.example.bookstore.service;

import com.example.bookstore.entity.SecondBook;

import java.util.List;
import java.util.Map;

public interface SecondBookService {

    List<SecondBook> findAll();

    List<SecondBook> findByStatus(Integer status);

    List<SecondBook> findByStatusPage(Integer status, int offset, int size, Integer categoryId);

    int countByStatus(Integer status, Integer categoryId);

    List<SecondBook> findBySellerId(Integer sellerId);

    SecondBook findById(Integer id);

    int insert(SecondBook book);

    int update(SecondBook book);

    int deleteById(Integer id);

    List<SecondBook> findByName(String name);

    List<SecondBook> findByNameOrAuthor(String keyword);

    int countAll();

    List<SecondBook> findHotBooks(int limit);

    List<Map<String, Object>> findSellerRanking(int limit);
}