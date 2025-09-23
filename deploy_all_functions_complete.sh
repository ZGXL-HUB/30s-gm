#!/bin/bash

# 完整云函数部署脚本 - 包含所有13个云函数
# 云环境ID: cloud1-4gyu3i1id5f4e2fa1

echo "=========================================="
echo "开始部署所有云函数到云环境"
echo "云环境ID: cloud1-4gyu3i1id5f4e2fa1"
echo "=========================================="

# 所有云函数列表（按优先级排序）
functions=(
    "login"                    # 用户登录认证 - 最高优先级
    "helloCloud"              # 云开发连通性测试 - 最高优先级
    "practiceProgress"        # 练习进度管理 - 高优先级
    "manageQuestions"         # 题目管理 - 高优先级
    "getQuestionsData"        # 题目数据获取 - 高优先级
    "adminAuth"               # 管理员权限认证 - 中优先级
    "importExportQuestions"   # 题目导入导出 - 中优先级
    "initializeQuestions"     # 题目初始化 - 中优先级
    "feedbackManager"         # 反馈管理 - 低优先级
    "generateExcel"           # Excel生成 - 低优先级
    "generatePDF"             # PDF生成 - 低优先级
    "generateWord"            # Word生成 - 低优先级
    "quickstartFunctions"     # 快速启动函数 - 低优先级
)

echo "需要部署的云函数（共13个）："
echo "=========================================="
for i in "${!functions[@]}"; do
    echo "$((i+1)). ${functions[i]}"
done

echo ""
echo "=========================================="
echo "部署优先级说明："
echo "=========================================="
echo "🔴 最高优先级（必须部署）："
echo "   - login: 用户登录认证"
echo "   - helloCloud: 云开发连通性测试"
echo ""
echo "🟡 高优先级（核心功能）："
echo "   - practiceProgress: 练习进度管理"
echo "   - manageQuestions: 题目管理"
echo "   - getQuestionsData: 题目数据获取"
echo ""
echo "🟢 中优先级（扩展功能）："
echo "   - adminAuth: 管理员权限认证"
echo "   - importExportQuestions: 题目导入导出"
echo "   - initializeQuestions: 题目初始化"
echo ""
echo "🔵 低优先级（辅助功能）："
echo "   - feedbackManager: 反馈管理"
echo "   - generateExcel: Excel生成"
echo "   - generatePDF: PDF生成"
echo "   - generateWord: Word生成"
echo "   - quickstartFunctions: 快速启动函数"

echo ""
echo "=========================================="
echo "方式1：在微信开发者工具中部署（推荐）"
echo "=========================================="
echo "请在微信开发者工具中执行以下操作："
echo ""

for i in "${!functions[@]}"; do
    func="${functions[i]}"
    priority=""
    if [ $i -lt 2 ]; then
        priority="🔴 最高优先级"
    elif [ $i -lt 5 ]; then
        priority="🟡 高优先级"
    elif [ $i -lt 8 ]; then
        priority="🟢 中优先级"
    else
        priority="🔵 低优先级"
    fi
    
    echo "$((i+1)). 部署 $func ($priority)"
    echo "   右键点击 cloudfunctions/$func 文件夹"
    echo "   选择 '上传并部署：云端安装依赖'"
    echo "   等待部署完成"
    echo ""
done

echo "=========================================="
echo "方式2：使用命令行部署"
echo "=========================================="
echo "如果您想使用命令行部署，请确保已安装微信开发者工具CLI"
echo ""

for func in "${functions[@]}"; do
    echo "# 部署 $func"
    echo "cd cloudfunctions/$func"
    echo "npm install"
    echo "cd ../.."
    echo "wx-cli cloud functions deploy $func --env cloud1-4gyu3i1id5f4e2fa1"
    echo ""
done

echo "=========================================="
echo "部署完成后的验证步骤："
echo "=========================================="
echo "1. 检查云开发控制台中所有云函数是否部署成功"
echo "2. 使用测试页面验证核心功能："
echo "   - 访问 pages/test-cloud/index"
echo "   - 点击 '运行综合测试'"
echo "3. 测试关键功能："
echo "   - 用户登录"
echo "   - 题目数据加载"
echo "   - 练习进度保存"
echo "   - 错题统计"
echo "4. 检查云数据库集合权限设置"

echo ""
echo "=========================================="
echo "云数据库集合权限设置："
echo "=========================================="
echo "questions: 所有用户可读，仅创建者可写"
echo "practice_progress: 仅创建者可读写"
echo "user_progress: 仅创建者可读写"
echo "feedback: 所有用户可读，仅创建者可写"
echo "admin_logs: 仅管理员可读写"

echo ""
echo "=========================================="
echo "部署脚本执行完成！"
echo "建议优先部署最高优先级和高优先级的云函数"
echo "=========================================="

