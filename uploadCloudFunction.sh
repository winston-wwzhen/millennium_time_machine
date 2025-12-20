#!/bin/bash

# 微信小程序云函数部署脚本
# 使用方法: ./uploadCloudFunction.sh [envId]

# 设置变量
PROJECT_PATH=$(pwd)
FUNCTION_NAME="quickstartFunctions"

# 检查是否提供了环境ID
if [ -z "$1" ]; then
    echo "错误: 请提供云环境ID"
    echo "使用方法: ./uploadCloudFunction.sh your-cloud-env-id"
    exit 1
fi

ENV_ID=$1

echo "开始部署云函数..."
echo "项目路径: $PROJECT_PATH"
echo "云环境ID: $ENV_ID"
echo "函数名称: $FUNCTION_NAME"

# 执行部署命令
# 注意: 请确保已安装并配置了微信开发者工具的命令行工具
# 具体安装方法请参考: https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html

wx cloud functions deploy \
    --e $ENV_ID \
    --n $FUNCTION_NAME \
    --r \
    --project $PROJECT_PATH

if [ $? -eq 0 ]; then
    echo "✅ 云函数部署成功!"
else
    echo "❌ 云函数部署失败，请检查配置"
    exit 1
fi