package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Category;
import com.example.bookstore.mapper.CategoryMapper;
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
public class CategoryServiceImplTest {

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @Test
    void testFindAll_Success() {
        Category category1 = new Category();
        category1.setId(1);
        category1.setName("小说");
        Category category2 = new Category();
        category2.setId(2);
        category2.setName("教育");
        List<Category> mockList = Arrays.asList(category1, category2);

        when(categoryMapper.findAll()).thenReturn(mockList);

        List<Category> result = categoryService.findAll();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("小说", result.get(0).getName());
        Mockito.verify(categoryMapper, Mockito.times(1)).findAll();
    }

    @Test
    void testFindAll_Failure() {
        when(categoryMapper.findAll()).thenReturn(null);

        List<Category> result = categoryService.findAll();
        assertNull(result);
        Mockito.verify(categoryMapper, Mockito.times(1)).findAll();
    }

    @Test
    void testFindById_Success() {
        Category mockCategory = new Category();
        mockCategory.setId(1);
        mockCategory.setName("小说");

        when(categoryMapper.findById(1)).thenReturn(mockCategory);

        Category result = categoryService.findById(1);
        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("小说", result.getName());
        Mockito.verify(categoryMapper, Mockito.times(1)).findById(1);
    }

    @Test
    void testFindById_Failure() {
        when(categoryMapper.findById(999)).thenReturn(null);

        Category result = categoryService.findById(999);
        assertNull(result);
        Mockito.verify(categoryMapper, Mockito.times(1)).findById(999);
    }

    @Test
    void testInsert_Success() {
        Category category = new Category();
        category.setName("科技");

        when(categoryMapper.insert(category)).thenReturn(1);

        int result = categoryService.insert(category);
        assertEquals(1, result);
        Mockito.verify(categoryMapper, Mockito.times(1)).insert(category);
    }

    @Test
    void testInsert_Failure() {
        Category category = new Category();
        category.setName("科技");

        when(categoryMapper.insert(category)).thenReturn(0);

        int result = categoryService.insert(category);
        assertEquals(0, result);
        Mockito.verify(categoryMapper, Mockito.times(1)).insert(category);
    }

    @Test
    void testUpdate_Success() {
        Category category = new Category();
        category.setId(1);
        category.setName("科技");

        when(categoryMapper.update(category)).thenReturn(1);

        int result = categoryService.update(category);
        assertEquals(1, result);
        Mockito.verify(categoryMapper, Mockito.times(1)).update(category);
    }

    @Test
    void testUpdate_Failure() {
        Category category = new Category();
        category.setId(1);
        category.setName("科技");

        when(categoryMapper.update(category)).thenReturn(0);

        int result = categoryService.update(category);
        assertEquals(0, result);
        Mockito.verify(categoryMapper, Mockito.times(1)).update(category);
    }

    @Test
    void testDeleteById_Success() {
        when(categoryMapper.deleteById(1)).thenReturn(1);

        int result = categoryService.deleteById(1);
        assertEquals(1, result);
        Mockito.verify(categoryMapper, Mockito.times(1)).deleteById(1);
    }

    @Test
    void testDeleteById_Failure() {
        when(categoryMapper.deleteById(999)).thenReturn(0);

        int result = categoryService.deleteById(999);
        assertEquals(0, result);
        Mockito.verify(categoryMapper, Mockito.times(1)).deleteById(999);
    }
}