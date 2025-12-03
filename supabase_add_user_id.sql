-- 添加 user_id 列到 items 表
-- 在 Supabase SQL Editor 中执行此脚本

-- 添加 user_id 列（如果不存在）
ALTER TABLE items ADD COLUMN IF NOT EXISTS user_id TEXT;

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_items_user_id ON items(user_id);

-- 注意：现有商品（由 CircuRent 创建的）的 user_id 将为 NULL
-- 这是正常的，因为它们是系统默认商品

