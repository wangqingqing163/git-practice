package com.example.bookstore.config;

import com.example.bookstore.entity.Category;
import com.example.bookstore.entity.SecondBook;
import com.example.bookstore.entity.User;
import com.example.bookstore.mapper.CategoryMapper;
import com.example.bookstore.mapper.SecondBookMapper;
import com.example.bookstore.mapper.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private CategoryMapper categoryMapper;

    @Autowired
    private SecondBookMapper secondBookMapper;

    @Autowired
    private UserMapper userMapper;

    private static final String[] CATEGORY_NAMES = {
            "计算机", "文学", "教育", "外语", "历史",
            "哲学", "经济管理", "法律", "艺术", "自然科学", "生活百科"
    };

    private static final String[][] TEST_USERS = {
            {"zhangsan", "张三", "13800138001"},
            {"lisi", "李四", "13800138002"},
            {"wangwu", "王五", "13800138003"},
            {"zhaoliu", "赵六", "13800138004"},
            {"user1", "用户一", "13800138005"}
    };

    private static final Object[][] TEST_BOOKS = {
            {"Java编程思想", "Bruce Eckel", 45.00, 9, "Java经典教材，深入理解面向对象编程", 1},
            {"Python入门到精通", "Mark Lutz", 35.00, 8, "Python基础教程，适合初学者", 1},
            {"算法导论", "Thomas H.Cormen", 88.00, 9, "计算机算法经典教材", 1},
            {"红楼梦", "曹雪芹", 29.80, 10, "中国古典文学四大名著之一", 2},
            {"三国演义", "罗贯中", 25.00, 9, "中国历史演义小说巅峰之作", 2},
            {"百年孤独", "加西亚·马尔克斯", 42.00, 8, "魔幻现实主义文学代表作", 2},
            {"高等数学", "同济大学", 39.00, 7, "大学数学经典教材", 3},
            {"新概念英语3", "亚历山大", 28.00, 8, "英语学习经典教程", 4},
            {"史记选", "司马迁", 32.00, 9, "中国历史典籍精选", 5},
            {"西方哲学史", "罗素", 55.00, 8, "西方哲学入门必读", 6},
            {"经济学原理", "曼昆", 68.00, 9, "经济学入门经典教材", 7},
            {"民法总则", "王利明", 45.00, 7, "民法基础理论教材", 8},
            {"艺术概论", "彭吉象", 38.00, 7, "艺术学理论基础", 9},
            {"时间简史", "霍金", 48.00, 9, "宇宙学科普经典", 10},
            {"家常菜谱", "文怡", 29.90, 6, "家庭烹饪实用指南", 11}
    };

    @Override
    public void run(String... args) {
        initAdmin();
        initTestUsers();
        initCategories();
        initTestBooks();
    }

    private void initAdmin() {
        try {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String correctPasswordHash = passwordEncoder.encode("admin123");
            User existingAdmin = userMapper.findByUsername("admin");

            if (existingAdmin != null) {
                boolean needsUpdate = false;

                if (existingAdmin.getRole() == null || existingAdmin.getRole() != 1) {
                    existingAdmin.setRole(1);
                    needsUpdate = true;
                    log.info("修复管理员权限: role -> 1");
                }

                if (existingAdmin.getPassword() == null || !passwordEncoder.matches("admin123", existingAdmin.getPassword())) {
                    existingAdmin.setPassword(correctPasswordHash);
                    needsUpdate = true;
                    log.info("修复管理员密码: admin123 (原密码无效或格式错误)");
                }

                if (needsUpdate) {
                    userMapper.update(existingAdmin);
                    log.info("✅ 管理员账号已更新: admin / admin123");
                } else {
                    log.info("✅ 管理员账号正常: admin (role=1, 密码有效)");
                }
                return;
            }

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(correctPasswordHash);
            admin.setName("系统管理员");
            admin.setRole(1);
            userMapper.insert(admin);
            log.info("✅ 管理员账号创建成功: admin / admin123");
        } catch (Exception e) {
            log.warn("⚠️ 管理员初始化失败（可能数据库未就绪）: {}", e.getMessage());
        }
    }

    private void initTestUsers() {
        try {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String correctPasswordHash = passwordEncoder.encode("123456");
            int createdCount = 0;
            int updatedCount = 0;

            for (String[] userInfo : TEST_USERS) {
                User existingUser = userMapper.findByUsername(userInfo[0]);

                if (existingUser == null) {
                    User user = new User();
                    user.setUsername(userInfo[0]);
                    user.setPassword(correctPasswordHash);
                    user.setName(userInfo[1]);
                    user.setPhone(userInfo[2]);
                    user.setRole(0);
                    user.setAddress("北京市海淀区");
                    user.setTags(userInfo[1].contains("张") || userInfo[1].contains("李") ? "计算机,编程" : "阅读,学习");
                    userMapper.insert(user);
                    createdCount++;
                    log.info("✅ 创建测试用户: {} / 123456", userInfo[0]);
                } else {
                    boolean needsUpdate = false;

                    if (existingUser.getPassword() == null || !passwordEncoder.matches("123456", existingUser.getPassword())) {
                        existingUser.setPassword(correctPasswordHash);
                        needsUpdate = true;
                        log.info("修复用户 {} 密码: 123456 (原密码无效)", userInfo[0]);
                    }

                    if (needsUpdate) {
                        userMapper.update(existingUser);
                        updatedCount++;
                    }
                }
            }

            if (createdCount > 0 || updatedCount > 0) {
                log.info("✅ 测试用户初始化完成: 新增 {}, 更新 {}", createdCount, updatedCount);
            } else {
                log.info("✅ 所有测试用户状态正常（共 {} 个）", TEST_USERS.length);
            }
        } catch (Exception e) {
            log.warn("⚠️ 测试用户初始化失败: {}", e.getMessage());
        }
    }

    private void initCategories() {
        try {
            List<Category> existing = categoryMapper.findAll();
            if (existing != null && existing.size() == CATEGORY_NAMES.length) {
                log.info("分类已存在，共 {} 个，跳过初始化", existing.size());
                return;
            }
            log.info("分类数量不正确（当前 {} 个，期望 {} 个），重新初始化",
                    existing != null ? existing.size() : 0, CATEGORY_NAMES.length);
            secondBookMapper.clearAllCategoryIds();
            categoryMapper.deleteAll();

            for (String name : CATEGORY_NAMES) {
                Category category = new Category();
                category.setName(name);
                categoryMapper.insert(category);
            }
            log.info("分类初始化完成，共 {} 个分类", CATEGORY_NAMES.length);
        } catch (Exception e) {
            log.warn("分类初始化失败（可能数据库未就绪），跳过: {}", e.getMessage());
        }
    }

    private void initTestBooks() {
        try {
            Map<String, Integer> usernameToId = new HashMap<>();
            List<User> allUsers = userMapper.findAll();
            if (allUsers != null) {
                for (User u : allUsers) {
                    usernameToId.put(u.getUsername(), u.getId());
                }
            }

            List<SecondBook> existingBooks = secondBookMapper.findAll();
            if (existingBooks != null && !existingBooks.isEmpty()) {
                log.info("图书数据已存在，共 {} 本，跳过初始化", existingBooks.size());
                return;
            }

            List<Category> categories = categoryMapper.findAll();
            Map<String, Integer> categoryNameToId = new HashMap<>();
            if (categories != null) {
                for (Category c : categories) {
                    categoryNameToId.put(c.getName(), c.getId());
                }
            }

            int createdCount = 0;
            for (int i = 0; i < TEST_BOOKS.length; i++) {
                Object[] bookInfo = TEST_BOOKS[i];
                SecondBook book = new SecondBook();
                book.setName((String) bookInfo[0]);
                book.setAuthor((String) bookInfo[1]);
                book.setPrice((Double) bookInfo[2]);
                book.setLevel(String.valueOf(bookInfo[3]));
                book.setBookDesc((String) bookInfo[4]);

                Integer sellerId = usernameToId.get(TEST_USERS[i % TEST_USERS.length][0]);
                book.setSellerId(sellerId);

                book.setStatus("1");

                Integer categoryId = categoryNameToId.get(CATEGORY_NAMES[(Integer) bookInfo[5] - 1]);
                book.setCategoryId(categoryId);

                secondBookMapper.insert(book);
                createdCount++;
            }
            log.info("测试图书初始化完成，新增 {} 本图书", createdCount);
        } catch (Exception e) {
            log.warn("测试图书初始化失败: {}", e.getMessage());
        }
    }
}