#!/bin/bash

# 部署班级学生数量同步云函数

echo "开始部署班级学生数量同步云函数..."

# 检查是否在正确的目录
if [ ! -d "cloudfunctions" ]; then
    echo "错误：请在项目根目录运行此脚本"
    exit 1
fi

# 进入云函数目录
cd cloudfunctions/syncClassStudentCount

# 安装依赖
echo "安装云函数依赖..."
npm install

# 返回项目根目录
cd ../..

# 部署云函数
echo "部署云函数 syncClassStudentCount..."
wx-server-sdk deploy cloudfunctions/syncClassStudentCount

echo "班级学生数量同步云函数部署完成！"
echo ""
echo "使用方法："
echo "1. 在教师端班级管理页面，点击'刷新班级'按钮"
echo "2. 在教师端学生管理页面，点击'刷新'按钮"
echo "3. 学生加入班级后，数据会自动同步"
echo ""
echo "注意事项："
echo "- 确保云开发环境已正确配置"
echo "- 确保数据库集合 'classes' 和 'students' 存在"
echo "- 如果遇到权限问题，请检查云函数权限配置"
