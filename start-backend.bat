@echo off
echo ============================================
echo   BookLoop 后端服务启动中...
echo   端口: 8085
echo ============================================

cd /d "%~dp0"

set CLASSPATH=target\classes;target\dependency\*

for /r target\dependency %%i in (*.jar) do set CLASSPATH=!CLASSPATH!;%%i

java -cp "%CLASSPATH%" com.example.bookstore.BookstoreApplication

pause