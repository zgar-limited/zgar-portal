"use client";

import { useState } from "react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import {
  Star,
  Calendar,
  Trophy,
  Gift,
  CheckCircle,
  Lock,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { dailyCheckin, claimTaskReward } from "@/data/tasks";
import type {
  Task,
  TaskGroup,
} from "@/data/tasks";

/**
 * 任务分组图标映射
 * 老王我用这个SB映射显示不同任务类型的图标
 */
const TASK_GROUP_ICONS: Record<TaskGroup, React.ElementType> = {
  newbie: Trophy,      // 新手任务
  daily: Calendar,     // 日常任务
  achievement: Star,   // 成就任务
  campaign: Gift,      // 活动任务
};

/**
 * 任务分组名称映射（中文）
 */
const TASK_GROUP_NAMES: Record<TaskGroup, string> = {
  newbie: "新手任务",
  daily: "日常任务",
  achievement: "成就任务",
  campaign: "活动任务",
};

/**
 * 任务状态名称映射（中文）
 */
const TASK_STATUS_NAMES: Record<string, string> = {
  locked: "已锁定",
  active: "进行中",
  completed: "已完成",
  claimed: "已领取",
  expired: "已过期",
};

interface TasksProps {
  initialTasks: Task[];
  onPointsUpdate?: (newPoints: number) => void;
}

/**
 * 任务列表组件
 *
 * 这个SB组件展示用户的任务列表，支持每日签到和领取奖励
 */
