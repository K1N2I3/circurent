# Supabase 地址字段迁移指南

## 📋 概述

我们已经将地址存储格式从简单的字符串改为结构化的 JSON 对象，包含以下字段：
- `street`: 街道地址
- `city`: 城市
- `state`: 省/州
- `postalCode`: 邮政编码
- `country`: 国家代码

## 🔄 数据库迁移

### 选项 1: 保持现有表结构（推荐）

Supabase 的 `address` 字段已经是 `TEXT` 类型，可以存储 JSON 字符串。**无需修改表结构**，代码会自动处理 JSON 序列化/反序列化。

### 选项 2: 如果需要更严格的类型检查

如果您想将 `address` 字段改为 `JSONB` 类型以获得更好的查询性能，可以执行以下 SQL：

```sql
-- 将 address 字段从 TEXT 改为 JSONB
ALTER TABLE users 
ALTER COLUMN address TYPE JSONB USING 
  CASE 
    WHEN address IS NULL THEN NULL
    WHEN address::text = '' THEN NULL
    ELSE 
      CASE 
        WHEN address::text ~ '^\{.*\}$' THEN address::jsonb  -- 已经是 JSON
        ELSE NULL  -- 旧格式字符串，设为 NULL（需要用户重新填写）
      END
  END;
```

**注意**: 这个迁移会将旧的字符串格式地址设为 NULL，用户需要重新填写地址。

## ✅ 当前实现

代码已经支持：
1. ✅ 新格式：存储为 JSON 字符串
2. ✅ 旧格式兼容：如果遇到旧格式字符串，会优雅处理
3. ✅ 自动转换：读取时自动解析 JSON，写入时自动序列化

## 📝 验证迁移

### 检查现有数据

```sql
-- 查看地址字段的格式
SELECT 
  id, 
  email, 
  address,
  CASE 
    WHEN address IS NULL THEN 'NULL'
    WHEN address::text ~ '^\{.*\}$' THEN 'JSON'
    ELSE 'STRING (old format)'
  END as address_type
FROM users
LIMIT 10;
```

### 测试新注册

1. 注册一个新用户
2. 填写完整的地址信息
3. 检查数据库中的 `address` 字段应该是 JSON 格式：
```json
{"street":"Via Roma 123","city":"Milano","state":"Lombardia","postalCode":"20100","country":"IT"}
```

## 🎯 完成

迁移完成后，所有新注册的用户将使用新的结构化地址格式，而旧用户的数据仍然可以正常显示（如果是字符串格式）。

