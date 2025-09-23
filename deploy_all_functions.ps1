# 完整云函数PowerShell部署脚本
# 云环境ID: cloud1-4gyu3i1id5f4e2fa1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开始部署所有云函数到云环境" -ForegroundColor Green
Write-Host "云环境ID: cloud1-4gyu3i1id5f4e2fa1" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# 所有云函数列表（按优先级排序）
$functions = @(
    "login",                    # 用户登录认证 - 最高优先级
    "helloCloud",              # 云开发连通性测试 - 最高优先级
    "practiceProgress",        # 练习进度管理 - 高优先级
    "manageQuestions",         # 题目管理 - 高优先级
    "getQuestionsData",        # 题目数据获取 - 高优先级
    "adminAuth",               # 管理员权限认证 - 中优先级
    "importExportQuestions",   # 题目导入导出 - 中优先级
    "initializeQuestions",     # 题目初始化 - 中优先级
    "feedbackManager",         # 反馈管理 - 低优先级
    "generateExcel",           # Excel生成 - 低优先级
    "generatePDF",             # PDF生成 - 低优先级
    "generateWord",            # Word生成 - 低优先级
    "quickstartFunctions"      # 快速启动函数 - 低优先级
)

Write-Host ""
Write-Host "需要部署的云函数（共13个）：" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

for ($i = 0; $i -lt $functions.Length; $i++) {
    $priority = ""
    $color = "White"
    if ($i -lt 2) {
        $priority = "🔴 最高优先级"
        $color = "Red"
    } elseif ($i -lt 5) {
        $priority = "🟡 高优先级"
        $color = "Yellow"
    } elseif ($i -lt 8) {
        $priority = "🟢 中优先级"
        $color = "Green"
    } else {
        $priority = "🔵 低优先级"
        $color = "Blue"
    }
    
    Write-Host "$($i+1). $($functions[$i]) ($priority)" -ForegroundColor $color
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "开始安装依赖..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# 确保在项目根目录
$projectRoot = "C:\Users\19772\WeChatProjects\miniprogram - 修改主界面 - 未清理数据豆 - 副本"
Set-Location $projectRoot

foreach ($func in $functions) {
    Write-Host ""
    Write-Host "正在处理 $func..." -ForegroundColor Yellow
    
    $funcPath = "cloudfunctions\$func"
    
    if (Test-Path $funcPath) {
        Write-Host "进入目录: $funcPath" -ForegroundColor Gray
        Set-Location $funcPath
        
        if (Test-Path "package.json") {
            Write-Host "安装依赖..." -ForegroundColor Gray
            npm install
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ $func 依赖安装成功" -ForegroundColor Green
            } else {
                Write-Host "❌ $func 依赖安装失败" -ForegroundColor Red
            }
        } else {
            Write-Host "⚠️ $func 没有package.json文件" -ForegroundColor Yellow
        }
        
        # 返回项目根目录
        Set-Location $projectRoot
    } else {
        Write-Host "❌ 目录不存在: $funcPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "依赖安装完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "1. 在微信开发者工具中右键每个云函数文件夹" -ForegroundColor White
Write-Host "2. 选择 '上传并部署：云端安装依赖'" -ForegroundColor White
Write-Host "3. 按优先级顺序部署：" -ForegroundColor White
Write-Host "   - 先部署最高优先级（login, helloCloud）" -ForegroundColor Red
Write-Host "   - 再部署高优先级（practiceProgress, manageQuestions, getQuestionsData）" -ForegroundColor Yellow
Write-Host "   - 最后部署中低优先级云函数" -ForegroundColor Green

Write-Host ""
Write-Host "验证步骤：" -ForegroundColor Yellow
Write-Host "1. 使用测试页面验证：pages/test-cloud/index" -ForegroundColor White
Write-Host "2. 检查云数据库集合权限设置" -ForegroundColor White
Write-Host "3. 测试核心功能是否正常" -ForegroundColor White

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "部署脚本执行完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

