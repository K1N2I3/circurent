-- 添加 username 列到 users 表
-- 在 Supabase SQL Editor 中执行此脚本

-- 添加 username 列（如果不存在）
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;

-- 创建唯一索引确保 username 唯一
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 为现有用户生成 username（基于 name 或 id）
-- 如果 name 存在，使用 name 的小写版本作为 username
-- 如果 name 不存在，使用 'user_' + id 作为 username
UPDATE users 
SET username = LOWER(REGEXP_REPLACE(COALESCE(name, 'user_' || id), '[^a-z0-9_]', '_', 'g'))
WHERE username IS NULL OR username = '';

-- 确保所有用户都有唯一的 username
-- 如果有重复，添加数字后缀
DO $$
DECLARE
  user_record RECORD;
  counter INTEGER;
  new_username TEXT;
BEGIN
  FOR user_record IN SELECT id, username FROM users WHERE username IS NOT NULL LOOP
    counter := 1;
    new_username := user_record.username;
    
    WHILE EXISTS (SELECT 1 FROM users WHERE username = new_username AND id != user_record.id) LOOP
      new_username := user_record.username || '_' || counter;
      counter := counter + 1;
    END LOOP;
    
    IF new_username != user_record.username THEN
      UPDATE users SET username = new_username WHERE id = user_record.id;
    END IF;
  END LOOP;
END $$;

-- 注意：
-- 1. 现有用户的 username 会自动生成
-- 2. name 字段现在是可选的（可以为 NULL）
-- 3. 新用户注册时必须提供 username
-- 4. username 必须唯一，不能重复

