# 部署 studentJoinClass 云函数脚本
# 解决 wx-server-sdk 依赖缺失问题

Write-Host "🚀 开始部署 studentJoinClass 云函数..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# 确保在项目根目录
$projectRoot = "C:\Users\19772\WeChatProjects\miniprogram - 修改主界面 - 未清理数据豆 - 副本"
Set-Location $projectRoot

# 检查云函数目录是否存在
$funcPath = "cloudfunctions\studentJoinClass"
if (-not (Test-Path $funcPath)) {
    Write-Host "❌ 云函数目录不存在: $funcPath" -ForegroundColor Red
    exit 1
}

Write-Host "📁 进入云函数目录: $funcPath" -ForegroundColor Yellow
Set-Location $funcPath

# 检查 package.json 是否存在
if (Test-Path "package.json") {
    Write-Host "✅ 找到 package.json 文件" -ForegroundColor Green
    
    # 安装依赖
    Write-Host "📦 安装依赖..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 依赖安装成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ package.json 文件不存在" -ForegroundColor Red
    exit 1
}

# 返回项目根目录
Set-Location $projectRoot

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📤 部署说明" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "请在微信开发者工具中执行以下步骤：" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 右键点击 cloudfunctions\studentJoinClass 文件夹" -ForegroundColor White
Write-Host "2. 选择 '上传并部署：云端安装依赖'" -ForegroundColor White
Write-Host "3. 等待部署完成" -ForegroundColor White
Write-Host ""
Write-Host "部署完成后，请测试云函数是否正常工作：" -ForegroundColor Yellow
Write-Host "- 调用 studentJoinClass 云函数" -ForegroundColor White
Write-Host "- 检查是否还有 'Cannot find module wx-server-sdk' 错误" -ForegroundColor White
Write-Host ""
Write-Host "✅ 部署脚本执行完成！" -ForegroundColor Green
