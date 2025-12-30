# 修复云函数依赖问题的PowerShell脚本
# 请在项目根目录运行此脚本

Write-Host "🔧 开始修复云函数依赖问题..." -ForegroundColor Green

# 设置项目根目录
$projectRoot = Get-Location
Write-Host "📁 项目根目录: $projectRoot" -ForegroundColor Yellow

# 需要修复的云函数列表（基于错误信息）
$cloudFunctions = @(
    "manageClassInvite",
    "createAssignment",
    "parseStudentExcel", 
    "generateStudentTemplate",
    "studentJoinClass",
    "getAssignments",
    "getStudentAssignments",
    "submitAssignmentResult"
)

Write-Host "📋 需要修复的云函数数量: $($cloudFunctions.Count)" -ForegroundColor Yellow

foreach ($funcName in $cloudFunctions) {
    $funcPath = Join-Path $projectRoot "cloudfunctions\$funcName"
    
    if (Test-Path $funcPath) {
        Write-Host "`n🔍 处理云函数: $funcName" -ForegroundColor Cyan
        
        # 检查package.json是否存在
        $packageJsonPath = Join-Path $funcPath "package.json"
        if (Test-Path $packageJsonPath) {
            Write-Host "✅ 找到 package.json" -ForegroundColor Green
            
            # 检查是否包含wx-server-sdk依赖
            $packageContent = Get-Content $packageJsonPath -Raw
            if ($packageContent -match "wx-server-sdk") {
                Write-Host "✅ wx-server-sdk 依赖已配置" -ForegroundColor Green
            } else {
                Write-Host "❌ 缺少 wx-server-sdk 依赖" -ForegroundColor Red
                
                # 添加wx-server-sdk依赖
                $packageObj = $packageContent | ConvertFrom-Json
                if (-not $packageObj.dependencies) {
                    $packageObj.dependencies = @{}
                }
                $packageObj.dependencies."wx-server-sdk" = "~2.6.3"
                
                $packageObj | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath
                Write-Host "✅ 已添加 wx-server-sdk 依赖" -ForegroundColor Green
            }
            
            # 检查node_modules是否存在
            $nodeModulesPath = Join-Path $funcPath "node_modules"
            if (Test-Path $nodeModulesPath) {
                Write-Host "✅ node_modules 存在" -ForegroundColor Green
            } else {
                Write-Host "⚠️ node_modules 不存在，需要安装依赖" -ForegroundColor Yellow
            }
            
        } else {
            Write-Host "❌ 未找到 package.json" -ForegroundColor Red
        }
        
    } else {
        Write-Host "❌ 云函数目录不存在: $funcPath" -ForegroundColor Red
    }
}

Write-Host "`n📋 修复步骤总结:" -ForegroundColor Yellow
Write-Host "1. 在微信开发者工具中，右键点击以下云函数文件夹:" -ForegroundColor White
foreach ($funcName in $cloudFunctions) {
    Write-Host "   - cloudfunctions\$funcName" -ForegroundColor Gray
}

Write-Host "`n2. 选择 '上传并部署：云端安装依赖'" -ForegroundColor White
Write-Host "`n3. 等待部署完成（通常需要1-2分钟）" -ForegroundColor White
Write-Host "`n4. 重新测试云函数调用" -ForegroundColor White

Write-Host "`n💡 或者使用以下命令手动安装依赖:" -ForegroundColor Yellow
foreach ($funcName in $cloudFunctions) {
    Write-Host "cd cloudfunctions\$funcName && npm install" -ForegroundColor Gray
}

Write-Host "`n🎉 脚本执行完成！" -ForegroundColor Green
Write-Host "⚠️ 请按照上述步骤在微信开发者工具中重新部署云函数。" -ForegroundColor Yellow
