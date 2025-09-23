#!/bin/bash

# 部署 helloCloud 云函数的脚本

echo "🚀 开始部署 helloCloud 云函数..."

# 检查云函数目录是否存在
if [ ! -d "cloudfunctions/helloCloud" ]; then
    echo "❌ cloudfunctions/helloCloud 目录不存在"
    exit 1
fi

# 进入云函数目录
cd cloudfunctions/helloCloud

echo "📦 安装依赖..."
npm install

echo "📤 上传云函数..."
# 使用微信开发者工具的命令行工具上传云函数
# 注意：需要在微信开发者工具中手动上传，或者使用以下命令
echo "⚠️  请在微信开发者工具中："
echo "1. 右键点击 cloudfunctions/helloCloud 目录"
echo "2. 选择【上传并部署：云端安装依赖】"
echo "3. 等待上传完成"

echo "✅ 部署脚本执行完成"
echo "📝 接下来请手动在微信开发者工具中上传云函数"
