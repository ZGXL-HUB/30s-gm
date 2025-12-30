# 部署班级学生数量同步云函数

Write-Host "开始部署班级学生数量同步云函数..." -ForegroundColor Green

# 检查是否在正确的目录
if (-not (Test-Path "cloudfunctions")) {
    Write-Host "错误：请在项目根目录运行此脚本" -ForegroundColor Red
    exit 1
}

# 进入云函数目录
Set-Location "cloudfunctions\syncClassStudentCount"

# 安装依赖
Write-Host "安装云函数依赖..." -ForegroundColor Yellow
npm install

# 返回项目根目录
Set-Location "..\.."

# 部署云函数
Write-Host "部署云函数 syncClassStudentCount..." -ForegroundColor Yellow

# 检查是否安装了微信开发者工具
if (Get-Command "wx-server-sdk" -ErrorAction SilentlyContinue) {
    wx-server-sdk deploy cloudfunctions/syncClassStudentCount
} else {
    Write-Host "wx-server-sdk 命令未找到，请使用以下方法之一：" -ForegroundColor Red
    Write-Host "1. 在微信开发者工具中右键点击 cloudfunctions/syncClassStudentCount 文件夹" -ForegroundColor Yellow
    Write-Host "2. 选择 '上传并部署：云端安装依赖（不上传node_modules）'" -ForegroundColor Yellow
    Write-Host "3. 或者安装 wx-server-sdk: npm install -g wx-server-sdk" -ForegroundColor Yellow
}

Write-Host "班级学生数量同步云函数部署完成！" -ForegroundColor Green
Write-Host ""
Write-Host "使用方法：" -ForegroundColor Cyan
Write-Host "1. 在教师端班级管理页面，点击'刷新班级'按钮"
Write-Host "2. 在教师端学生管理页面，点击'刷新'按钮"
Write-Host "3. 学生加入班级后，数据会自动同步"
Write-Host ""
Write-Host "注意事项：" -ForegroundColor Yellow
Write-Host "- 确保云开发环境已正确配置"
Write-Host "- 确保数据库集合 'classes' 和 'students' 存在"
Write-Host "- 如果遇到权限问题，请检查云函数权限配置"
