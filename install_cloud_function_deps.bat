@echo off
chcp 65001 >nul
echo 正在安装云函数依赖...

cd /d "%~dp0cloudfunctions\manageClassInvite"
echo 当前目录: %CD%

if not exist package.json (
    echo 错误: package.json 文件不存在
    pause
    exit /b 1
)

echo 开始安装依赖...
npm install

if %ERRORLEVEL% EQU 0 (
    echo 依赖安装成功！
    echo 现在可以重新部署云函数了
) else (
    echo 依赖安装失败，错误代码: %ERRORLEVEL%
)

pause
