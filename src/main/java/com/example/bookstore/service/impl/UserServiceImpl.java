package com.example.bookstore.service.impl;

import com.example.bookstore.entity.Comment;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.entity.User;
import com.example.bookstore.mapper.CommentMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import com.example.bookstore.mapper.UserMapper;
import com.example.bookstore.service.UserService;
import com.example.bookstore.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private SecondBookMapper secondBookMapper;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Override
    public User findById(Integer id) {
        return userMapper.findById(id);
    }

    @Override
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }

    @Override
    @Transactional
    public int insert(User user) {
        return userMapper.insert(user);
    }

    @Override
    @Transactional
    public int update(User user) {
        return userMapper.update(user);
    }

    @Override
    public int countUsers() {
        return userMapper.countUsers();
    }

    @Override
    public java.util.List<User> findAll() {
        return userMapper.findAll();
    }

    @Override
    @Transactional
    public int deleteById(Integer id) {
        return userMapper.deleteById(id);
    }

    @Override
    @Transactional
    public Map<String, Object> register(User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
                result.put("success", false);
                result.put("msg", "用户名不能为空");
                return result;
            }
            String username = user.getUsername().trim();
            if (username.length() < 4 || username.length() > 20) {
                result.put("success", false);
                result.put("msg", "用户名长度必须在4-20个字符之间");
                return result;
            }
            if (!username.matches("^[a-zA-Z][a-zA-Z0-9_]*$")) {
                result.put("success", false);
                result.put("msg", "用户名只能包含字母、数字、下划线，且必须以字母开头");
                return result;
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                result.put("success", false);
                result.put("msg", "密码不能为空");
                return result;
            }
            String password = user.getPassword();
            if (password.length() < 8 || password.length() > 20) {
                result.put("success", false);
                result.put("msg", "密码长度必须在8-20个字符之间");
                return result;
            }
            if (!password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,20}$")) {
                result.put("success", false);
                result.put("msg", "密码必须包含大小写字母和数字");
                return result;
            }
            if (userMapper.findByUsername(username) != null) {
                result.put("success", false);
                result.put("msg", "用户名已存在");
                return result;
            }
            if (user.getPhone() == null) {
                user.setPhone("");
            }
            user.setPassword(encoder.encode(user.getPassword()));
            userMapper.insert(user);
            result.put("success", true);
            result.put("msg", "注册成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "注册失败: " + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> login(User user) {
        Map<String, Object> result = new HashMap<>();
        User dbUser = userMapper.findByUsername(user.getUsername());

        if (dbUser == null || !encoder.matches(user.getPassword(), dbUser.getPassword())) {
            result.put("success", false);
            result.put("msg", "用户名或密码错误");
            return result;
        }

        String token = jwtUtil.generateToken(dbUser.getId(), dbUser.getUsername(), dbUser.getRole());

        User safeUser = new User();
        safeUser.setId(dbUser.getId());
        safeUser.setUsername(dbUser.getUsername());
        safeUser.setPhone(dbUser.getPhone());
        safeUser.setAvatar(dbUser.getAvatar());
        safeUser.setRole(dbUser.getRole());
        safeUser.setAddress(dbUser.getAddress());

        result.put("success", true);
        result.put("token", token);
        result.put("user", safeUser);
        result.put("expiresIn", 86400000);

        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> updateProfile(User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            System.out.println("=== [DEBUG] 接收到的更新数据 ===");
            System.out.println("ID: " + user.getId());
            System.out.println("Avatar: " + user.getAvatar());
            System.out.println("Background: " + user.getBackground());
            System.out.println("Tags: " + user.getTags());
            
            User existingUser = userMapper.findById(user.getId());
            if (existingUser == null) {
                result.put("success", false);
                result.put("msg", "用户不存在");
                return result;
            }

            System.out.println("=== [DEBUG] 数据库原有数据 ===");
            System.out.println("原 Background: " + existingUser.getBackground());

            if (user.getAvatar() != null) existingUser.setAvatar(user.getAvatar());

            // 修改：只有当 background 不为空字符串时才更新
            if (user.getBackground() != null && !user.getBackground().trim().isEmpty()) {
                String cleanBackground = cleanBackgroundUrl(user.getBackground());
                existingUser.setBackground(cleanBackground);
                System.out.println("=== [DEBUG] 更新 Background 为: " + cleanBackground);
                if (!cleanBackground.equals(user.getBackground())) {
                    System.out.println("=== [DEBUG] ⚠️ 已自动去除 URL 中的反引号字符 ===");
                }
            }

            // 更新文字颜色相关字段
            if (user.getTextColor() != null) {
                existingUser.setTextColor(user.getTextColor());
                System.out.println("=== [DEBUG] 更新 Text Color 为: " + user.getTextColor());
            }

            if (user.getTextColorMode() != null) {
                existingUser.setTextColorMode(user.getTextColorMode());
                System.out.println("=== [DEBUG] 更新 Text Color Mode 为: " + user.getTextColorMode());
            }

            if (user.getTags() != null) existingUser.setTags(user.getTags());
            if (user.getAddress() != null) existingUser.setAddress(user.getAddress());
            if (user.getIp() != null) existingUser.setIp(user.getIp());

            int rows = userMapper.update(existingUser);
            System.out.println("=== [DEBUG] 更新行数: " + rows);
            
            result.put("success", rows > 0);
            if (rows > 0) {
                result.put("msg", "更新成功");
            } else {
                result.put("msg", "更新失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.put("success", false);
            result.put("msg", "更新失败: " + e.getMessage());
        }
        return result;
    }

    @Override
    public Map<String, Object> getSellerDetail(Integer sellerId) {
        Map<String, Object> result = new HashMap<>();
        User seller = userMapper.findById(sellerId);
        if (seller == null) {
            result.put("success", false);
            return result;
        }
        result.put("success", true);

        Map<String, Object> info = new HashMap<>();
        info.put("id", seller.getId());
        info.put("username", seller.getUsername());
        info.put("phone", seller.getPhone() != null ? seller.getPhone() : "");
        info.put("address", seller.getAddress() != null ? seller.getAddress() : "");
        info.put("avatar", seller.getAvatar() != null ? seller.getAvatar() : "");
        info.put("background", seller.getBackground() != null ? seller.getBackground() : "");
        info.put("textColor", seller.getTextColor() != null ? seller.getTextColor() : "");
        info.put("textColorMode", seller.getTextColorMode() != null ? seller.getTextColorMode() : "auto");
        info.put("ip", seller.getIp() != null ? seller.getIp() : "未知");
        info.put("createTime", seller.getCreateTime());
        info.put("tags", seller.getTags() != null ? seller.getTags() : "");
        info.put("isVip", seller.getRole() != null && seller.getRole() == 1);
        result.put("seller", info);

        List<SecondBook> allBooks = secondBookMapper.findBySellerId(sellerId);

        List<SecondBook> soldBooks = allBooks.stream()
                .filter(b -> !"1".equals(b.getStatus()))
                .collect(Collectors.toList());
        result.put("soldBooks", soldBooks);
        result.put("soldCount", soldBooks.size());

        long onSaleCount = allBooks.stream()
                .filter(b -> "1".equals(b.getStatus()))
                .count();
        result.put("onSaleCount", onSaleCount);

        double avgRating = 5.0;
        int totalScore = 0;
        int commentCount = 0;
        List<Comment> allComments = new java.util.ArrayList<>();
        for (SecondBook book : soldBooks) {
            try {
                List<Comment> bookComments = commentMapper.findByBookId(book.getId());
                if (bookComments != null) {
                    allComments.addAll(bookComments);
                    for (Comment c : bookComments) {
                        if (c.getScore() != null) {
                            totalScore += c.getScore();
                            commentCount++;
                        }
                    }
                }
            } catch (Exception e) { /* 忽略单个查询异常 */ }
        }
        if (commentCount > 0) {
            avgRating = Math.round((double) totalScore / commentCount * 10) / 10.0;
        }
        result.put("rating", avgRating);
        result.put("comments", allComments);

        return result;
    }

    private String cleanBackgroundUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return url;
        }
        String cleaned = url.trim();
        if (cleaned.startsWith("`")) {
            cleaned = cleaned.substring(1);
        }
        if (cleaned.endsWith("`")) {
            cleaned = cleaned.substring(0, cleaned.length() - 1);
        }
        return cleaned;
    }
}