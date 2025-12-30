# 部署分享图片生成云函数 PowerShell 脚本
Write-Host "开始部署分享图片生成云函数..." -ForegroundColor Green

# 进入云函数目录
Set-Location "cloudfunctions/shareImageGenerator"

# 安装依赖
Write-Host "安装云函数依赖..." -ForegroundColor Yellow
npm install

# 返回项目根目录
Set-Location "../.."

# 部署云函数
Write-Host "部署云函数到云端..." -ForegroundColor Yellow
wx-server-sdk deploy cloudfunctions/shareImageGenerator

Write-Host "分享图片生成云函数部署完成！" -ForegroundColor Green
Write-Host ""
Write-Host "使用说明：" -ForegroundColor Cyan
Write-Host "1. 在教师班级页面点击'复制并分享邀请码'" -ForegroundColor White
Write-Host "2. 选择'生成分享图片'选项" -ForegroundColor White
Write-Host "3. 开发环境会显示占位符，上线后会显示真实的小程序码" -ForegroundColor White
Write-Host "4. 可以保存图片到相册或直接分享" -ForegroundColor White
