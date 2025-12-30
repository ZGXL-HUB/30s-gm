# 部署学生加入班级修复的云函数

Write-Host "===== 部署学生加入班级修复 =====" -ForegroundColor Green
Write-Host ""

# 检查是否安装了微信开发者工具命令行
$cliPath = "C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat"
if (-Not (Test-Path $cliPath)) {
    Write-Host "错误：未找到微信开发者工具命令行工具" -ForegroundColor Red
    Write-Host "请确保已安装微信开发者工具" -ForegroundColor Red
    exit 1
}

Write-Host "步骤1：部署 studentJoinClass 云函数" -ForegroundColor Cyan
Write-Host "--------------------------------------"
& $cliPath upload-cloud-function --function studentJoinClass

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ studentJoinClass 部署成功" -ForegroundColor Green
} else {
    Write-Host "✗ studentJoinClass 部署失败" -ForegroundColor Red
    Write-Host "请手动部署此云函数" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "步骤2：部署 manageClassInvite 云函数" -ForegroundColor Cyan
Write-Host "--------------------------------------"
& $cliPath upload-cloud-function --function manageClassInvite

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ manageClassInvite 部署成功" -ForegroundColor Green
} else {
    Write-Host "✗ manageClassInvite 部署失败" -ForegroundColor Red
    Write-Host "请手动部署此云函数" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===== 部署完成 =====" -ForegroundColor Green
Write-Host ""
Write-Host "后续步骤：" -ForegroundColor Yellow
Write-Host "1. 打开微信开发者工具" -ForegroundColor White
Write-Host "2. 在云开发控制台查看云函数日志" -ForegroundColor White
Write-Host "3. 运行 test_student_join_class_fix.js 测试脚本" -ForegroundColor White
Write-Host "4. 验证学生加入班级后数据是否正确写入" -ForegroundColor White
Write-Host ""
Write-Host "修复说明：" -ForegroundColor Yellow
Write-Host "✓ 学生端强制要求输入姓名" -ForegroundColor Green
Write-Host "✓ 云函数增加详细的日志输出" -ForegroundColor Green
Write-Host "✓ 云函数验证学生信息完整性" -ForegroundColor Green
Write-Host "✓ 邀请码验证时实时统计学生数量" -ForegroundColor Green
Write-Host "✓ 自动同步 classes 集合的 currentStudents 字段" -ForegroundColor Green
Write-Host ""

