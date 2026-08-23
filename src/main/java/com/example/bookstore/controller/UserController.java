package com.example.bookstore.controller;

import com.example.bookstore.entity.User;
import com.example.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Value("${upload.path:D:/uploads/}")
    private String uploadPath;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        return userService.login(user);
    }

    @GetMapping("/count")
    public Map<String, Object> count() {
        Map<String, Object> result = new HashMap<>();
        result.put("count", userService.countUsers());
        return result;
    }

    @GetMapping("/seller/{sellerId}")
    public Map<String, Object> sellerDetail(@PathVariable Integer sellerId) {
        return userService.getSellerDetail(sellerId);
    }

    @GetMapping("/{id}")
    public User findById(@PathVariable Integer id) {
        return userService.findById(id);
    }

    @PutMapping
    public int update(@RequestBody User user) {
        return userService.update(user);
    }

    @PostMapping("/uploadAvatar")
    public Map<String, Object> uploadAvatar(@RequestParam("file") MultipartFile file) {//上传头像
        Map<String, Object> result = new HashMap<>();
        if (file.isEmpty()) {
            result.put("success", false);
            result.put("msg", "请选择文件");
            return result;
        }
        try {
            File dir = new File(uploadPath);
            if (!dir.exists()) dir.mkdirs();

            String originalName = file.getOriginalFilename();
            String ext = originalName != null && originalName.contains(".") ?
                         originalName.substring(originalName.lastIndexOf(".")) : ".jpg";

            String newName = "avatar_" + UUID.randomUUID().toString() + ext;
            File dest = new File(uploadPath + newName);
            file.transferTo(dest);

            result.put("success", true);
            result.put("url", "/uploads/" + newName);
        } catch (IOException e) {
            result.put("success", false);
            result.put("msg", "上传失败：" + e.getMessage());
        }
        return result;
    }

    @PutMapping("/updateProfile")
    public Map<String, Object> updateProfile(@RequestBody User user) {
        return userService.updateProfile(user);
    }
}