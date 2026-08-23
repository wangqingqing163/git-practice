package com.example.bookstore.controller;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class UserControllerRestAssuredTest {
    @BeforeEach
    public void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = 8085;
        RestAssured.basePath="/api";

    }
    @Test
    public void login_Success() {
        String requestBoby="{\"username\":\"admin\",\"password\":\"admin123\"}";
        given()
                .contentType("application/json")
                .body(requestBoby)
                .when()
                .post("/user/login")
                .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("user.username", equalTo("admin"));

    }
    @Test
    void Login_WrongPassword() {
        String requestBody = "{\"username\":\"admin\",\"password\":\"wrong\"}";

        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/login")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("用户名或密码错误"));//用户名或密码错误
    }
    @Test
    void Login_WrongUsername() {
        String requestBody = "{\"username\":\"admi\",\"password\":\"admin123\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/login")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("用户名或密码错误"));//用户名或密码错误

    }
    @Test
    void Login_UsernameIsNull() {
        String requestBody = "{\"username\":\"\",\"password\":\"admin123\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/login")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("用户名或密码错误"));//空用户名会查询失败

    }
    @Test
    void Login_PasswordIsNull() {
        String requestBody = "{\"username\":\"admin\",\"password\":\"\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/login")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("用户名或密码错误"));//空密码会匹配失败

    }
    @Test
     void register_Success(){
        String requestBoby="{\"username\":\"test002\",\"password\":\"Ww123456\"}";
        given()
                .contentType("application/json")
                .body(requestBoby)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success",equalTo(true))
                .body("msg",equalTo("注册成功"));
    }

    @Test
    void register_UsernameIsAllNumbers() {
        String requestBody = "{\"username\":\"1111\",\"password\":\"Wa123456\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("用户名只能包含字母、数字、下划线，且必须以字母开头"));
    }

    @Test
    void register_UsernameStartsWithNumber() {
        String requestBody = "{\"username\":\"1test\",\"password\":\"Wa123456\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("用户名只能包含字母、数字、下划线，且必须以字母开头"));
    }

    @Test
    void register_UsernameTooShort() {
        String requestBody = "{\"username\":\"abc\",\"password\":\"Wa123456\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("用户名长度必须在4-20个字符之间"));
    }

    @Test
    void register_PasswordTooShort() {
        String requestBody = "{\"username\":\"test002\",\"password\":\"Wa1234\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("密码长度必须在8-20个字符之间"));
    }

    @Test
    void register_PasswordNoUppercase() {
        String requestBody = "{\"username\":\"test003\",\"password\":\"ww123456\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("密码必须包含大小写字母和数字"));
    }

    @Test
    void register_PasswordNoLowercase() {
        String requestBody = "{\"username\":\"test004\",\"password\":\"WW123456\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("密码必须包含大小写字母和数字"));
    }

    @Test
    void register_PasswordNoNumber() {
        String requestBody = "{\"username\":\"test005\",\"password\":\"Wwabcdef\"}";
        given()
                .contentType("application/json")
                .body(requestBody)
                .when()
                .post("/user/register")
                .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("msg", equalTo("密码必须包含大小写字母和数字"));
    }

}