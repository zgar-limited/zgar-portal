"use client";

import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useTaskProgress } from "@/hooks/useTaskProgress";

/**
 * 任务进度指示器组件
 *
 * 这个SB组件显示任务进度，用于页面浏览任务等场景
 *
 * @example
 * ```tsx
 * // 基础使用
 * <TaskProgressIndicator
 *   taskCode="view_product_15s"
 *   target={15}
 *   label="浏览商品"
 * />
 *
 * // 自定义上报间隔和完成提示
 * <TaskProgressIndicator
 *   taskCode="read_article_30s"
 *   target={30}
 *   reportInterval={5}
 *   label="阅读文章"
 *   showReward={true}
 *   reward={50}
 *   onComplete={() => toast.success('任务完成！获得50积分')}
 * />
 * ```
 */
interface TaskProgressIndicatorProps {
  taskCode: string; // 任务代码
  target: number; // 目标值（秒）
  label?: string; // 标签文本，如"浏览商品"
  reportInterval?: number; // 上报间隔（秒），默认5秒
  showReward?: boolean; // 是否显示奖励信息
  reward?: number; // 奖励积分
  onComplete?: (progress: number) => void; // 完成回调
  className?: string; // 自定义类名
  variant?: "default" | "compact"; // 显示样式
}

export default function TaskProgressIndicator({
  taskCode,
  target,
  label = "浏览页面",
  reportInterval = 5,
  showReward = false,
  reward = 0,
  onComplete,
  className = "",
  variant = "default",
}: TaskProgressIndicatorProps) {
  const { progress, percentage, isCompleted, isReporting } = useTaskProgress({
    taskCode,
    target,
    reportInterval,
    onComplete,
  });

  // 紧凑样式（用于空间有限的场景）
  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        {isCompleted ? (
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
            <CheckCircle2 size={16} />
            <span className="font-medium">已完成</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Clock size={16} className={isReporting ? "animate-pulse" : ""} />
            <span className="font-medium">{progress}s</span>
            <span className="text-gray-400">/</span>
            <span>{target}s</span>
            {isReporting && <Loader2 size={14} className="animate-spin" />}
          </div>
        )}
      </div>
    );
  }

  // 默认样式
  return (
    <div
      className={`
        rounded-xl border bg-white dark:bg-[#191818] p-4
        ${isCompleted
          ? "border-green-200 dark:border-green-900/30"
          : "border-[#ededed] dark:border-[#ffffff1a]"
        }
        ${className}
      `}
    >
      {/* 标题和进度 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <CheckCircle2
              size={18}
              className="text-green-600 dark:text-green-400"
            />
          ) : (
            <Clock
              size={18}
              className={`text-gray-600 dark:text-gray-400 ${
                isReporting ? "animate-pulse" : ""
              }`}
            />
          )}
          <span className="font-medium text-black dark:text-white text-sm">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-black dark:text-white font-medium">
            {progress}s / {target}s
          </span>
          {isReporting && !isCompleted && (
            <Loader2 size={14} className="animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* 进度条 */}
      <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 mb-3">
        <div
          className={`
            h-2 rounded-full transition-all duration-500
            ${
              isCompleted
                ? "bg-green-600 dark:bg-green-400"
                : "bg-black dark:bg-white"
            }
          `}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* 完成状态和奖励 */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {isCompleted ? (
            <span className="text-green-600 dark:text-green-400 font-medium">
              ✓ 任务完成！
            </span>
          ) : (
            <span>完成度：{percentage}%</span>
          )}
        </div>

        {showReward && reward > 0 && (
          <div className="text-xs font-medium">
            {isCompleted ? (
              <span className="text-green-600 dark:text-green-400">
                +{reward} 积分
              </span>
            ) : (
              <span className="text-gray-600 dark:text-gray-400">
                奖励：{reward} 积分
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
