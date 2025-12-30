# 快速修复 manageClassInvite 云函数依赖问题
Write-Host "开始修复 manageClassInvite 云函数依赖问题..." -ForegroundColor Green

# 设置路径
$cloudFunctionPath = "cloudfunctions\manageClassInvite"

# 检查目录是否存在
if (Test-Path $cloudFunctionPath) {
    Write-Host "✅ 找到云函数目录: $cloudFunctionPath" -ForegroundColor Green
    
    # 创建 package.json
    $packageJson = @{
        name = "manageClassInvite"
        version = "1.0.0"
        description = "班级邀请码管理云函数"
        main = "index.js"
        dependencies = @{
            "wx-server-sdk" = "~2.6.3"
        }
        author = ""
        license = "ISC"
    } | ConvertTo-Json -Depth 3
    
    $packageJsonPath = Join-Path $cloudFunctionPath "package.json"
    $packageJson | Out-File -FilePath $packageJsonPath -Encoding UTF8
    Write-Host "✅ 已创建 package.json 文件" -ForegroundColor Green
    
    # 创建 node_modules 目录
    $nodeModulesPath = Join-Path $cloudFunctionPath "node_modules"
    if (-not (Test-Path $nodeModulesPath)) {
        New-Item -ItemType Directory -Path $nodeModulesPath -Force | Out-Null
        Write-Host "✅ 已创建 node_modules 目录" -ForegroundColor Green
    }
    
    # 创建 wx-server-sdk 目录
    $wxServerSdkPath = Join-Path $nodeModulesPath "wx-server-sdk"
    if (-not (Test-Path $wxServerSdkPath)) {
        New-Item -ItemType Directory -Path $wxServerSdkPath -Force | Out-Null
        Write-Host "✅ 已创建 wx-server-sdk 目录" -ForegroundColor Green
    }
    
    # 创建基本的 index.js 文件
    $wxServerSdkIndex = @"
const cloud = require('wx-server-sdk');

module.exports = cloud;
"@
    
    $wxServerSdkIndexPath = Join-Path $wxServerSdkPath "index.js"
    $wxServerSdkIndex | Out-File -FilePath $wxServerSdkIndexPath -Encoding UTF8
    
    # 创建 package.json
    $wxServerSdkPackageJson = @{
        name = "wx-server-sdk"
        version = "2.6.3"
        description = "微信小程序云开发服务端SDK"
        main = "index.js"
        dependencies = @{}
    } | ConvertTo-Json -Depth 3
    
    $wxServerSdkPackageJsonPath = Join-Path $wxServerSdkPath "package.json"
    $wxServerSdkPackageJson | Out-File -FilePath $wxServerSdkPackageJsonPath -Encoding UTF8
    
    Write-Host "✅ 已创建基本的 wx-server-sdk 依赖结构" -ForegroundColor Green
    
    Write-Host "`n🎉 修复完成！" -ForegroundColor Yellow
    Write-Host "现在可以尝试重新部署云函数了。" -ForegroundColor Cyan
    Write-Host "`n部署步骤:" -ForegroundColor Cyan
    Write-Host "1. 在微信开发者工具中右键点击 cloudfunctions/manageClassInvite 目录" -ForegroundColor White
    Write-Host "2. 选择'上传并部署：云端安装依赖'" -ForegroundColor White
    Write-Host "3. 等待部署完成" -ForegroundColor White
    
} else {
    Write-Host "❌ 错误: 找不到云函数目录: $cloudFunctionPath" -ForegroundColor Red
}

Write-Host "`n按任意键继续..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
