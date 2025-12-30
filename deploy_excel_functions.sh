#!/bin/bash

# 部署Excel相关云函数脚本
echo "=========================================="
echo "开始部署Excel相关云函数"
echo "=========================================="

echo "需要部署的Excel相关云函数："
echo "- parseStudentExcel: 解析学生Excel文件"
echo "- generateStudentTemplate: 生成Excel模板"
echo ""

echo "=========================================="
echo "部署步骤："
echo "=========================================="

echo ""
echo "1. 部署 parseStudentExcel 云函数："
echo "   - 右键点击 cloudfunctions/parseStudentExcel 文件夹"
echo "   - 选择 '上传并部署：云端安装依赖'"
echo "   - 等待部署完成"
echo ""

echo "2. 部署 generateStudentTemplate 云函数："
echo "   - 右键点击 cloudfunctions/generateStudentTemplate 文件夹"
echo "   - 选择 '上传并部署：云端安装依赖'"
echo "   - 等待部署完成"
echo ""

echo "=========================================="
echo "部署完成后的验证："
echo "=========================================="
echo "1. 在云开发控制台检查云函数是否部署成功"
echo "2. 测试Excel模板生成功能"
echo "3. 测试Excel文件解析功能"
echo ""

echo "=========================================="
echo "注意事项："
echo "=========================================="
echo "1. 确保云开发环境已开通"
echo "2. 确保云存储权限已配置"
echo "3. 确保云数据库students集合已创建"
echo "4. 如果部署失败，检查网络连接和权限设置"
echo ""

echo "=========================================="
echo "部署脚本执行完成！"
echo "=========================================="
