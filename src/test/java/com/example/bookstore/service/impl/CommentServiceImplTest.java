package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Comment;
import com.example.bookstore.mapper.CommentMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CommentServiceImplTest {

    @Mock
    private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    @Test
    void testFindByOrderId_Success() {
        Comment comment1 = new Comment();
        comment1.setId(1);
        comment1.setOrderId(10);
        comment1.setUserId(1);
        comment1.setBookId(100);
        comment1.setScore(5);
        comment1.setContent("很好");
        comment1.setUsername("张三");

        Comment comment2 = new Comment();
        comment2.setId(2);
        comment2.setOrderId(10);
        comment2.setUserId(2);
        comment2.setBookId(100);
        comment2.setScore(4);
        comment2.setContent("不错");
        comment2.setUsername("李四");

        List<Comment> mockList = Arrays.asList(comment1, comment2);

        when(commentMapper.findByOrderId(10)).thenReturn(mockList);

        List<Comment> result = commentService.findByOrderId(10);
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("很好", result.get(0).getContent());
        Mockito.verify(commentMapper, Mockito.times(1)).findByOrderId(10);
    }

    @Test
    void testFindByOrderId_Failure() {
        when(commentMapper.findByOrderId(999)).thenReturn(null);

        List<Comment> result = commentService.findByOrderId(999);
        assertNull(result);
        Mockito.verify(commentMapper, Mockito.times(1)).findByOrderId(999);
    }

    @Test
    void testInsert_Success() {
        Comment comment = new Comment();
        comment.setOrderId(10);
        comment.setUserId(1);
        comment.setBookId(100);
        comment.setScore(5);
        comment.setContent("非常好");
        comment.setUsername("张三");

        when(commentMapper.insert(comment)).thenReturn(1);

        int result = commentService.insert(comment);
        assertEquals(1, result);
        Mockito.verify(commentMapper, Mockito.times(1)).insert(comment);
    }

    @Test
    void testInsert_Failure() {
        Comment comment = new Comment();
        comment.setOrderId(10);
        comment.setUserId(1);
        comment.setBookId(100);
        comment.setScore(5);
        comment.setContent("非常好");
        comment.setUsername("张三");

        when(commentMapper.insert(comment)).thenReturn(0);

        int result = commentService.insert(comment);
        assertEquals(0, result);
        Mockito.verify(commentMapper, Mockito.times(1)).insert(comment);
    }
}