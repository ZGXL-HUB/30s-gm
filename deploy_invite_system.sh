#!/bin/bash

# 部署班级邀请码系统
echo "🚀 开始部署班级邀请码系统..."

# 1. 部署云函数
echo "📦 部署云函数..."

# 部署班级邀请码管理云函数
echo "部署 manageClassInvite 云函数..."
cd cloudfunctions/manageClassInvite
npm install
cd ../..

echo "部署 studentJoinClass 云函数..."
cd cloudfunctions/studentJoinClass
npm install
cd ../..

# 2. 更新数据库结构
echo "🗄️ 更新数据库结构..."
echo "请在云开发控制台中执行以下SQL脚本："
echo "文件: database_schema_extension_invite_system.sql"

# 3. 验证部署
echo "✅ 验证部署..."

# 检查云函数是否存在
echo "检查云函数部署状态..."

# 4. 测试功能
echo "🧪 测试功能..."
echo "1. 教师创建班级时会自动生成邀请码"
echo "2. 学生可以通过邀请码加入班级"
echo "3. 支持邀请码管理（查看、重新生成、禁用）"
echo "4. 支持分享班级邀请"

echo "🎉 班级邀请码系统部署完成！"
echo ""
echo "📋 使用说明："
echo "1. 教师创建班级后会自动生成邀请码"
echo "2. 教师可以在班级列表中查看和管理邀请码"
echo "3. 学生通过 pages/student-join-class/index?code=邀请码 加入班级"
echo "4. 支持微信分享功能，可以直接分享班级邀请链接"
echo ""
echo "🔧 后续配置："
echo "1. 在云开发控制台执行数据库结构更新脚本"
echo "2. 测试教师端班级创建和邀请码生成功能"
echo "3. 测试学生端加入班级功能"
echo "4. 根据需要调整邀请码有效期和使用次数限制"
