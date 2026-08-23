package com.example.bookstore.service.impl;

import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.mapper.CartMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SecondBookServicelmplTest {
    @InjectMocks
    private SecondBookServiceImpl secondBookService;
    @Mock
    private SecondBookMapper secondBookMapper;
    @Mock
    private CartMapper cartMapper;
    @Mock
    private com.example.bookstore.mapper.FavoriteMapper favoriteMapper;

    @Test
    void testSecondBookFindAll_Success() {
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setStatus("available");
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondbooks = new ArrayList<>();
        secondbooks.add(secondbook1);
        secondbooks.add(secondbook2);
        when(secondBookMapper.findAll()).thenReturn(secondbooks);
        List<SecondBook> result = secondBookService.findAll();
        assertIterableEquals(secondbooks, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findAll();
    }
    @Test
    void testSecondBookFindAll_Failure() {
        when(secondBookMapper.findAll()).thenReturn(null);
        List<SecondBook> result = secondBookService.findAll();
        assertEquals(null, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findAll();
    }
    @Test
    void testSecondBookFindById_Success() {
        SecondBook secondbook = new SecondBook();
        secondbook.setId(1);
        secondbook.setBookDesc("This is a test book.");
        secondbook.setName("Test Book");
        secondbook.setSellerId(1);
        secondbook.setPrice(19.99);
        secondbook.setStatus("available");
        secondbook.setCategoryId(1);
        secondbook.setCategoryName("Test Category");
        secondbook.setSellerName("Test Seller");
        when(secondBookMapper.findById(1)).thenReturn(secondbook);
        SecondBook result = secondBookService.findById(1);
        assertEquals(secondbook, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(1);
    }
    @Test
    void testSecondBookFindById_Failure() {
        when(secondBookMapper.findById(1)).thenReturn(null);
        SecondBook result = secondBookService.findById(1);
        assertEquals(null, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findById(1);
    }
    @Test
    void testSecondBookInsert_Success() {
        SecondBook secondbook = new SecondBook();
        secondbook.setId(1);
        secondbook.setBookDesc("This is a test book.");
        secondbook.setName("Test Book");
        secondbook.setSellerId(1);
        secondbook.setPrice(19.99);
        secondbook.setStatus("available");
        secondbook.setCategoryId(1);
        secondbook.setCategoryName("Test Category");
        secondbook.setSellerName("Test Seller");
        when(secondBookMapper.insert(secondbook)).thenReturn(1);
        int result = secondBookService.insert(secondbook);
        assertEquals(1, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).insert(secondbook);
    }
    @Test
    void testSecondBookInsert_Failure() {
        when(secondBookMapper.insert(null)).thenReturn(0);
        int result = secondBookService.insert(null);
        assertEquals(0, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).insert(null);
    }
    @Test
    void testSecondBookUpdate_Success() {
        SecondBook secondbook = new SecondBook();
        secondbook.setId(1);
        secondbook.setBookDesc("This is a test book.");
        secondbook.setName("Test Book");
        secondbook.setSellerId(1);
        secondbook.setPrice(19.99);
        secondbook.setStatus("available");
        secondbook.setCategoryId(1);
        secondbook.setCategoryName("Test Category");
        secondbook.setSellerName("Test Seller");
        when(secondBookMapper.update(secondbook)).thenReturn(1);
        int result = secondBookService.update(secondbook);
        assertEquals(1, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).update(secondbook);
    }
    @Test
    void testSecondBookUpdate_Failure() {
        when(secondBookMapper.update(null)).thenReturn(0);
        int result = secondBookService.update(null);
        assertEquals(0, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).update(null);
    }
    @Test
    void testSecondBookDeleteById_Success() {
        SecondBook secondbook = new SecondBook();
        secondbook.setId(1);
        secondbook.setBookDesc("This is a test book.");
        secondbook.setName("Test Book");
        secondbook.setSellerId(1);
        secondbook.setPrice(19.99);
        secondbook.setStatus("available");
        secondbook.setCategoryId(1);
        secondbook.setCategoryName("Test Category");
        secondbook.setSellerName("Test Seller");
        when(secondBookMapper.deleteById(1)).thenReturn(1);
        int result = secondBookService.deleteById(1);
        assertEquals(1, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).deleteById(1);
    }
    @Test
    void testSecondBookDeleteById_Failure() {
        when(secondBookMapper.deleteById(1)).thenReturn(0);
        int result = secondBookService.deleteById(1);
        assertEquals(0, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).deleteById(1);
    }
    @Test
    void testSecondBookFindByStatus_Success() {
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setStatus("available"); // Changed from secondbook1.setStatus(1);
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondbooks = new ArrayList<>();
        secondbooks.add(secondbook1);
        secondbooks.add(secondbook2);
        when(secondBookMapper.findByStatus(1)).thenReturn(secondbooks);
        List<SecondBook> result = secondBookService.findByStatus(1);
        assertIterableEquals(secondbooks, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findByStatus(1);
    }
    @Test
    void testSecondBookFindByStatus_Failure() {
        when(secondBookMapper.findByStatus(1)).thenReturn(new ArrayList<>());
        List<SecondBook> result = secondBookService.findByStatus(1);
        assertTrue(result.isEmpty());
        Mockito.verify(secondBookMapper, Mockito.times(1)).findByStatus(1);
    }
    @Test
    void testSecondBookFindByStatusPage_Success(){
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setStatus("available"); // Changed from secondbook1.setStatus(1);
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondBooks=new ArrayList<>();
        secondBooks.add(secondbook1);
        secondBooks.add(secondbook2);
        when(secondBookMapper.findByStatusPage(1, 0, 10, null)).thenReturn(secondBooks);
        List<SecondBook> result = secondBookService.findByStatusPage(1, 0, 10, null);
        assertIterableEquals(secondBooks, result);
        Mockito.verify(secondBookMapper, Mockito.times(1))
                .findByStatusPage(1, 0, 10, null);
    }
    @Test
    void testSecondBookFindByStatusPage_Failure() {
        when(secondBookMapper.findByStatusPage(1, 0, 10, null)).thenReturn(null);
        List<SecondBook> result = secondBookService.findByStatusPage(1, 0, 10, null);
        assertEquals(null, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findByStatusPage(1, 0, 10, null);
    }
    @Test
    void testSecondBookFindBySellerId_Success() {
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setStatus("available"); // Changed from secondbook1.setStatus(1);
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondBooks=new ArrayList<>();
        secondBooks.add(secondbook1);
        secondBooks.add(secondbook2);
        when(secondBookMapper.findBySellerId(1)).thenReturn(secondBooks);
        List<SecondBook> result = secondBookService.findBySellerId(1);
        assertIterableEquals(secondBooks, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findBySellerId(1);

    }
    @Test
    void testSecondBookFindBySellerId_Failure() {
        when(secondBookMapper.findBySellerId(1)).thenReturn(null);
        List<SecondBook> result = secondBookService.findBySellerId(1);
        assertEquals(null, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findBySellerId(1);
    }
    @Test
    void testSecondBookcountByStatus_Success(){
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setStatus("available"); // Changed from secondbook1.setStatus(1);
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondBooks=new ArrayList<>();
        secondBooks.add(secondbook1);
        secondBooks.add(secondbook2);
        when(secondBookMapper.countByStatus(1, 1)).thenReturn(secondBooks.size());
        int result = secondBookService.countByStatus(1, 1);
        assertEquals(secondBooks.size(), result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).countByStatus(1, 1);
    }
    @Test
    void testSecondBookcountByStatus_Failure(){
        when(secondBookMapper.countByStatus(1, 1)).thenReturn(0);
        int result = secondBookService.countByStatus(1, 1);
        assertEquals(0, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).countByStatus(1, 1);
    }
    @Test
    void testSecondBookFindByname_Success(){
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setStatus("available"); // Changed from secondbook1.setStatus(1);
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondBooks=new ArrayList<>();
        secondBooks.add(secondbook1);
        secondBooks.add(secondbook2);
        when(secondBookMapper.findByName("Test Book")).thenReturn(secondBooks);
        List<SecondBook> result = secondBookService.findByName("Test Book");
        assertIterableEquals(secondBooks, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findByName("Test Book");
    }
    @Test
    void testSecondBookFindByname_Failure(){
        when(secondBookMapper.findByName("Test Book")).thenReturn(null);
        List<SecondBook> result = secondBookService.findByName("Test Book");
        assertEquals(null, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findByName("Test Book");
    }
    @Test
    void testSecondBookcountAll_Success() {
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setStatus("available"); // Changed from secondbook1.setStatus(1);
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondBooks=new ArrayList<>();
        secondBooks.add(secondbook1);
        secondBooks.add(secondbook2);
        when(secondBookMapper.countAll()).thenReturn(secondBooks.size());
        int result = secondBookService.countAll();
        assertEquals(secondBooks.size(), result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).countAll();
    }

    @Test
    void testSecondBookcountAll_Failure(){
        when(secondBookMapper.countAll()).thenReturn(0);
        int result = secondBookService.countAll();
        assertEquals(0, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).countAll();
    }
    @Test
    void testSecondBookfindByNameOrAuthor_Success() {
        SecondBook secondbook1 = new SecondBook();
        secondbook1.setId(1);
        secondbook1.setBookDesc("This is a test book.");
        secondbook1.setName("Test Book");
        secondbook1.setSellerId(1);
        secondbook1.setPrice(19.99);
        secondbook1.setAuthor("Test Author");
        secondbook1.setStatus("available"); // Changed from secondbook1.setStatus(1);
        secondbook1.setCategoryId(1);
        secondbook1.setCategoryName("Test Category");
        secondbook1.setSellerName("Test Seller");
        SecondBook secondbook2 = new SecondBook();
        secondbook2.setId(2);
        secondbook2.setBookDesc("This is a test book.");
        secondbook2.setName("Test Book");
        secondbook2.setAuthor("Test Author");
        secondbook2.setSellerId(2);
        secondbook2.setPrice(99.27);
        secondbook2.setStatus("available");
        secondbook2.setCategoryId(1);
        secondbook2.setCategoryName("Test Category");
        secondbook2.setCategoryName("Test Category 2");
        secondbook2.setSellerName("Test Seller 2");
        List<SecondBook> secondBooks=new ArrayList<>();
        secondBooks.add(secondbook1);
        secondBooks.add(secondbook2);
        when(secondBookMapper.findByNameOrAuthor("Test Book")).thenReturn(secondBooks);
        List<SecondBook> result = secondBookService.findByNameOrAuthor("Test Book");
        assertEquals(secondBooks, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findByNameOrAuthor("Test Book");
    }
    @Test
    void testSecondBookfindByNameOrAuthor_Failure() {
        when(secondBookMapper.findByNameOrAuthor("Test Book")).thenReturn(null);
        List<SecondBook> result = secondBookService.findByNameOrAuthor("Test Book");
        assertEquals(null, result);
        Mockito.verify(secondBookMapper, Mockito.times(1)).findByNameOrAuthor("Test Book");
    }


}