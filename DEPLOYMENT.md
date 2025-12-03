# 部署指南 (Deployment Guide)

## ⚠️ 重要提示：当前数据存储方式

**当前系统使用文件系统（JSON文件）存储数据，这在某些部署平台上会有问题：**

### 问题说明

1. **Vercel/Netlify 等无服务器平台**：
   - ❌ 文件系统是**只读**的（除了 `/tmp`）
   - ❌ 每次部署都会**重置文件系统**
   - ❌ 用户数据、商品数据、租赁记录**不会持久化**
   - ❌ 数据会在每次部署后丢失

2. **传统服务器（VPS/云服务器）**：
   - ✅ 可以使用文件系统
   - ⚠️ 需要确保 `data/` 目录有写权限
   - ⚠️ 需要定期备份数据

## 🚀 解决方案

### 方案 1：使用数据库（推荐）

为了在部署后正常使用，**强烈建议使用数据库**。以下是推荐的数据库选项：

#### 选项 A：Supabase（推荐 - 最简单）
- **免费额度**：500MB 数据库，2GB 带宽
- **优点**：PostgreSQL 数据库，自动备份，实时功能
- **设置时间**：5-10 分钟
- **网站**：https://supabase.com

#### 选项 B：PlanetScale（MySQL）
- **免费额度**：5GB 存储，10亿行读取/月
- **优点**：无服务器 MySQL，自动扩展
- **设置时间**：10-15 分钟
- **网站**：https://planetscale.com

#### 选项 C：MongoDB Atlas（NoSQL）
- **免费额度**：512MB 存储
- **优点**：灵活的文档数据库
- **设置时间**：10-15 分钟
- **网站**：https://www.mongodb.com/cloud/atlas

#### 选项 D：Railway / Render（全栈托管）
- **优点**：提供数据库 + 应用托管
- **适合**：想要一站式解决方案
- **网站**：
  - Railway: https://railway.app
  - Render: https://render.com

### 方案 2：使用 Vercel KV / Upstash（键值存储）
- **适合**：简单的数据存储
- **免费额度**：10,000 请求/天
- **网站**：https://upstash.com

### 方案 3：继续使用文件系统（仅限传统服务器）

如果部署到传统服务器（VPS、云服务器等），可以继续使用文件系统：

1. 确保 `data/` 目录有写权限：
   ```bash
   chmod 755 data/
   ```

2. 设置定期备份：
   ```bash
   # 使用 cron 定期备份
   0 2 * * * cp -r /path/to/app/data /path/to/backup/data-$(date +\%Y\%m\%d)
   ```

## 📋 部署前检查清单

### 必需的环境变量

创建 `.env.local` 文件（**不要提交到 Git**）：

```env
# JWT 密钥（用于用户认证）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Maps API（用于地址自动补全）
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# 邮件服务（选择一种）
# Resend（推荐）
RESEND_API_KEY=re_xxxxxxxxxxxxx
# 或 SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# 或 SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 部署平台配置

#### Vercel 部署

1. **安装 Vercel CLI**：
   ```bash
   npm i -g vercel
   ```

2. **部署**：
   ```bash
   vercel
   ```

3. **设置环境变量**：
   - 在 Vercel Dashboard → Project → Settings → Environment Variables
   - 添加所有必需的环境变量

4. **⚠️ 重要**：需要迁移到数据库（见下方）

#### Netlify 部署

1. **安装 Netlify CLI**：
   ```bash
   npm i -g netlify-cli
   ```

2. **部署**：
   ```bash
   netlify deploy --prod
   ```

3. **设置环境变量**：
   - 在 Netlify Dashboard → Site settings → Environment variables

4. **⚠️ 重要**：需要迁移到数据库

#### Railway 部署（推荐 - 支持文件系统）

1. **连接 GitHub 仓库**
2. **Railway 会自动检测 Next.js**
3. **设置环境变量**
4. **✅ 可以使用文件系统**（但建议使用数据库）

## 🔄 迁移到数据库（推荐）

### 使用 Supabase（最简单）

1. **创建 Supabase 项目**：
   - 访问 https://supabase.com
   - 创建新项目
   - 获取连接字符串

2. **安装依赖**：
   ```bash
   npm install @supabase/supabase-js
   ```

3. **创建数据库表**：
   ```sql
   -- users 表
   CREATE TABLE users (
     id TEXT PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     name TEXT NOT NULL,
     address TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- items 表
   CREATE TABLE items (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT NOT NULL,
     category TEXT NOT NULL,
     price_per_day NUMERIC NOT NULL,
     image TEXT,
     image_url TEXT,
     available BOOLEAN DEFAULT true,
     location TEXT NOT NULL
   );

   -- rentals 表
   CREATE TABLE rentals (
     id TEXT PRIMARY KEY,
     user_id TEXT REFERENCES users(id),
     item_id TEXT REFERENCES items(id),
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     total_price NUMERIC NOT NULL,
     status TEXT NOT NULL,
     payment_method TEXT NOT NULL,
     payment_id TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **更新 `lib/db.ts`** 使用 Supabase 客户端

## 🛠️ 快速修复（临时方案）

如果暂时无法迁移到数据库，可以使用以下方案：

### 使用 Vercel KV（键值存储）

1. **安装**：
   ```bash
   npm install @vercel/kv
   ```

2. **在 Vercel 中启用 KV**
3. **修改 `lib/db.ts` 使用 KV 存储**

## 📝 当前状态

- ✅ **功能完整**：所有功能都已实现
- ⚠️ **数据持久化**：需要迁移到数据库才能在无服务器平台使用
- ✅ **环境变量**：已配置好，只需添加密钥
- ✅ **邮件服务**：已集成，需要配置 API 密钥
- ✅ **Google Maps**：已集成，需要配置 API 密钥

## 🎯 推荐部署流程

1. **选择数据库**（推荐 Supabase）
2. **迁移数据存储**到数据库
3. **配置环境变量**
4. **部署到平台**（Vercel/Netlify）
5. **测试所有功能**

## 💡 需要帮助？

如果需要我帮您：
- 迁移到 Supabase 数据库
- 设置其他数据库
- 配置部署环境

请告诉我，我可以帮您完成迁移！

