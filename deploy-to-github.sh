#!/bin/bash

# CircuRent - 部署到 GitHub 脚本

echo "🚀 CircuRent 部署脚本"
echo "===================="
echo ""

# 检查是否已设置远程仓库
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ 远程仓库已配置: $(git remote get-url origin)"
    echo ""
    read -p "是否要推送到现有仓库? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 推送到 GitHub..."
        git push -u origin main
        echo "✅ 推送完成！"
        exit 0
    fi
fi

# 获取 GitHub 用户名
echo "📝 请输入您的 GitHub 用户名:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 用户名不能为空"
    exit 1
fi

# 仓库名称
REPO_NAME="circurent"
REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo ""
echo "📋 配置信息:"
echo "   用户名: $GITHUB_USERNAME"
echo "   仓库名: $REPO_NAME"
echo "   URL: $REPO_URL"
echo ""

# 确认
read -p "是否继续? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 已取消"
    exit 1
fi

# 检查仓库是否已存在
echo "🔍 检查仓库是否存在..."
if curl -s -o /dev/null -w "%{http_code}" "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}" | grep -q "200"; then
    echo "⚠️  仓库已存在，直接添加远程并推送..."
else
    echo "📝 请先在 GitHub 创建仓库:"
    echo "   1. 访问: https://github.com/new"
    echo "   2. Repository name: $REPO_NAME"
    echo "   3. 选择 Public 或 Private"
    echo "   4. 不要勾选任何初始化选项"
    echo "   5. 点击 'Create repository'"
    echo ""
    read -p "创建完成后按 Enter 继续..."
fi

# 添加远程仓库
echo ""
echo "🔗 添加远程仓库..."
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# 推送
echo "📤 推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 成功推送到 GitHub！"
    echo ""
    echo "🔗 仓库地址: $REPO_URL"
    echo ""
    echo "📋 下一步:"
    echo "   1. 访问: https://vercel.com"
    echo "   2. 导入 GitHub 仓库: $REPO_NAME"
    echo "   3. 配置环境变量（参考 VERCEL_ENV_VARS.md）"
    echo "   4. 部署！"
else
    echo ""
    echo "❌ 推送失败"
    echo "   请检查:"
    echo "   1. GitHub 仓库是否已创建"
    echo "   2. 是否有推送权限"
    echo "   3. 网络连接是否正常"
fi

