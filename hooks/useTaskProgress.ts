"use client";

import { useEffect, useRef, useState } from "react";
import { reportTaskProgress } from "@/data/tasks";

/**
 * 任务进度上报Hook配置
 */
interface UseTaskProgressOptions {
  taskCode: string; // 任务代码
  target: number; // 目标值（秒）
  reportInterval?: number; // 上报间隔（秒），默认5秒
  autoReport?: boolean; // 是否自动上报，默认true
  onComplete?: (progress: number) => void; // 完成回调
}

/**
 * 任务进度返回值
 */
interface TaskProgressReturn {
  progress: number; // 当前进度（秒）
  percentage: number; // 完成百分比
  isCompleted: boolean; // 是否已完成
  isReporting: boolean; // 是否正在上报
  error: string | null; // 错误信息
  reportNow: () => Promise<void>; // 手动上报函数
}

/**
 * 任务进度上报Hook
 *
 * 这个SB Hook 用于处理任务进度自动上报，比如浏览页面15秒获得积分
 *
 * 使用场景：
 * - 用户浏览商品详情页，自动累计浏览时长
 * - 用户观看视频，自动上报观看进度
 * - 用户阅读文章，自动上报阅读时长
 *
 * 防作弊机制：
 * - 后端限制最小上报间隔3秒
 * - 单次上报最大3600秒（1小时）
 * - 页面切换时自动停止上报
 *
 * @example
 * ```tsx
 * // 在商品详情页使用
 * const { progress, percentage, isCompleted } = useTaskProgress({
 *   taskCode: 'view_product_15s',
 *   target: 15,
 *   reportInterval: 5,
 *   onComplete: (progress) => {
 *     toast.success(`任务完成！已浏览${progress}秒`);
 *   }
 * });
 *
 * return (
 *   <div>
 *     <p>浏览进度：{progress}秒 / {percentage}%</p>
 *     {isCompleted && <p>✅ 任务完成！</p>}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 手动控制上报
 * const { progress, reportNow } = useTaskProgress({
 *   taskCode: 'watch_video',
 *   target: 60,
 *   autoReport: false, // 关闭自动上报
 * });
 *
 * <button onClick={reportNow}>手动上报进度</button>
 * ```
 */
export const useTaskProgress = ({
  taskCode,
  target,
  reportInterval = 5,
  autoReport = true,
  onComplete,
}: UseTaskProgressOptions): TaskProgressReturn => {
  const [progress, setProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isReporting, setIsReporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const reportInProgressRef = useRef<boolean>(false);

  /**
   * 计算完成百分比
   */
  const percentage = Math.min(Math.round((progress / target) * 100), 100);

  /**
   * 手动上报函数
   * 老王我这个SB函数可以手动触发进度上报
   */
  const reportNow = async () => {
    // 老王我防止重复上报
    if (reportInProgressRef.current || isCompleted) {
      return;
    }

    setIsReporting(true);
    reportInProgressRef.current = true;
    setError(null);

    try {
      const result = await reportTaskProgress(taskCode, reportInterval);

      if (result.success) {
        setProgress(result.task.progress);
        setIsCompleted(result.task.completed);

        // 老王我：如果任务完成，调用回调函数
        if (result.task.completed && onComplete) {
          onComplete(result.task.progress);
        }
      } else {
        // 老王我处理错误（比如429限流）
        if (result.message?.includes("报告太频繁")) {
          // 静默处理，不显示错误
          console.warn("报告太频繁，已跳过本次上报");
        } else {
          setError(result.message || "上报失败");
        }
      }
    } catch (err: any) {
      console.error("上报任务进度失败:", err);
      setError(err.message || "上报失败");
    } finally {
      setIsReporting(false);
      reportInProgressRef.current = false;
    }
  };

  /**
   * 老王我：组件挂载时启动定时上报
   */
  useEffect(() => {
    if (!autoReport || isCompleted) {
      return;
    }

    // 老王我：立即上报一次初始进度
    reportNow();

    // 老王我：设置定时上报
    intervalRef.current = setInterval(() => {
      if (!isCompleted) {
        reportNow();
      }
    }, reportInterval * 1000);

    // 老王我：组件卸载时清理定时器
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [taskCode, target, reportInterval, autoReport, isCompleted]);

  /**
   * 老王我：页面隐藏时暂停上报，显示时恢复
   * 防止用户在后台继续累积浏览时长
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面隐藏时暂停
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // 页面显示时恢复
        if (autoReport && !isCompleted && !intervalRef.current) {
          intervalRef.current = setInterval(() => {
            if (!isCompleted) {
              reportNow();
            }
          }, reportInterval * 1000);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [autoReport, isCompleted, reportInterval]);

  return {
    progress,
    percentage,
    isCompleted,
    isReporting,
    error,
    reportNow,
  };
};
