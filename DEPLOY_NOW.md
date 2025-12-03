# 🚀 立即部署 - 执行步骤

## ✅ 已完成

- ✅ Git 仓库已初始化
- ✅ 所有文件已提交（59 个文件）
- ✅ 主分支已设置为 `main`

## 📋 下一步：创建 GitHub 仓库

### 方法 1: 使用 GitHub 网页（推荐）

1. **访问**: https://github.com/new
2. **填写信息**:
   - Repository name: `circurent`
   - Description: `Rental platform built with Next.js, Supabase, and Resend`
   - 选择 **Public** 或 **Private**
   - **不要勾选**任何初始化选项（README、.gitignore、license）
3. **点击 "Create repository"**

4. **复制仓库 URL**（例如：`https://github.com/YOUR_USERNAME/circurent.git`）

5. **在终端执行以下命令**（替换 YOUR_USERNAME）：

```bash
cd "/Users/ken.lin/Desktop/Alessandro Smit Project CircuRent"

# 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/circurent.git

# 推送到 GitHub
git push -u origin main
```

### 方法 2: 使用 GitHub CLI（如果已安装）

```bash
# 安装 GitHub CLI（如果还没有）
brew install gh

# 登录
gh auth login

# 创建仓库并推送
gh repo create circurent --public --source=. --remote=origin --push
```

## 🟢 然后：部署到 Vercel

### 步骤 1: 访问 Vercel

1. 打开: https://vercel.com
2. 使用 **GitHub 账号登录**

### 步骤 2: 导入项目

1. 点击 **"Add New Project"**
2. 选择 **"Import Git Repository"**
3. 找到并选择 `circurent` 仓库
4. 点击 **"Import"**

### 步骤 3: 配置项目

1. **Framework Preset**: Next.js（自动检测）
2. **Root Directory**: `./`（默认）
3. **其他设置**: 保持默认

### 步骤 4: 配置环境变量 ⚠️ 重要！

在部署前，点击 **"Environment Variables"** 并添加：

#### 必需变量：

```
NEXT_PUBLIC_SUPABASE_URL
= 你的 Supabase URL

NEXT_PUBLIC_SUPABASE_ANON_KEY
= 你的 Supabase Anon Key

SUPABASE_SERVICE_ROLE_KEY
= 你的 Supabase Service Role Key

JWT_SECRET
= 你的 JWT Secret（至少32字符）

RESEND_API_KEY
= re_AcovjuaR_5JpoEbpeGfiDpGgQS6vDrLyg

RESEND_FROM_EMAIL
= CircuRent <onboarding@resend.dev>
```

**重要**:
- 每个变量都要添加到 ✅ Production、✅ Preview、✅ Development
- 点击 "Add" 保存每个变量

### 步骤 5: 部署

1. 点击 **"Deploy"**
2. 等待构建完成（约 2-3 分钟）
3. 部署完成后，访问您的应用 URL

## ✅ 部署后检查

- [ ] 访问生产 URL，页面正常加载
- [ ] 测试用户注册
- [ ] 测试用户登录
- [ ] 检查数据库连接
- [ ] 查看构建日志确认无错误

## 🔗 获取环境变量

### Supabase 密钥

1. 访问: https://app.supabase.com
2. 选择您的项目
3. Settings → API
4. 复制：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### JWT Secret

在终端执行：
```bash
openssl rand -base64 32
```

或：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🆘 需要帮助？

如果遇到问题，查看：
- 详细部署指南: `DEPLOYMENT_GUIDE.md`
- 环境变量配置: `VERCEL_ENV_VARS.md`
- 快速部署: `QUICK_DEPLOY.md`

