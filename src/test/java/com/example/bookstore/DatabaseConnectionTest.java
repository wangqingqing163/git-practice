package com.example.bookstore;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@Disabled("需要真实数据库连接环境，单元测试中禁用。如需测试请确保数据库服务已启动并移除此注解")
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Test
    public void testDatabaseConnection() throws Exception {
        System.out.println("=== 测试数据库连接 ===");
        
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("✅ 数据库连接成功！");
            System.out.println("数据库URL: " + connection.getMetaData().getURL());
            
            DatabaseMetaData metaData = connection.getMetaData();
            System.out.println("数据库名称: " + metaData.getDatabaseProductName());
            System.out.println("数据库版本: " + metaData.getDatabaseProductVersion());
            
            // 列出所有表
            System.out.println("\n=== 数据库中的所有表 ===");
            List<String> tables = new ArrayList<>();
            try (ResultSet rs = metaData.getTables(null, null, "%", new String[]{"TABLE"})) {
                while (rs.next()) {
                    String tableName = rs.getString("TABLE_NAME");
                    tables.add(tableName);
                    System.out.println("- " + tableName);
                }
            }
            
            // 检查关键表是否存在
            String[] requiredTables = {"user", "category", "second_book", "cart", "orders", "favorite", "comment"};
            System.out.println("\n=== 检查必需的表 ===");
            for (String table : requiredTables) {
                boolean exists = tables.contains(table);
                System.out.println((exists ? "✅" : "❌") + " " + table + (exists ? " 存在" : " 缺失！"));
            }
            
        } catch (Exception e) {
            System.err.println("❌ 数据库连接失败！");
            e.printStackTrace();
            throw e;
        }
    }
}