package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Comment;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.entity.User;
import com.example.bookstore.mapper.CommentMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import com.example.bookstore.mapper.UserMapper;
import com.example.bookstore.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {
    @Mock
    private UserMapper userMapper;
    @Mock
    private SecondBookMapper secondBookMapper;
    @Mock
    private CommentMapper commentMapper;
    @Mock
    private JwtUtil jwtUtil;
    @InjectMocks
    private UserServiceImpl userService;
    @Test
    void testFindById_WithData(){
        User mockUser=new User();
        mockUser.setId(1);
        mockUser.setUsername("张三");
        mockUser.setPhone("13673619462");
        Mockito.when(userMapper.findById(1)).thenReturn(mockUser);
        User result =userService.findById(1);
        assertNotNull(result);
        assertEquals(1,result.getId());
        assertEquals("张三", result.getUsername());
        assertEquals("13673619462", result.getPhone());
        Mockito.verify(userMapper, Mockito.times(1)).findById(1);
    }
    @Test
    void testFindById_WhenUserNotFound() {
        // 当 userMapper.findById(999) 被调用时，返回 null
        Mockito.when(userMapper.findById(999)).thenReturn(null);

        User result = userService.findById(999);

        assertNull(result);
        Mockito.verify(userMapper, Mockito.times(1)).findById(999);
    }
    @Test
    void testFindByUsername_WithData(){
        User mockUser=new User();
        mockUser.setId(1);
        mockUser.setUsername("张三");
        mockUser.setPhone("13673619462");
        Mockito.when(userMapper.findByUsername("张三")).thenReturn(mockUser);
        User result =userService.findByUsername("张三");
        assertNotNull(result);
        assertEquals(1,result.getId());
        assertEquals("张三", result.getUsername());
        assertEquals("13673619462", result.getPhone());
        Mockito.verify(userMapper, Mockito.times(1)).findByUsername("张三");
    }
    @Test
    void testFindByUsername_WhenUserNotFound() {
        // 当 userMapper.findByUsername("张三") 被调用时，返回 null
        Mockito.when(userMapper.findByUsername("张三")).thenReturn(null);

        User result = userService.findByUsername("张三");

        assertNull(result);
        Mockito.verify(userMapper, Mockito.times(1)).findByUsername("张三");
    }
    @Test
    void testInsert_Success(){
        User mockUser=new User();
        mockUser.setId(1);
        mockUser.setUsername("张三");
        mockUser.setPhone("13673619462");
        Mockito.when(userMapper.insert(mockUser)).thenReturn(1);
        int result =userService.insert(mockUser);
        assertEquals(1,result);
        Mockito.verify(userMapper, Mockito.times(1)).insert(mockUser);
    }
    @Test
    void testInsert_Failure() {
        User mockUser=new User();
        mockUser.setId(1);
        mockUser.setUsername("张三");
        mockUser.setPhone("13673619462");
        Mockito.when(userMapper.insert(mockUser)).thenReturn(0);
        int result =userService.insert(mockUser);
        assertEquals(0, result);
        Mockito.verify(userMapper, Mockito.times(1)).insert(mockUser);
    }
    @Test
    void testUpdate_Success(){
        User mockUser=new User();
        mockUser.setId(1);
        mockUser.setUsername("张三");
        mockUser.setPhone("13673619462");
        Mockito.when(userMapper.update(mockUser)).thenReturn(1);
        int result =userService.update(mockUser);
        assertEquals(1,result);
        Mockito.verify(userMapper, Mockito.times(1)).update(mockUser);
    }
    @Test
    void testcountUsers_Success(){
        User mockUser=new User();
        mockUser.setId(1);
        mockUser.setUsername("张三");
        mockUser.setPhone("13673619462");
        Mockito.when(userMapper.countUsers()).thenReturn(1);
        int result =userService.countUsers();
        assertEquals(1, result);
        Mockito.verify(userMapper, Mockito.times(1)).countUsers();
    }
    @Test
    void testcountUsers_Failure() {
        Mockito.when(userMapper.countUsers()).thenReturn(-1);
        int result =userService.countUsers();
        assertEquals(-1, result);
        Mockito.verify(userMapper, Mockito.times(1)).countUsers();
    }
    @Test
    void testfindAll_Success(){
        User mockUser=new User();
        mockUser.setId(1);
        mockUser.setUsername("张三");
        mockUser.setPhone("13673619462");
        Mockito.when(userMapper.findAll()).thenReturn(java.util.Arrays.asList(mockUser));
        java.util.List<User> result =userService.findAll();
        assertEquals(1, result.size());
        Mockito.verify(userMapper, Mockito.times(1)).findAll();
    }
    @Test
    void testfindAll_Failure() {
        Mockito.when(userMapper.findAll()).thenReturn(null);
        java.util.List<User> result =userService.findAll();
        assertEquals(null, result);
        Mockito.verify(userMapper, Mockito.times(1)).findAll();
    }
    @Test
    void testdeleteById_Success(){
        Mockito.when(userMapper.deleteById(1)).thenReturn(1);
        int result =userService.deleteById(1);
        assertEquals(1, result);
        Mockito.verify(userMapper, Mockito.times(1)).deleteById(1);
    }
    @Test
    void testdeleteById_Failure() {
        Mockito.when(userMapper.deleteById(999)).thenReturn(0);
        int result =userService.deleteById(999);
        assertEquals(0, result);
        Mockito.verify(userMapper, Mockito.times(1)).deleteById(999);
    }

    // ==================== 测试 register() 方法 ====================
    @Test
    void testRegister_EmptyUsername() {
        User user = new User();
        user.setUsername("");
        user.setPassword("123456");

        Map<String, Object> result = userService.register(user);

        assertFalse((Boolean) result.get("success"));
        assertEquals("用户名不能为空", result.get("msg"));
    }

    @Test
    void testRegister_NullUsername() {
        User user = new User();
        user.setPassword("123456");

        Map<String, Object> result = userService.register(user);

        assertFalse((Boolean) result.get("success"));
        assertEquals("用户名不能为空", result.get("msg"));
    }

    @Test
    void testRegister_EmptyPassword() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("");

        Map<String, Object> result = userService.register(user);

        assertFalse((Boolean) result.get("success"));
        assertEquals("密码不能为空", result.get("msg"));
    }

    @Test
    void testRegister_NullPassword() {
        User user = new User();
        user.setUsername("testuser");

        Map<String, Object> result = userService.register(user);

        assertFalse((Boolean) result.get("success"));
        assertEquals("密码不能为空", result.get("msg"));
    }

    @Test
    void testRegister_UsernameExists() {
        User user = new User();
        user.setUsername("existingUser");
        user.setPassword("123456");
        user.setPhone("13800138000");

        User existingUser = new User();
        existingUser.setId(1);
        existingUser.setUsername("existingUser");

        when(userMapper.findByUsername("existingUser")).thenReturn(existingUser);

        Map<String, Object> result = userService.register(user);

        assertFalse((Boolean) result.get("success"));
        assertEquals("用户名已存在", result.get("msg"));
        verify(userMapper, never()).insert(any());
    }

    @Test
    void testRegister_Success() {
        User user = new User();
        user.setUsername("newUser");
        user.setPassword("123456");
        user.setPhone("13800138000");

        when(userMapper.findByUsername("newUser")).thenReturn(null);
        when(userMapper.insert(any(User.class))).thenReturn(1);

        Map<String, Object> result = userService.register(user);

        assertTrue((Boolean) result.get("success"));
        assertEquals("注册成功", result.get("msg"));
        verify(userMapper, times(1)).insert(any(User.class));
    }

    @Test
    void testRegister_Success_WithoutPhone() {
        User user = new User();
        user.setUsername("newUser2");
        user.setPassword("password123");

        when(userMapper.findByUsername("newUser2")).thenReturn(null);
        when(userMapper.insert(any(User.class))).thenReturn(1);

        Map<String, Object> result = userService.register(user);

        assertTrue((Boolean) result.get("success"));
        assertEquals("注册成功", result.get("msg"));
    }

    @Test
    void testRegister_Exception() {
        User user = new User();
        user.setUsername("testUser");
        user.setPassword("123456");

        when(userMapper.findByUsername("testUser")).thenThrow(new RuntimeException("数据库连接失败"));

        Map<String, Object> result = userService.register(user);

        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("msg").toString().contains("注册失败"));
    }

    // ==================== 测试 login() 方法 ====================
    @Test
    void testLogin_UserNotFound() {
        User loginUser = new User();
        loginUser.setUsername("nonexistent");
        loginUser.setPassword("wrongpass");

        when(userMapper.findByUsername("nonexistent")).thenReturn(null);

        Map<String, Object> result = userService.login(loginUser);

        assertFalse((Boolean) result.get("success"));
        assertEquals("用户名或密码错误", result.get("msg"));
    }

    @Test
    void testLogin_WrongPassword() {
        User loginUser = new User();
        loginUser.setUsername("testuser");
        loginUser.setPassword("wrongpass");

        User dbUser = new User();
        dbUser.setId(1);
        dbUser.setUsername("testuser");
        dbUser.setPassword("$2a$10$encodedpassword");

        when(userMapper.findByUsername("testuser")).thenReturn(dbUser);

        Map<String, Object> result = userService.login(loginUser);

        assertFalse((Boolean) result.get("success"));
        assertEquals("用户名或密码错误", result.get("msg"));
    }

    @Test
    void testLogin_Success() {
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        String encodedPassword = encoder.encode("correctpass");

        User loginUser = new User();
        loginUser.setUsername("testuser");
        loginUser.setPassword("correctpass");

        User dbUser = new User();
        dbUser.setId(1);
        dbUser.setUsername("testuser");
        dbUser.setPassword(encodedPassword);

        when(userMapper.findByUsername("testuser")).thenReturn(dbUser);

        Map<String, Object> result = userService.login(loginUser);

        assertTrue((Boolean) result.get("success"));
        assertNotNull(result.get("user"));
    }

    // ==================== 测试 updateProfile() 方法 ====================
    @Test
    void testUpdateProfile_UserNotFound() {
        User user = new User();
        user.setId(999);

        when(userMapper.findById(999)).thenReturn(null);

        Map<String, Object> result = userService.updateProfile(user);

        assertFalse((Boolean) result.get("success"));
        assertEquals("用户不存在", result.get("msg"));
    }

    @Test
    void testUpdateProfile_Success() {
        User existingUser = new User();
        existingUser.setId(1);
        existingUser.setUsername("oldAvatar");

        User updateUser = new User();
        updateUser.setId(1);
        updateUser.setAvatar("newAvatar.jpg");
        updateUser.setAddress("新地址");

        when(userMapper.findById(1)).thenReturn(existingUser);
        when(userMapper.update(existingUser)).thenReturn(1);

        Map<String, Object> result = userService.updateProfile(updateUser);

        assertTrue((Boolean) result.get("success"));
        assertEquals("更新成功", result.get("msg"));
        assertEquals("newAvatar.jpg", existingUser.getAvatar());
        assertEquals("新地址", existingUser.getAddress());
    }

    @Test
    void testUpdateProfile_Failure() {
        User existingUser = new User();
        existingUser.setId(1);

        User updateUser = new User();
        updateUser.setId(1);
        updateUser.setAvatar("avatar.jpg");

        when(userMapper.findById(1)).thenReturn(existingUser);
        when(userMapper.update(existingUser)).thenReturn(0);

        Map<String, Object> result = userService.updateProfile(updateUser);

        assertFalse((Boolean) result.get("success"));
        assertEquals("更新失败", result.get("msg"));
    }

    @Test
    void testUpdateProfile_Exception() {
        User updateUser = new User();
        updateUser.setId(1);
        updateUser.setAvatar("avatar.jpg");

        when(userMapper.findById(1)).thenThrow(new RuntimeException("数据库错误"));

        Map<String, Object> result = userService.updateProfile(updateUser);

        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("msg").toString().contains("更新失败"));
    }

    @Test
    void testUpdateProfile_NullFields() {
        User existingUser = new User();
        existingUser.setId(1);
        existingUser.setAvatar("old.jpg");
        existingUser.setTags("旧标签");

        User updateUser = new User();
        updateUser.setId(1);
        updateUser.setAvatar(null);
        updateUser.setTags(null);

        when(userMapper.findById(1)).thenReturn(existingUser);
        when(userMapper.update(existingUser)).thenReturn(1);

        Map<String, Object> result = userService.updateProfile(updateUser);

        assertTrue((Boolean) result.get("success"));
        assertEquals("old.jpg", existingUser.getAvatar());
        assertEquals("旧标签", existingUser.getTags());
    }

    // ==================== 测试 getSellerDetail() 方法 ====================
    @Test
    void testGetSellerDetail_SellerNotFound() {
        when(userMapper.findById(999)).thenReturn(null);

        Map<String, Object> result = userService.getSellerDetail(999);

        assertFalse((Boolean) result.get("success"));
    }

    @Test
    void testGetSellerDetail_Success_WithBooksAndComments() {
        User seller = new User();
        seller.setId(1);
        seller.setUsername("seller1");
        seller.setPhone("13800138000");
        seller.setRole(1);

        SecondBook book1 = new SecondBook();
        book1.setId(100);
        book1.setStatus("2");  // 已售出

        SecondBook book2 = new SecondBook();
        book2.setId(101);
        book2.setStatus("1");  // 在售

        Comment comment1 = new Comment();
        comment1.setId(1);
        comment1.setScore(5);

        Comment comment2 = new Comment();
        comment2.setId(2);
        comment2.setScore(4);

        when(userMapper.findById(1)).thenReturn(seller);
        when(secondBookMapper.findBySellerId(1)).thenReturn(Arrays.asList(book1, book2));
        when(commentMapper.findByBookId(100)).thenReturn(Arrays.asList(comment1, comment2));

        Map<String, Object> result = userService.getSellerDetail(1);

        assertTrue((Boolean) result.get("success"));
        assertNotNull(result.get("seller"));
        assertEquals(1, ((Number) result.get("soldCount")).intValue());
        assertEquals(1, ((Number) result.get("onSaleCount")).intValue());

        @SuppressWarnings("unchecked")
        List<Comment> comments = (List<Comment>) result.get("comments");
        assertEquals(2, comments.size());

        Double rating = (Double) result.get("rating");
        assertNotNull(rating);
    }

    @Test
    void testGetSellerDetail_Success_NoBooks() {
        User seller = new User();
        seller.setId(1);
        seller.setUsername("seller2");
        seller.setPhone(null);
        seller.setRole(0);

        when(userMapper.findById(1)).thenReturn(seller);
        when(secondBookMapper.findBySellerId(1)).thenReturn(Arrays.asList());

        Map<String, Object> result = userService.getSellerDetail(1);

        assertTrue((Boolean) result.get("success"));
        assertEquals(0, ((Number) result.get("soldCount")).intValue());
        assertEquals(0, ((Number) result.get("onSaleCount")).intValue());
        assertEquals(5.0, result.get("rating"));

        @SuppressWarnings("unchecked")
        Map<String, Object> info = (Map<String, Object>) result.get("seller");
        assertEquals("", info.get("phone"));
        assertFalse((Boolean) info.get("isVip"));
    }
}