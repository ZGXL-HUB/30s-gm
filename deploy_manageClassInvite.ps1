# 部署 manageClassInvite 云函数
# PowerShell 脚本，用于快速部署云函数

Write-Host "🚀 开始部署 manageClassInvite 云函数..." -ForegroundColor Green

# 设置路径
$cloudFunctionPath = "cloudfunctions\manageClassInvite"

# 检查目录是否存在
if (Test-Path $cloudFunctionPath) {
    Write-Host "✅ 找到云函数目录: $cloudFunctionPath" -ForegroundColor Green
    
    # 检查 package.json 是否存在
    $packageJsonPath = Join-Path $cloudFunctionPath "package.json"
    if (Test-Path $packageJsonPath) {
        Write-Host "✅ 找到 package.json 文件" -ForegroundColor Green
        
        # 显示 package.json 内容
        $packageJson = Get-Content $packageJsonPath -Raw
        Write-Host "📄 package.json 内容:" -ForegroundColor Yellow
        Write-Host $packageJson
        
    } else {
        Write-Host "❌ 未找到 package.json 文件" -ForegroundColor Red
        Write-Host "💡 请确保 cloudfunctions/manageClassInvite/package.json 文件存在" -ForegroundColor Yellow
    }
    
    # 检查 index.js 是否存在
    $indexJsPath = Join-Path $cloudFunctionPath "index.js"
    if (Test-Path $indexJsPath) {
        Write-Host "✅ 找到 index.js 文件" -ForegroundColor Green
    } else {
        Write-Host "❌ 未找到 index.js 文件" -ForegroundColor Red
        Write-Host "💡 请确保 cloudfunctions/manageClassInvite/index.js 文件存在" -ForegroundColor Yellow
    }
    
} else {
    Write-Host "❌ 未找到云函数目录: $cloudFunctionPath" -ForegroundColor Red
    Write-Host "💡 请确保云函数目录存在" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📋 部署步骤:" -ForegroundColor Cyan
Write-Host "1. 在微信开发者工具中，找到 cloudfunctions/manageClassInvite 文件夹" -ForegroundColor White
Write-Host "2. 右键点击 manageClassInvite 文件夹" -ForegroundColor White
Write-Host "3. 选择 '上传并部署：云端安装依赖'" -ForegroundColor White
Write-Host "4. 等待部署完成（通常需要1-2分钟）" -ForegroundColor White
Write-Host "5. 检查云开发控制台确认部署成功" -ForegroundColor White

Write-Host "`n🔍 验证部署结果:" -ForegroundColor Cyan
Write-Host "部署完成后，请运行以下脚本验证:" -ForegroundColor White
Write-Host "1. 在微信开发者工具控制台运行: fix_manageClassInvite_cloud_function.js" -ForegroundColor White
Write-Host "2. 或者运行: comprehensive_cloud_fix.js" -ForegroundColor White

Write-Host "`n💡 如果部署失败，请检查:" -ForegroundColor Yellow
Write-Host "- 云开发环境是否正常" -ForegroundColor White
Write-Host "- 网络连接是否稳定" -ForegroundColor White
Write-Host "- 微信开发者工具版本是否最新" -ForegroundColor White
Write-Host "- 云开发配额是否充足" -ForegroundColor White

Write-Host "`n🎉 部署脚本执行完成！" -ForegroundColor Green
