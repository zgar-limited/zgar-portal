-- 老王我写的一个SB任务初始化脚本
-- 在你的数据库中执行这个SQL来创建测试任务

-- 插入每日签到任务
INSERT INTO task_template (name, code, description, "group", sort_order, task_type, points_reward, condition_config, is_daily, is_active)
VALUES
  ('每日签到', 'daily_checkin', '每天签到获得积分', 'daily', 1, 'event', 10, '{"event_name": "task.daily_checkin"}'::jsonb, true, true),

  -- 新手任务
  ('完成首次下单', 'first_order', '新用户首次下单完成', 'newbie', 1, 'counter', 100, '{"target": 1, "event_name": "order.placed"}'::jsonb, false, true),
  ('完善个人资料', 'complete_profile', '填写完整的个人信息', 'newbie', 2, 'manual', 50, '{"target": 1}'::jsonb, false, true),

  -- 成就任务
  ('累计下单10次', 'order_10_times', '累计完成10个订单', 'achievement', 1, 'counter', 200, '{"target": 10, "event_name": "order.placed"}'::jsonb, false, true),
  ('累计消费1000元', 'spend_1000', '累计消费满1000元', 'achievement', 2, 'counter', 500, '{"target": 1000, "event_name": "order.placed", "field": "total"}'::jsonb, false, true)

ON CONFLICT (code) DO NOTHING;

-- 查看插入的任务
SELECT code, name, "group", points_reward, is_active FROM task_template;
