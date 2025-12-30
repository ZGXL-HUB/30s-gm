#!/bin/bash

# 批量部署所有云函数脚本
# 适用于Windows PowerShell和Git Bash

echo "=========================================="
echo "开始批量部署所有云函数到云环境"
echo "云环境ID: cloud1-4gyu3i1id5f4e2fa1"
echo "=========================================="

# 需要部署的云函数列表
functions=(
    "login"
    "helloCloud"
    "practiceProgress"
    "manageQuestions"
    "getQuestionsData"
    "adminAuth"
    "importExportQuestions"
    "initializeQuestions"
    "feedbackManager"
    "generateExcel"
    "generatePDF"
    "generateWord"
    "parseStudentExcel"
    "generateStudentTemplate"
)

echo "需要部署的云函数："
for func in "${functions[@]}"
do
    echo "- $func"
done

echo ""
echo "=========================================="
echo "请在微信开发者工具中执行以下操作："
echo "=========================================="

for func in "${functions[@]}"
do
    echo ""
    echo "部署云函数: $func"
    echo "步骤："
    echo "1. 右键点击 cloudfunctions/$func 文件夹"
    echo "2. 选择 '上传并部署：云端安装依赖'"
    echo "3. 等待部署完成"
    echo "4. 检查部署状态"
    echo "---"
done

echo ""
echo "=========================================="
echo "部署完成后的验证步骤："
echo "=========================================="
echo "1. 在云开发控制台检查所有云函数是否部署成功"
echo "2. 测试关键云函数调用："
echo "   - login: 用户登录"
echo "   - helloCloud: 云开发连通性测试"
echo "   - practiceProgress: 练习进度管理"
echo "   - manageQuestions: 题目管理"
echo "3. 检查云数据库集合权限设置"
echo "4. 验证小程序端云函数调用是否正常"

echo ""
echo "=========================================="
echo "云数据库集合权限设置建议："
echo "=========================================="
echo "questions: 所有用户可读，仅创建者可写"
echo "practice_progress: 仅创建者可读写"
echo "user_progress: 仅创建者可读写"
echo "feedback: 所有用户可读，仅创建者可写"

echo ""
echo "=========================================="
echo "部署脚本执行完成！"
echo "=========================================="

