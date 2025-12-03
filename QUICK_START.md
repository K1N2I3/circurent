# 🚀 快速开始指南

## 您现在在 Supabase Dashboard 中，按照以下步骤操作：

### 📍 步骤 1: 找到 SQL Editor（创建表）

1. **在左侧边栏**，找到并点击 **"SQL Editor"** 图标（看起来像 `</>` 或代码符号）
2. 点击后，在页面顶部会看到 **"New query"** 按钮
3. 点击 **"New query"** 创建一个新的 SQL 查询

### 📍 步骤 2: 执行 SQL 创建表

在 SQL Editor 中，**复制并粘贴**以下 SQL 代码：

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

4. 点击右下角的 **"Run"** 按钮（或按 `Ctrl+Enter` / `Cmd+Enter`）
5. 等待执行完成，应该会看到 "Success" 消息

### 📍 步骤 3: 验证表已创建

1. 在左侧边栏，点击 **"Table Editor"** 图标（表格图标）
2. 您应该能看到三个表：
   - `users`
   - `items`
   - `rentals`

### 📍 步骤 4: 获取 API 密钥

1. 在左侧边栏，点击 **"Settings"** 图标（齿轮图标 ⚙️）
2. 在设置菜单中，点击 **"API"**
3. 您会看到以下信息：
   - **Project URL**: `https://xxxxx.supabase.co` ← 复制这个
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ← 复制这个
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ← 复制这个（**保密！**）

### 📍 步骤 5: 配置环境变量

1. 回到您的项目文件夹
2. 打开或创建 `.env.local` 文件
3. 添加以下内容（替换为您刚才复制的值）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 📍 步骤 6: 测试

1. 在项目文件夹中运行：
   ```bash
   npm run dev
   ```

2. 访问 http://localhost:3000

3. 系统会自动：
   - 检测 Supabase 配置
   - 初始化商品数据到数据库

## 🎯 关键位置总结

- **SQL Editor**: 左侧边栏 → SQL Editor 图标
- **Table Editor**: 左侧边栏 → Table Editor 图标（查看表）
- **API 密钥**: 左侧边栏 → Settings → API

## ❓ 遇到问题？

如果遇到任何问题，请告诉我！

