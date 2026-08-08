@echo off
chcp 65001 >nul
echo ========================================
echo   BookLoop Frontend Startup Script
echo ========================================
echo.

cd /d "D:\nginx-1.22.0-web (1)\nginx-1.22.0-web"

echo [1/3] Stopping existing Nginx processes...
nginx.exe -s stop 2>nul
timeout /t 1 /nobreak >nul

echo [2/3] Testing configuration...
nginx.exe -t -c "D:\WorkSpace\bookstore-vue\nginx.conf"
if errorlevel 1 (
    echo ❌ Configuration test failed!
    pause
    exit /b 1
)

echo [3/3] Starting Nginx with correct config...
nginx.exe -c "D:\WorkSpace\bookstore-vue\nginx.conf"

echo.
echo ✅ Nginx started successfully!
echo 📍 Frontend URL: http://localhost:90/#/
echo 🔧 Backend URL: http://localhost:8085/api/
echo.
echo Press any key to open browser...
pause >nul

start http://localhost:90/#/

echo.
echo 💡 Tip: If page flickers, press Ctrl+Shift+R to clear cache
echo.
pause