# Supabase 数据库设置指南

## 第一步：创建 Supabase 项目

1. **访问 Supabase**：
   - 打开 https://supabase.com
   - 点击 "Start your project" 或 "Sign up"

2. **创建新项目**：
   - 点击 "New Project"
   - 填写项目信息：
     - **Name**: CircuRent（或您喜欢的名称）
     - **Database Password**: 设置一个强密码（**请保存好，稍后会用到**）
     - **Region**: 选择离您最近的区域（如 `Southeast Asia (Singapore)`）
   - 点击 "Create new project"
   - 等待 2-3 分钟让项目初始化完成

3. **获取 API 密钥**：
   - 项目创建完成后，点击左侧菜单的 "Settings"（设置图标）
   - 点击 "API"
   - 您会看到：
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`（**保密，不要暴露在前端**）

4. **复制这些信息**，稍后需要添加到环境变量中

## 第二步：创建数据库表

1. **打开 SQL Editor**：
   - 在 Supabase Dashboard 左侧菜单，点击 "SQL Editor"
   - 点击 "New query"

2. **执行以下 SQL 创建表**：

```sql
-- 创建 users 表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 items 表
CREATE TABLE IF NOT EXISTS items (
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

-- 创建 rentals 表
CREATE TABLE IF NOT EXISTS rentals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paypal', 'credit_card')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_item_id ON rentals(item_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_available ON items(available);
```

3. **点击 "Run" 执行 SQL**
4. **验证表已创建**：
   - 点击左侧菜单的 "Table Editor"
   - 您应该看到三个表：`users`, `items`, `rentals`

## 第三步：设置环境变量

1. **在项目根目录创建 `.env.local` 文件**（如果还没有）

2. **添加 Supabase 配置**：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 其他配置（如果还没有）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RESEND_API_KEY=your_resend_api_key
```

**重要**：
- 将 `xxxxx` 替换为您的实际 Supabase URL
- 将 `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` 替换为您的实际密钥
- **不要将 `.env.local` 提交到 Git**

## 第四步：安装依赖

运行以下命令安装 Supabase 客户端：

```bash
npm install @supabase/supabase-js
```

## 第五步：验证设置

完成以上步骤后，运行：

```bash
npm run dev
```

如果一切正常，应用应该可以正常启动。

## 故障排除

### 问题：无法连接到 Supabase
- 检查 `.env.local` 中的 URL 和密钥是否正确
- 确保 Supabase 项目状态是 "Active"

### 问题：表不存在
- 返回 Supabase Dashboard → SQL Editor
- 重新执行创建表的 SQL

### 问题：权限错误
- 检查是否使用了正确的密钥（前端使用 `anon key`，后端使用 `service_role key`）

## 下一步

完成以上步骤后，告诉我，我会帮您：
1. 更新代码以使用 Supabase
2. 迁移现有数据（如果有）
3. 测试所有功能

