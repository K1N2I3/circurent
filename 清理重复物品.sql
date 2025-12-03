-- 清理重复物品的 SQL 脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 方法 1: 删除完全重复的记录（保留第一个）
-- 注意：这会删除所有重复项，只保留每个唯一 ID 的第一条记录
DELETE FROM items
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY name, description, category, price_per_day, user_id
             ORDER BY id
           ) AS row_num
    FROM items
    WHERE user_id IS NOT NULL  -- 只处理用户创建的物品
  ) t
  WHERE t.row_num > 1
);

-- 方法 2: 如果方法 1 不够精确，可以手动检查重复项
-- 先查看哪些物品是重复的：
-- SELECT 
--   name, 
--   description, 
--   category, 
--   price_per_day, 
--   user_id,
--   COUNT(*) as count
-- FROM items
-- WHERE user_id IS NOT NULL
-- GROUP BY name, description, category, price_per_day, user_id
-- HAVING COUNT(*) > 1;

-- 方法 3: 如果重复项有相同的 ID（不应该发生，但以防万一）
-- 删除重复的 ID，只保留第一个：
-- DELETE FROM items
-- WHERE id IN (
--   SELECT id
--   FROM (
--     SELECT id,
--            ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) AS row_num
--     FROM items
--   ) t
--   WHERE t.row_num > 1
-- );

-- 验证：查看清理后的结果
-- SELECT 
--   id, 
--   name, 
--   user_id, 
--   created_at
-- FROM items
-- WHERE user_id IS NOT NULL
-- ORDER BY user_id, name;

