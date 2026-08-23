package com.example.bookstore.config;

import com.example.bookstore.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    public static final String ATTRIBUTE_USER_ID = "currentUserId";
    public static final String ATTRIBUTE_USERNAME = "currentUsername";
    public static final String ATTRIBUTE_USER_ROLE = "currentUserRole";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String uri = request.getRequestURI();
        String token = extractToken(request);

        if (isPublicEndpoint(uri)) {
            if (token != null && jwtUtil.validateToken(token)) {
                setUserInfo(request, token);
            }
            return true;
        }

        if (token == null || !jwtUtil.validateToken(token)) {
            sendUnauthorized(response, "未登录或登录已过期");
            return false;
        }

        try {
            setUserInfo(request, token);
            return true;
        } catch (Exception e) {
            sendUnauthorized(response, "无效的认证信息");
            return false;
        }
    }

    private void setUserInfo(HttpServletRequest request, String token) {
        Integer userId = jwtUtil.getUserIdFromToken(token);
        String username = jwtUtil.getUsernameFromToken(token);
        Integer role = jwtUtil.getRoleFromToken(token);

        request.setAttribute(ATTRIBUTE_USER_ID, userId);
        request.setAttribute(ATTRIBUTE_USERNAME, username);
        request.setAttribute(ATTRIBUTE_USER_ROLE, role);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }

        String param = request.getParameter("token");
        if (param != null && !param.isEmpty()) {
            return param;
        }

        return null;
    }

    private boolean isPublicEndpoint(String uri) {
        String[] publicPaths = {
            "/api/user/login",
            "/api/user/register",
            "/api/category/",
            "/api/secondbook/list",
            "/api/secondbook/detail",
            "/api/comment/book"
        };

        for (String path : publicPaths) {
            if (uri.startsWith(path)) {
                return true;
            }
        }

        if (uri.contains("/uploads/") || uri.contains("/static/")) {
            return true;
        }

        return false;
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");

        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("code", 401);
        result.put("msg", message);

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(result));
    }
}