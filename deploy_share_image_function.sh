#!/bin/bash

# 部署分享图片生成云函数
echo "开始部署分享图片生成云函数..."

# 进入云函数目录
cd cloudfunctions/shareImageGenerator

# 安装依赖
echo "安装云函数依赖..."
npm install

# 返回项目根目录
cd ../..

# 部署云函数
echo "部署云函数到云端..."
wx-server-sdk deploy cloudfunctions/shareImageGenerator

echo "分享图片生成云函数部署完成！"
echo ""
echo "使用说明："
echo "1. 在教师班级页面点击'复制并分享邀请码'"
echo "2. 选择'生成分享图片'选项"
echo "3. 开发环境会显示占位符，上线后会显示真实的小程序码"
echo "4. 可以保存图片到相册或直接分享"
