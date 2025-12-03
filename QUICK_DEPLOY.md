# ⚡ 快速部署指南

## 🎯 5 分钟快速部署

### 步骤 1: 初始化 Git（如果还没有）

```bash
cd "/Users/ken.lin/Desktop/Alessandro Smit Project CircuRent"

# 初始化 Git
git init

# 添加所有文件
git add .

# 首次提交
git commit -m "Initial commit: CircuRent rental platform"
```

### 步骤 2: 创建 GitHub 仓库

#### 选项 A: 使用 GitHub CLI（最快）

```bash
# 安装 GitHub CLI（如果还没有）
# macOS: brew install gh

# 登录 GitHub
gh auth login

# 创建仓库并推送
gh repo create circurent --public --source=. --remote=origin --push
```

#### 选项 B: 使用网页

1. 访问: https://github.com/new
2. 仓库名: `circurent`
3. 选择 Public
4. **不要**勾选任何初始化选项
5. 点击 "Create repository"
6. 然后执行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/circurent.git
git branch -M main
git push -u origin main
```

### 步骤 3: 部署到 Vercel

1. **访问**: https://vercel.com
2. **登录**（使用 GitHub 账号）
3. **点击 "Add New Project"**
4. **选择 `circurent` 仓库**
5. **点击 "Import"**

### 步骤 4: 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

```env
# Supabase（必需）
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key

# JWT（必需）
JWT_SECRET=你的_jwt_secret（至少32个字符）

# Resend（必需）
RESEND_API_KEY=re_AcovjuaR_5JpoEbpeGfiDpGgQS6vDrLyg
RESEND_FROM_EMAIL=CircuRent <onboarding@resend.dev>
```

**注意**: 
- 每个变量都要添加到 **Production**、**Preview** 和 **Development** 环境
- 如果使用自己的域名，将 `RESEND_FROM_EMAIL` 改为已验证的域名邮箱

### 步骤 5: 部署

1. **点击 "Deploy"**
2. **等待构建完成**（约 2-3 分钟）
3. **访问您的应用**: `https://circurent.vercel.app`

## ✅ 部署后检查

- [ ] 访问生产 URL，页面正常加载
- [ ] 测试用户注册功能
- [ ] 测试用户登录功能
- [ ] 检查数据库连接（Supabase）
- [ ] 测试邮件发送（或检查控制台日志）

## 🔧 获取环境变量

### Supabase 密钥

1. 访问: https://app.supabase.com
2. 选择您的项目
3. Settings → API
4. 复制：
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### JWT Secret

生成一个安全的随机字符串：

```bash
# 方法 1: 使用 openssl
openssl rand -base64 32

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🐛 常见问题

### 构建失败？

- 检查环境变量是否全部配置
- 查看构建日志中的具体错误

### 数据库连接失败？

- 确认 Supabase 项目正常运行
- 检查 API 密钥是否正确
- 确认 Supabase 项目允许来自 Vercel 的请求

### 邮件发送失败？

- 当前使用 `onboarding@resend.dev` 只能发送到注册邮箱
- 要发送到所有邮箱，需要验证域名（见 `RESEND_DOMAIN_SETUP.md`）

## 📚 详细文档

- 完整部署指南: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- 数据库设置: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- 邮件设置: [RESEND_DOMAIN_SETUP.md](./RESEND_DOMAIN_SETUP.md)

## 🎉 完成！

部署完成后，每次推送到 GitHub 的 `main` 分支都会自动部署到 Vercel！

