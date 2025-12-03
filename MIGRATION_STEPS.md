# 数据库迁移步骤

## ✅ 已完成的工作

1. ✅ 创建了 Supabase 数据库适配器 (`lib/db-supabase.ts`)
2. ✅ 创建了 Supabase 客户端配置 (`lib/supabase.ts`)
3. ✅ 更新了 `lib/db.ts` 支持自动切换（Supabase 或文件系统）
4. ✅ 更新了所有 API 路由支持异步操作
5. ✅ 更新了 `initItems` 函数支持 Supabase
6. ✅ 安装了 `@supabase/supabase-js` 包

## 📋 接下来需要您完成的步骤

### 步骤 1: 创建 Supabase 项目

1. 访问 https://supabase.com
2. 注册/登录账户
3. 创建新项目
4. 获取 API 密钥（详见 `SUPABASE_SETUP.md`）

### 步骤 2: 创建数据库表

在 Supabase Dashboard → SQL Editor 中执行以下 SQL：

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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rentals_user_id ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_item_id ON rentals(item_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_available ON items(available);
```

### 步骤 3: 配置环境变量

在项目根目录创建或更新 `.env.local` 文件：

```env
# Supabase 配置（必需）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 其他配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RESEND_API_KEY=your_resend_api_key
```

### 步骤 4: 测试

1. 重启开发服务器：
   ```bash
   npm run dev
   ```

2. 访问应用，系统会自动：
   - 检测 Supabase 配置
   - 切换到 Supabase 数据库
   - 初始化商品数据（如果表为空）

3. 测试功能：
   - 注册新用户
   - 登录
   - 浏览商品
   - 创建租赁订单

## 🔄 自动切换机制

系统会自动检测环境变量：
- **如果设置了 `NEXT_PUBLIC_SUPABASE_URL`**：使用 Supabase 数据库
- **如果没有设置**：使用文件系统（开发模式）

## 📝 迁移现有数据（可选）

如果您有现有的 JSON 数据文件，可以运行迁移脚本（我会在下一步创建）。

## ⚠️ 注意事项

1. **不要删除** `data/` 目录，作为备份保留
2. **环境变量**不要提交到 Git
3. **Supabase Service Role Key** 保密，只在服务器端使用

## 🎉 完成！

完成以上步骤后，您的应用就可以在部署后正常使用了！

如果遇到任何问题，请告诉我。

