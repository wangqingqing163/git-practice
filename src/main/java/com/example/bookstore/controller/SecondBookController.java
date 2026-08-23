package com.example.bookstore.controller;

import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.service.SecondBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/secondbook")
public class SecondBookController {

    @Autowired
    private SecondBookService secondBookService;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping("/list")
    public List<SecondBook> findAll() {
        return secondBookService.findAll();
    }

    @GetMapping("/onSale")
    public List<SecondBook> findOnSale() {
        return secondBookService.findByStatus(1);
    }

    @GetMapping("/page")
    public Map<String, Object> findPage(@RequestParam(defaultValue = "1") int page,
                                         @RequestParam(defaultValue = "12") int size,
                                         @RequestParam(required = false) Integer categoryId) {
        Map<String, Object> result = new HashMap<>();
        int offset = (page - 1) * size;
        List<SecondBook> list = secondBookService.findByStatusPage(1, offset, size, categoryId);
        int total = secondBookService.countByStatus(1, categoryId);
        result.put("list", list);
        result.put("total", total);
        result.put("page", page);
        result.put("size", size);
        result.put("totalPages", (int) Math.ceil((double) total / size));
        return result;
    }

    @GetMapping("/search")
    public Map<String, Object> search(@RequestParam(required = false) String name) {
        Map<String, Object> result = new HashMap<>();
        if (name == null || name.trim().isEmpty()) {
            result.put("list", secondBookService.findByStatus(1));
            return result;
        }
        result.put("list", secondBookService.findByNameOrAuthor(name.trim()));
        return result;
    }

    @GetMapping("/hot")
    public List<SecondBook> findHotBooks(@RequestParam(defaultValue = "5") int limit) {
        return secondBookService.findHotBooks(limit);
    }

    @GetMapping("/seller-ranking")
    public List<Map<String, Object>> findSellerRanking(@RequestParam(defaultValue = "10") int limit) {
        try {
            System.out.println("=== 查询卖家排行榜，limit=" + limit + " ===");
            List<Map<String, Object>> result = secondBookService.findSellerRanking(limit);
            System.out.println("=== 卖家排行榜查询成功，返回" + (result != null ? result.size() : 0) + "条记录 ===");
            return result;
        } catch (Exception e) {
            System.err.println("=== 查询卖家排行榜异常 ===");
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/my/{sellerId}")
    public List<SecondBook> findBySellerId(@PathVariable("sellerId") Integer sellerId) {
        try {
            return secondBookService.findBySellerId(sellerId);
        } catch (Exception e) {
            System.err.println("=== findBySellerId 异常，sellerId=" + sellerId + " ===");
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{id}")
    public SecondBook findById(@PathVariable Integer id) {
        return secondBookService.findById(id);
    }

    @PostMapping("/upload")
    public Map<String, Object> uploadImage(@RequestParam("file") MultipartFile file) {
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
            String ext = originalName != null && originalName.contains(".") ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
            String newName = UUID.randomUUID().toString() + ext;
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

    @PostMapping
    public Map<String, Object> publish(@RequestBody SecondBook book) {
        System.out.println("发布接口进来了！"); // 新增这行
        Map<String, Object> result = new HashMap<>();
        try {
            if (book.getName() == null || book.getName().trim().isEmpty()) {
                result.put("success", false);
                result.put("msg", "书名不能为空");
                return result;
            }
            if (book.getPrice() == null || book.getPrice() <= 0) {
                result.put("success", false);
                result.put("msg", "请输入有效价格");
                return result;
            }
            if (book.getSellerId() == null) {
                result.put("success", false);
                result.put("msg", "请先登录");
                return result;
            }
            book.setStatus("1");
            if (book.getLevel() == null || book.getLevel().trim().isEmpty()) {
                book.setLevel("九成新");
            }
            if (book.getImage() == null) {
                book.setImage("");
            }
            if (book.getAuthor() == null) {
                book.setAuthor("");
            }
            int rows = secondBookService.insert(book);
            if (rows > 0) {
                result.put("success", true);
                result.put("msg", "发布成功");
            } else {
                result.put("success", false);
                result.put("msg", "发布失败");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "发布失败: " + e.getMessage());
        }
        return result;
    }

    @DeleteMapping("/del/{id}")
    public Map<String, Object> deleteById(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            int rows = secondBookService.deleteById(id);
            if (rows > 0) {
                result.put("success", true);
                result.put("msg", "下架成功");
            } else {
                result.put("success", false);
                result.put("msg", "下架失败，图书不存在");
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("msg", "下架失败: " + e.getMessage());
        }
        return result;
    }

    @PutMapping
    public Map<String, Object> update(@RequestBody SecondBook book) {
        Map<String, Object> result = new HashMap<>();
        int rows = secondBookService.update(book);
        result.put("success", rows > 0);
        return result;
    }
}