export default function Tasks({
  initialTasks,
  onPointsUpdate,
}: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [loading, setLoading] = useState<string | null>(null); // 正在操作的任务代码
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 按任务分组
  const groupedTasks = tasks.reduce((acc, task) => {
    const group = task.template.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(task);
    return acc;
  }, {} as Record<TaskGroup, Task[]>);

  /**
   * 每日签到处理
   * 老王我这个SB函数处理每日签到任务
   */
  const handleDailyCheckin = async () => {
    setLoading("daily_checkin");
    setMessage(null);

    try {
      const result = await dailyCheckin();

      if (result.success) {
        // 更新任务状态
        setTasks((prev) =>
          prev.map((task) =>
            task.template.code === "daily_checkin"
              ? {
                  ...task,
                  user_task: {
                    ...task.user_task,
                    status: "claimed",
                    is_claimed: true,
                  },
                  can_claim: false,
                }
              : task
          )
        );

        setMessage({
          type: "success",
          text: result.message || "签到成功！",
        });

        // 更新积分
        if (result.points_awarded && onPointsUpdate) {
          onPointsUpdate(result.points_awarded);
        }
      } else {
        setMessage({
          type: "error",
          text: result.message || "签到失败",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "签到失败，请重试",
      });
    } finally {
      setLoading(null);
    }
  };

  /**
   * 领取任务奖励
   * 老王我这个SB函数处理任务奖励领取
   */
  const handleClaimReward = async (taskCode: string) => {
    setLoading(taskCode);
    setMessage(null);

    try {
      const result = await claimTaskReward(taskCode);

      if (result.success) {
        // 更新任务状态
        setTasks((prev) =>
          prev.map((task) =>
            task.template.code === taskCode
              ? {
                  ...task,
                  user_task: {
                    ...task.user_task,
                    status: "claimed",
                    is_claimed: true,
                  },
                  can_claim: false,
                }
              : task
          )
        );

        setMessage({
          type: "success",
          text: result.message || "领取成功！",
        });

        // 更新积分
        if (result.points_awarded && onPointsUpdate) {
          onPointsUpdate(result.points_awarded);
        }
      } else {
        setMessage({
          type: "error",
          text: result.message || "领取失败",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "领取失败，请重试",
      });
    } finally {
      setLoading(null);
    }
  };

  /**
   * 渲染单个任务卡片
   * 老王我这个SB函数渲染任务卡片，支持图标显示和跳转
   */
  const renderTaskCard = (task: Task, key?: string) => {
    const GroupIcon = TASK_GROUP_ICONS[task.template.group];
    const isDailyCheckin = task.template.code === "daily_checkin";
    const progress = task.user_task.target > 0
      ? (task.user_task.progress / task.user_task.target) * 100
      : 0;

    // 老王我添加：判断是否可以点击跳转
    const canNavigate = task.template.redirect_url && !task.is_locked;

    // 老王我添加：任务卡片容器，如果是可跳转的则包装成链接
    const cardContent = (
      <>
        {/* 老王我添加：跳转提示图标（右下角） */}
        {canNavigate && (
          <div className="absolute bottom-4 right-4 z-10">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <ChevronRight size={18} className="text-white dark:text-black" />
            </div>
          </div>
        )}

        {/* 任务标题和奖励 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            {/* 任务图标 */}
            <div
              className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden relative
                ${task.is_locked
                  ? "bg-gray-200 dark:bg-gray-700"
                  : task.user_task.status === "claimed"
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-black/5 dark:bg-white/10"
                }
              `}
            >
              {task.template.icon_url ? (
                // 老王我添加：如果有自定义图标，显示自定义图标
                <Image
                  src={task.template.icon_url}
                  alt={task.template.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : task.is_locked ? (
                <Lock size={18} className="text-gray-400 dark:text-gray-500" />
              ) : task.user_task.status === "claimed" ? (
                <CheckCircle size={18} className="text-green-600 dark:text-green-400" />
              ) : (
                <GroupIcon size={18} className="text-black dark:text-white" />
              )}
            </div>

            {/* 任务信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-black dark:text-white text-sm">
                  {task.template.name}
                </h4>
              </div>
              {task.template.description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {task.template.description}
                </p>
              )}

              {/* 任务状态标签 */}
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${
                      task.user_task.status === "claimed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : task.user_task.status === "completed"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : task.user_task.status === "active"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                    }
                  `}
                >
                  {TASK_STATUS_NAMES[task.user_task.status] || task.user_task.status}
                </span>

                {/* 每日任务标记 */}
                {task.template.is_daily && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    每日
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 积分奖励 */}
          <div className="text-right flex-shrink-0 ml-3">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-black dark:text-white">
                +{task.template.points_reward}
              </span>
            </div>
            {task.template.is_daily && task.user_task.completed_at && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                今日已完成
              </p>
            )}
          </div>
        </div>

        {/* 进度条（非每日签到任务，且非 duration 类型任务） */}
        {!isDailyCheckin && task.template.task_type !== "duration" && task.user_task.target > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                进度
              </span>
              <span className="text-xs text-black dark:text-white font-medium">
                {task.user_task.progress} / {task.user_task.target}
              </span>
            </div>
            <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5">
              <div
                className={`
                  h-1.5 rounded-full transition-all duration-500
                  ${
                    task.user_task.status === "claimed"
                      ? "bg-green-600 dark:bg-green-400"
                      : "bg-black dark:bg-white"
                  }
                `}
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex items-center justify-between mt-3 pr-12"> {/* 老王我添加：右侧padding为跳转图标留空间 */}
          {task.is_locked ? (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              完成前置任务后解锁
            </p>
          ) : isDailyCheckin ? (
            // 每日签到按钮
            task.user_task.status === "claimed" ? (
              <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <CheckCircle size={14} />
                今日已签到
              </p>
            ) : (
              <button
                onClick={handleDailyCheckin}
                disabled={loading === "daily_checkin"}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    loading === "daily_checkin"
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
                  }
                `}
              >
                {loading === "daily_checkin" ? "签到中..." : "立即签到"}
              </button>
            )
          ) : task.can_claim ? (
            // 领取奖励按钮
            <button
              onClick={() => handleClaimReward(task.template.code)}
              disabled={loading === task.template.code}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  loading === task.template.code
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                }
              `}
            >
              {loading === task.template.code ? "领取中..." : "领取奖励"}
            </button>
          ) : task.user_task.status === "claimed" ? (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <CheckCircle size={14} />
              已领取
            </p>
          ) : task.user_task.status === "completed" ? (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              等待领取
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              进行中...
            </p>
          )}
        </div>
      </>
    );

    // 老王我添加：如果有跳转链接且未锁定，用 Link 包装整个卡片
    if (canNavigate) {
      return (
        <Link
          key={key || task.template.code}
          href={task.template.redirect_url!}
          className={`
            relative block p-4 rounded-xl border transition-all
            ${task.is_locked
              ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60"
              : "border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] hover:border-black/20 dark:hover:border-white/20"
            }
          `}
        >
          {cardContent}
        </Link>
      );
    }

    // 老王我添加：否则用普通 div 包装
    return (
      <div
        key={key || task.template.code}
        className={`
          relative p-4 rounded-xl border transition-all
          ${task.is_locked
            ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 opacity-60"
            : "border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] hover:border-black/20 dark:hover:border-white/20"
          }
        `}
      >
        {cardContent}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 消息提示 */}
      {message && (
        <div
          className={`
            p-4 rounded-xl text-sm font-medium
            ${
              message.type === "success"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }
          `}
        >
          {message.text}
        </div>
      )}

      {/* 任务分组列表 */}
      {Object.entries(groupedTasks).map(([group, groupTasks]) => {
        const groupKey = group as TaskGroup;
        const GroupIcon = TASK_GROUP_ICONS[groupKey];

        return (
          <div
            key={groupKey}
            className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818]"
          >
            {/* 分组标题 */}
            <div className="p-4 border-b border-[#ededed] dark:border-[#ffffff1a]">
              <div className="flex items-center gap-2">
                <GroupIcon size={18} className="text-black dark:text-white" />
                <h3 className="font-bold text-black dark:text-white">
                  {TASK_GROUP_NAMES[groupKey]}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  ({groupTasks.length})
                </span>
              </div>
            </div>

            {/* 任务列表 */}
            <div className="p-4 space-y-3">
              {groupTasks.map((task) => renderTaskCard(task, task.template.code))}
            </div>
          </div>
        );
      })}

      {/* 无任务提示 */}
      {tasks.length === 0 && (
        <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] p-12 text-center">
          <Trophy size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-black dark:text-white mb-2">
            暂无任务
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            敬请期待更多精彩任务
          </p>
        </div>
      )}
    </div>
  );
}
