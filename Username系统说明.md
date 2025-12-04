# Username 系统说明

## 🎯 解决的问题

之前如果两个用户的 `name` 相同，会导致数据混乱。现在使用 `username` 作为唯一标识符，`name` 作为可选的显示名称。

## 📋 系统设计

### Username（用户名）
- **唯一标识符**：每个用户必须有一个唯一的 `username`
- **不可重复**：系统会自动检测并阻止重复的 `username`
- **不可更改**：注册后 `username` 不能修改
- **格式要求**：3-20 个字符，只能包含小写字母、数字和下划线
- **用于数据关联**：所有用户数据都通过 `username` 关联

### Name（显示名称）
- **可选字段**：用户可以设置，也可以不设置
- **可以重复**：多个用户可以有相同的 `name`
- **可以更改**：在个人资料页面可以随时修改
- **显示优先级**：如果有 `name`，优先显示 `name`；如果没有，显示 `username`

## 🔧 功能实现

### 1. 注册流程
- ✅ 用户必须输入 `username`
- ✅ 系统自动检测 `username` 是否可用
- ✅ 实时显示 `username` 可用性状态
- ✅ 不需要输入 `name`（可选，可在注册后设置）

### 2. 个人资料页面
- ✅ 显示当前 `username`（只读）
- ✅ 可以编辑 `name`（显示名称）
- ✅ 如果设置了 `name`，显示 `name`；否则显示 `username`
- ✅ 显示 `@username` 标识

### 3. 物品显示
- ✅ 创建物品时，自动使用用户的显示名称（`name` 或 `username`）
- ✅ 物品详情页面显示所有者头像和名称
- ✅ 如果用户更新了 `name`，新创建的物品会使用新名称

## 📝 数据库迁移

### 步骤 1: 执行 SQL 迁移

在 Supabase SQL Editor 中执行 `supabase_add_username.sql`：

```sql
-- 添加 username 列
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;

-- 创建唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 为现有用户生成 username
UPDATE users 
SET username = LOWER(REGEXP_REPLACE(COALESCE(name, 'user_' || id), '[^a-z0-9_]', '_', 'g'))
WHERE username IS NULL OR username = '';

-- 处理重复的 username（添加数字后缀）
-- ...（详见 supabase_add_username.sql）
```

### 步骤 2: 验证迁移

1. 在 Supabase Dashboard → Table Editor → `users` 表
2. 确认所有用户都有 `username` 列
3. 确认 `username` 列有唯一索引

## ✅ 使用说明

### 注册新用户
1. 访问注册页面
2. **输入 username**（必填）
   - 3-20 个字符
   - 只能包含小写字母、数字和下划线
   - 系统会自动检测是否可用
3. 输入邮箱和密码
4. 完成注册

### 设置显示名称
1. 登录后，进入个人资料页面
2. 在 "Display Name" 部分点击 "Edit"
3. 输入显示名称（可选，留空则使用 `username`）
4. 点击 "Save" 保存

### 查看用户信息
- **个人资料页面**：显示 `name`（如果有）或 `username`，以及 `@username`
- **物品详情页面**：显示所有者的显示名称和头像
- **导航栏**：显示用户的显示名称

## 🔍 显示逻辑

系统使用 `getDisplayName()` 函数来决定显示什么：

```typescript
function getDisplayName(user: { name?: string; username: string }): string {
  return user.name?.trim() || user.username;
}
```

**规则**：
1. 如果用户有 `name` 且不为空，显示 `name`
2. 如果用户没有 `name` 或 `name` 为空，显示 `username`

## ⚠️ 注意事项

1. **现有用户**
   - 迁移脚本会自动为现有用户生成 `username`
   - 基于 `name` 或 `id` 生成
   - 如果有重复，会自动添加数字后缀

2. **向后兼容**
   - 代码支持旧数据（没有 `username` 的用户）
   - 会自动生成 `username` 作为回退

3. **数据安全**
   - `username` 用于数据关联，不会暴露敏感信息
   - `name` 可以随时更改，不影响数据关联

4. **物品显示**
   - 创建物品时，`ownerName` 存储的是创建时的显示名称
   - 如果用户后来更改了 `name`，已创建的物品不会自动更新
   - 新创建的物品会使用最新的显示名称

## 🐛 常见问题

### 1. "Username already taken" 错误

**原因**：选择的 `username` 已被使用

**解决**：选择另一个 `username`

### 2. "Username must be 3-20 characters" 错误

**原因**：`username` 不符合格式要求

**解决**：
- 确保长度在 3-20 字符之间
- 只使用小写字母、数字和下划线
- 不能包含空格或特殊字符

### 3. 现有用户没有 `username`

**原因**：迁移脚本未执行或执行失败

**解决**：
1. 检查数据库是否有 `username` 列
2. 执行迁移 SQL
3. 验证所有用户都有 `username`

## 📚 相关文件

- `lib/db.ts` - User 接口和 `getDisplayName()` 函数
- `app/api/auth/check-username/route.ts` - 检查 username 可用性
- `app/api/auth/register/route.ts` - 注册 API（要求 username）
- `app/profile/page.tsx` - 个人资料页面（可编辑 name）
- `supabase_add_username.sql` - 数据库迁移 SQL

---

**重要**：执行数据库迁移后，所有功能才能正常工作！

