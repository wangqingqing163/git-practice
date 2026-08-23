package com.example.bookstore.service.impl;

import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.mapper.CartMapper;
import com.example.bookstore.mapper.FavoriteMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import com.example.bookstore.service.SecondBookService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class SecondBookServiceImpl implements SecondBookService {

    private static final Logger log = LoggerFactory.getLogger(SecondBookServiceImpl.class);

    @Autowired
    private SecondBookMapper secondBookMapper;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private FavoriteMapper favoriteMapper;

    @Override
    public List<SecondBook> findAll() {
        return secondBookMapper.findAll();
    }

    @Override
    public List<SecondBook> findByStatus(Integer status) {
        return secondBookMapper.findByStatus(status);
    }

    @Override
    public List<SecondBook> findByStatusPage(Integer status, int offset, int size, Integer categoryId) {
        return secondBookMapper.findByStatusPage(status, offset, size, categoryId);
    }

    @Override
    public int countByStatus(Integer status, Integer categoryId) {
        return secondBookMapper.countByStatus(status, categoryId);
    }

    @Override
    public List<SecondBook> findBySellerId(Integer sellerId) {
        return secondBookMapper.findBySellerId(sellerId);
    }

    @Override
    public SecondBook findById(Integer id) {
        return secondBookMapper.findById(id);
    }

    @Override
    @Transactional
    public int insert(SecondBook book) {
        return secondBookMapper.insert(book);
    }

    @Override
    @Transactional
    public int update(SecondBook book) {
        return secondBookMapper.update(book);
    }

    @Override
    @Transactional
    public int deleteById(Integer id) {
        log.info("开始删除图书，ID: {}", id);

        try {
            // 1. 删除购物车中的该图书记录（避免外键约束）
            int cartDeleted = cartMapper.deleteByBookId(id);
            if (cartDeleted > 0) {
                log.info("已清理购物车记录: {} 条", cartDeleted);
            }

            // 2. 删除收藏表中的该图书记录（避免外键约束）
            int favoriteDeleted = favoriteMapper.deleteByBookId(id);
            if (favoriteDeleted > 0) {
                log.info("已清理收藏记录: {} 条", favoriteDeleted);
            }

            // 3. 最后删除图书本身
            int rows = secondBookMapper.deleteById(id);
            log.info("图书删除完成，影响行数: {}", rows);

            return rows;
        } catch (Exception e) {
            log.error("删除图书失败，ID: {}, 错误: {}", id, e.getMessage(), e);
            throw e; // 重新抛出异常，让事务回滚
        }
    }

    @Override
    public List<SecondBook> findByName(String name) {
        return secondBookMapper.findByName(name);
    }

    @Override
    public List<SecondBook> findByNameOrAuthor(String keyword) {
        return secondBookMapper.findByNameOrAuthor(keyword);
    }

    @Override
    public int countAll() {
        return secondBookMapper.countAll();
    }

    @Override
    public List<SecondBook> findHotBooks(int limit) {
        return secondBookMapper.findHotBooks(limit);
    }

    @Override
    public List<Map<String, Object>> findSellerRanking(int limit) {
        return secondBookMapper.findSellerRanking(limit);
    }
}