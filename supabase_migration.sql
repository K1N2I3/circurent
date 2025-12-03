-- 迁移脚本：将 location 改为 owner_name
-- 在 Supabase SQL Editor 中执行此脚本

-- 步骤 1: 添加新列 owner_name（如果不存在）
ALTER TABLE items ADD COLUMN IF NOT EXISTS owner_name TEXT;

-- 步骤 2: 将所有现有商品的 owner_name 设置为 'CircuRent'
UPDATE items SET owner_name = 'CircuRent' WHERE owner_name IS NULL;

-- 步骤 3: 验证数据（可选，查看结果）
-- SELECT id, name, location, owner_name FROM items LIMIT 10;

-- 步骤 4: 删除旧列 location（可选，如果确定不再需要）
-- 注意：先确认 owner_name 数据正确后再执行此步骤
-- ALTER TABLE items DROP COLUMN location;

