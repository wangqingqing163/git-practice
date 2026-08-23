package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Favorite;
import com.example.bookstore.mapper.FavoriteMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FavoriteServiceImplTest {

    @Mock
    private FavoriteMapper favoriteMapper;

    @InjectMocks
    private FavoriteServiceImpl favoriteService;

    @Test
    void testFindByUserId_Success() {
        Favorite fav1 = new Favorite();
        fav1.setId(1);
        fav1.setUserId(1);
        fav1.setBookId(100);

        Favorite fav2 = new Favorite();
        fav2.setId(2);
        fav2.setUserId(1);
        fav2.setBookId(200);

        List<Favorite> mockList = Arrays.asList(fav1, fav2);

        when(favoriteMapper.findByUserId(1)).thenReturn(mockList);

        List<Favorite> result = favoriteService.findByUserId(1);
        assertNotNull(result);
        assertEquals(2, result.size());
        Mockito.verify(favoriteMapper, Mockito.times(1)).findByUserId(1);
    }

    @Test
    void testFindByUserId_Failure() {
        when(favoriteMapper.findByUserId(999)).thenReturn(null);

        List<Favorite> result = favoriteService.findByUserId(999);
        assertNull(result);
        Mockito.verify(favoriteMapper, Mockito.times(1)).findByUserId(999);
    }

    @Test
    void testIsFavorited_True() {
        Favorite mockFavorite = new Favorite();
        mockFavorite.setId(1);
        mockFavorite.setUserId(1);
        mockFavorite.setBookId(100);

        when(favoriteMapper.findByUserIdAndBookId(1, 100)).thenReturn(mockFavorite);

        boolean result = favoriteService.isFavorited(1, 100);
        assertTrue(result);
        Mockito.verify(favoriteMapper, Mockito.times(1)).findByUserIdAndBookId(1, 100);
    }

    @Test
    void testIsFavorited_False() {
        when(favoriteMapper.findByUserIdAndBookId(1, 999)).thenReturn(null);

        boolean result = favoriteService.isFavorited(1, 999);
        assertFalse(result);
        Mockito.verify(favoriteMapper, Mockito.times(1)).findByUserIdAndBookId(1, 999);
    }

    @Test
    void testAddFavorite_Success() {
        when(favoriteMapper.insert(org.mockito.ArgumentMatchers.any(Favorite.class))).thenReturn(1);

        boolean result = favoriteService.addFavorite(1, 100);
        assertTrue(result);
        Mockito.verify(favoriteMapper, Mockito.times(1)).insert(org.mockito.ArgumentMatchers.any(Favorite.class));
    }

    @Test
    void testAddFavorite_Failure() {
        when(favoriteMapper.insert(org.mockito.ArgumentMatchers.any(Favorite.class)))
                .thenThrow(new RuntimeException("数据库错误"));

        boolean result = favoriteService.addFavorite(1, 100);
        assertFalse(result);
        Mockito.verify(favoriteMapper, Mockito.times(1)).insert(org.mockito.ArgumentMatchers.any(Favorite.class));
    }

    @Test
    void testRemoveFavorite_Success() {
        when(favoriteMapper.deleteByUserIdAndBookId(1, 100)).thenReturn(1);

        boolean result = favoriteService.removeFavorite(1, 100);
        assertTrue(result);
        Mockito.verify(favoriteMapper, Mockito.times(1)).deleteByUserIdAndBookId(1, 100);
    }

    @Test
    void testRemoveFavorite_Failure() {
        when(favoriteMapper.deleteByUserIdAndBookId(1, 100)).thenThrow(new RuntimeException("数据库错误"));

        boolean result = favoriteService.removeFavorite(1, 100);
        assertFalse(result);
        Mockito.verify(favoriteMapper, Mockito.times(1)).deleteByUserIdAndBookId(1, 100);
    }
}