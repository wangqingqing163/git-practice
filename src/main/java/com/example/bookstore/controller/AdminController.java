package com.example.bookstore.controller;

import com.example.bookstore.entity.Comment;
import com.example.bookstore.entity.Orders;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.entity.User;
import com.example.bookstore.service.AdminService;
import com.example.bookstore.service.CommentService;
import com.example.bookstore.service.OrdersService;
import com.example.bookstore.service.SecondBookService;
import com.example.bookstore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private SecondBookService secondBookService;

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private CommentService commentService;

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        return adminService.getStats();
    }

    @GetMapping("/users")
    public List<User> listUsers() {
        return userService.findAll();
    }

    @GetMapping("/user/{id}")
    public Map<String, Object> getUser(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        User user = userService.findById(id);
        if (user != null) {
            result.put("success", true);
            result.put("data", user);
        } else {
            result.put("success", false);
            result.put("msg", "用户不存在");
        }
        return result;
    }

    @PostMapping("/user")
    public Map<String, Object> addUser(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            User exist = userService.findByUsername(user.getUsername());
            if (exist != null) {
                result.put("success", false);
                result.put("msg", "用户名已存在");
                return result;
            }
            int rows = userService.insert(user);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "添加成功" : "添加失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "添加失败: " + e.getMessage());
        }
        return result;
    }

    @PutMapping("/user/{id}")
    public Map<String, Object> updateUser(@PathVariable Integer id, @RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            user.setId(id);
            int rows = userService.update(user);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "修改成功" : "用户不存在");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "修改失败: " + e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/user/{id}")
    public Map<String, Object> deleteUser(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            int rows = userService.deleteById(id);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "删除成功" : "用户不存在");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "删除失败: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/books")
    public List<SecondBook> listBooks() {
        return secondBookService.findAll();
    }

    @GetMapping("/book/{id}")
    public Map<String, Object> getBook(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        SecondBook book = secondBookService.findById(id);
        if (book != null) {
            result.put("success", true);
            result.put("data", book);
        } else {
            result.put("success", false);
            result.put("msg", "商品不存在");
        }
        return result;
    }

    @PostMapping("/book")
    public Map<String, Object> addBook(@RequestBody SecondBook book) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (book.getStatus() == null) {
                book.setStatus("1");
            }
            int rows = secondBookService.insert(book);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "添加成功" : "添加失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "添加失败: " + e.getMessage());
        }
        return result;
    }

    @PutMapping("/book/{id}")
    public Map<String, Object> updateBook(@PathVariable Integer id, @RequestBody SecondBook book) {
        Map<String, Object> result = new HashMap<>();
        try {
            book.setId(id);
            int rows = secondBookService.update(book);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "修改成功" : "商品不存在");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "修改失败: " + e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/book/{id}")
    public Map<String, Object> deleteBook(@PathVariable Integer id) {
        return adminService.deleteBook(id);
    }

    @GetMapping("/orders")
    public List<Orders> listOrders() {
        return ordersService.findAll();
    }

    @GetMapping("/order/{id}")
    public Map<String, Object> getOrder(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        Orders order = ordersService.findById(id);
        if (order != null) {
            result.put("success", true);
            result.put("data", order);
        } else {
            result.put("success", false);
            result.put("msg", "订单不存在");
        }
        return result;
    }

    @PutMapping("/order/{id}/status")
    public Map<String, Object> updateOrderStatus(@PathVariable Integer id, @RequestParam String status) {
        return adminService.updateOrderStatus(id, status);
    }

    @DeleteMapping("/order/{id}")
    public Map<String, Object> deleteOrder(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            int rows = ordersService.deleteById(id);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "删除成功" : "订单不存在");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "删除失败: " + e.getMessage());
        }
        return result;
    }

    @GetMapping("/comments")
    public List<Comment> listComments() {
        return commentService.findAll();
    }

    @DeleteMapping("/comment/{id}")
    public Map<String, Object> deleteComment(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            int rows = commentService.deleteById(id);
            result.put("success", rows > 0);
            result.put("msg", rows > 0 ? "删除成功" : "评论不存在");
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "删除失败: " + e.getMessage());
        }
        return result;
    }
}