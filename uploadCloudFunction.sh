#!/bin/bash

# 批量部署云函数脚本
# 适用于Windows PowerShell和Git Bash

echo "开始批量部署云函数..."

# 需要部署的云函数列表
functions=(
    "login"
    "initializeQuestions"
    "manageQuestions"
    "adminAuth"
    "importExportQuestions"
    "quickstartFunctions"
)

echo "需要部署的云函数："
for func in "${functions[@]}"
do
    echo "- $func"
done

echo ""
echo "请在微信开发者工具中执行以下操作："
echo "=================================="

for func in "${functions[@]}"
do
    echo "1. 右键点击 cloudfunctions/$func 文件夹"
    echo "2. 选择 '上传并部署：云端安装依赖'"
    echo "3. 等待部署完成"
    echo "---"
done

echo ""
echo "部署完成后，请返回测试页面重新测试！"
echo "=================================="

# 如果在Windows环境中，提供PowerShell命令
if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    echo ""
    echo "Windows用户也可以尝试以下命令："
    echo "在微信开发者工具的终端中运行："
    echo ""
    for func in "${functions[@]}"
    do
        echo "# 部署 $func"
        echo "# 右键 cloudfunctions/$func -> 上传并部署"
        echo ""
    done
fi