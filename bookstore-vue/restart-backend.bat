@echo off
chcp 65001 >nul
echo ========================================
echo   BookLoop 后端服务重启工具
echo ========================================
echo.

cd /d "D:\WorkSpace\bookstore-IDEA"

echo [1/3] 查找并停止现有的Java进程...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8085 ^| findstr LISTENING') do (
    echo    找到进程 PID: %%a
    taskkill /PID %%a /F >nul 2>&1
    echo    已停止
)

echo.
echo [2/3] 等待2秒让端口释放...
timeout /t 2 /nobreak >nul

echo.
echo [3/3] 启动后端服务...
echo.
echo 📍 后端地址: http://localhost:8085
echo 📝 日志输出:
echo ----------------------------------------

start "BookLoop Backend" cmd /k "cd /d D:\WorkSpace\bookstore-IDEA && start-backend.bat"

echo.
echo ✅ 后端服务正在后台启动...
echo ⏳ 请等待10-20秒让服务完全启动
echo.
echo 启动完成后，请访问: http://localhost:90/#/
echo.

timeout /t 3 /nobreak >nul
echo 💡 提示：如果看到 "Started BookstoreApplication" 表示启动成功
pause