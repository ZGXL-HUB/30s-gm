#!/bin/bash

# 部署专项练习进度管理云函数脚本

echo "开始部署专项练习进度管理云函数..."

# 进入云函数目录
cd cloudfunctions/practiceProgress

# 检查是否存在package.json
if [ ! -f "package.json" ]; then
    echo "错误: package.json 文件不存在"
    exit 1
fi

# 安装依赖
echo "安装依赖..."
npm install

# 检查安装是否成功
if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

echo "依赖安装成功"

# 返回根目录
cd ../..

echo "云函数准备完成，请在微信开发者工具中："
echo "1. 右键点击 cloudfunctions/practiceProgress 文件夹"
echo "2. 选择 '上传并部署：云端安装依赖'"
echo "3. 等待部署完成"

echo ""
echo "部署完成后，请确保："
echo "1. 在云开发控制台创建 practice_progress 集合"
echo "2. 设置集合权限为 '所有用户可读，仅创建者可写'"
echo "3. 测试云函数是否正常工作"

echo ""
echo "部署脚本执行完成！" 