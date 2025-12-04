-- 添加 avatar_url 列到 users 表
-- 在 Supabase SQL Editor 中执行此脚本

-- 添加 avatar_url 列（如果不存在）
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 注意：现有用户的 avatar_url 将为 NULL，这是正常的
-- 系统会自动使用用户名字首字母作为默认头像

