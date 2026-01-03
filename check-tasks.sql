-- 老王我写的SQL查询，检查任务配置
-- 在数据库中运行这个查询

SELECT
  code AS "任务代码",
  name AS "任务名称",
  icon_url AS "图标地址",
  redirect_url AS "跳转链接",
  "group" AS "分组",
  points_reward AS "积分奖励",
  is_active AS "是否启用"
FROM task_template
WHERE is_active = true
ORDER BY "group", sort_order;

-- 如果发现icon_url或redirect_url为空，可以用下面的SQL更新：

-- 示例1：为每日签到任务添加图标
UPDATE task_template
SET icon_url = 'https://cdn-icons-png.flaticon.com/512/864/864833.png' -- 日历图标
WHERE code = 'daily_checkin';

-- 示例2：为购物任务添加跳转链接
UPDATE task_template
SET redirect_url = '/shop'
WHERE code = 'visit_shop';

-- 示例3：同时添加图标和跳转
UPDATE task_template
SET
  icon_url = 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', -- 购物车图标
  redirect_url = '/shop'
WHERE code = 'first_order';
