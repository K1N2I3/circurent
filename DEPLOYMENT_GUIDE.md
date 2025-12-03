# 🚀 部署指南 - Vercel + GitHub

本指南将帮助您将 CircuRent 项目部署到 Vercel 和 GitHub。

## 📋 部署前准备

### 1. 确保所有功能正常工作

- ✅ 本地测试通过
- ✅ 数据库已配置（Supabase）
- ✅ 环境变量已准备好

### 2. 检查 Git 状态

```bash
# 检查当前状态
git status

# 确保 .env.local 不会被提交（已在 .gitignore 中）
```

## 🔵 步骤 1: 创建 GitHub 仓库

### 方法 A: 使用 GitHub CLI（推荐）

```bash
# 安装 GitHub CLI（如果还没有）
# macOS: brew install gh
# 然后登录: gh auth login

# 创建仓库并推送
gh repo create circurent --public --source=. --remote=origin --push
```

### 方法 B: 使用 GitHub 网页

1. **访问 GitHub**: https://github.com/new
2. **创建新仓库**:
   - Repository name: `circurent` (或您喜欢的名称)
   - Description: `Rental platform built with Next.js`
   - 选择 Public 或 Private
   - **不要**初始化 README、.gitignore 或 license（我们已经有了）
3. **点击 "Create repository"**

4. **在本地项目目录执行**:

```bash
# 如果还没有初始化 Git
git init

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/circurent.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: CircuRent rental platform"

# 推送到 GitHub
git branch -M main
git push -u origin main
```

## 🟢 步骤 2: 部署到 Vercel

### 方法 A: 通过 Vercel Dashboard（推荐）

1. **访问 Vercel**: https://vercel.com
2. **登录/注册**（可以使用 GitHub 账号登录）
3. **点击 "Add New Project"**
4. **导入 GitHub 仓库**:
   - 选择您刚创建的 `circurent` 仓库
   - 点击 "Import"
5. **配置项目**:
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install`（默认）
6. **配置环境变量**（重要！）:
   
   点击 "Environment Variables" 并添加以下变量：

   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # JWT
   JWT_SECRET=your_jwt_secret
   
   # Resend (Email)
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=CircuRent <noreply@yourdomain.com>
   
   # Google Maps (可选)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

7. **点击 "Deploy"**

### 方法 B: 使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 按照提示操作：
# - Set up and deploy? Yes
# - Which scope? 选择您的账号
# - Link to existing project? No
# - Project name? circurent
# - Directory? ./
# - Override settings? No

# 部署到生产环境
vercel --prod
```

## 🔐 步骤 3: 配置环境变量

### 在 Vercel Dashboard 中配置

1. **进入项目设置**: 项目 → Settings → Environment Variables
2. **添加所有环境变量**（见上面的列表）
3. **为每个变量选择环境**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development（如果需要）

### 重要环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥 | ✅ |
| `JWT_SECRET` | JWT 密钥（用于认证） | ✅ |
| `RESEND_API_KEY` | Resend API 密钥 | ✅ |
| `RESEND_FROM_EMAIL` | 发送邮箱地址 | ✅ |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API 密钥 | ⚠️ 可选 |

## 🔄 步骤 4: 自动部署设置

### 启用自动部署

Vercel 默认会：
- ✅ 每次推送到 `main` 分支自动部署到生产环境
- ✅ 每次创建 Pull Request 自动创建预览部署

### 自定义部署设置（可选）

在项目根目录创建 `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## ✅ 步骤 5: 验证部署

### 检查部署状态

1. **访问 Vercel Dashboard**: https://vercel.com/dashboard
2. **查看部署日志**:
   - 点击项目
   - 查看 "Deployments"
   - 检查构建日志是否有错误

### 测试功能

部署完成后，访问您的 Vercel URL（例如：`https://circurent.vercel.app`）并测试：

- ✅ 首页加载
- ✅ 用户注册
- ✅ 用户登录
- ✅ 浏览商品
- ✅ 创建租赁
- ✅ 支付流程

## 🐛 常见问题

### 问题 1: 构建失败

**错误**: `Module not found` 或 `Cannot find module`

**解决**:
- 检查 `package.json` 中所有依赖都已安装
- 确保没有使用本地路径导入
- 检查 `node_modules` 是否在 `.gitignore` 中

### 问题 2: 环境变量未生效

**错误**: API 调用失败，返回 401 或 500

**解决**:
- 检查 Vercel Dashboard 中的环境变量是否正确配置
- 确保变量名完全匹配（区分大小写）
- 重新部署项目（环境变量更改后需要重新部署）

### 问题 3: 数据库连接失败

**错误**: Supabase 连接错误

**解决**:
- 检查 Supabase 项目是否正常运行
- 验证 API 密钥是否正确
- 检查 Supabase 项目的网络设置（允许来自 Vercel 的请求）

### 问题 4: 邮件发送失败

**错误**: Resend API 返回 403

**解决**:
- 确保已验证域名（见 `RESEND_DOMAIN_SETUP.md`）
- 检查 `RESEND_FROM_EMAIL` 是否使用已验证的域名
- 验证 API 密钥权限

## 📝 部署后检查清单

- [ ] GitHub 仓库已创建并推送代码
- [ ] Vercel 项目已创建并连接 GitHub
- [ ] 所有环境变量已配置
- [ ] 构建成功完成
- [ ] 生产环境 URL 可访问
- [ ] 所有功能测试通过
- [ ] 数据库连接正常
- [ ] 邮件发送功能正常（或使用 fallback 模式）

## 🔗 有用的链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub**: https://github.com
- **Supabase Dashboard**: https://app.supabase.com
- **Resend Dashboard**: https://resend.com

## 🎉 完成！

部署完成后，您的应用将在 Vercel 上运行，并且每次推送到 GitHub 都会自动部署。

**生产环境 URL**: `https://your-project-name.vercel.app`

---

**提示**: 记得更新您的域名 DNS 设置（如果使用自定义域名）！

