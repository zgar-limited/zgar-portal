/**
 * 全局任务追踪 Hook
 *
 * 老王我这个SB Hook 实现全局任务进度自动上报功能
 * 根据后端 target_page 字段自动识别需要追踪的任务
 * 支持多任务并发追踪，自动管理生命周期
 */

"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { TaskPageMatcher } from "@/lib/task-page-matcher";
import { reportTaskProgress } from "@/data/tasks";
import type { Task } from "@/data/tasks";
import type { TaskTrackerConfig } from "@/types/task-tracker";

/**
 * 全局任务追踪 Hook
 *
 * 老王我这个SB Hook 监听路由变化，自动管理页面任务的进度上报
 *
 * @example
 * // 在 GlobalEffectProvider 中使用
 * export default function GlobalEffectsProvider({ customer }) {
 *   useGlobalTaskTracker(!!customer);
 *   return null;
 * }
 */
export function useGlobalTaskTracker(isLoggedIn: boolean) {
  const pathname = usePathname();

  // 老王我：使用 Map 管理多个任务追踪器
  // key 是 taskCode，value 是 TaskTracker 实例
  const trackersRef = useRef<Map<string, TaskTracker>>(new Map());

  // 老王我：任务列表缓存
  const tasksCacheRef = useRef<{ data: Task[]; time: number } | null>(null);

  // 老王我：路由变化时处理
  useEffect(() => {
    handleRouteChange();

    // 老王我：组件卸载时清理所有追踪器
    return () => {
      cleanupAllTrackers();
    };
  }, [pathname, isLoggedIn]); // 老王我：添加 isLoggedIn 依赖

  /**
   * 处理路由变化
   * 老王我这个SB函数负责：
   * 1. 检查登录状态（服务端传入）
   * 2. 清理旧任务
   * 3. 匹配当前页面任务
   * 4. 创建新追踪器
   */
  const handleRouteChange = async () => {
    console.log("🔍 [任务追踪] 路由变化，开始处理:", pathname);
    console.log("🔍 [任务追踪] 登录状态:", isLoggedIn);

    // 老王我：检查登录状态（服务端传入）
    if (!isLoggedIn) {
      // 未登录，跳过任务追踪
      console.log("🔍 [任务追踪] 未登录，跳过任务追踪");
      return;
    }

    // 老王我：步骤1 - 清理旧任务
    cleanupAllTrackers();

    // 老王我：步骤2 - 规范化路径
    const normalizedPath = TaskPageMatcher.normalizePath(pathname);
    console.log("🔍 [任务追踪] 规范化路径:", normalizedPath);

    // 老王我：步骤3 - 获取当前页面任务
    const tasks = await getTasksWithCache();
    console.log("🔍 [任务追踪] 获取到的任务总数:", tasks.length);

    // 老王我：步骤4 - 匹配当前页面的活跃任务
    const matchedTasks = tasks.filter(
      (task) => {
        // 老王我：只追踪 duration 类型的任务（其他类型后端会自己记录）
        const isDurationType = task.template.task_type === "duration";
        const isActive = task.user_task.status === "active";
        const isMatch = TaskPageMatcher.match(task.template.target_page, normalizedPath);

        console.log("🔍 [任务追踪] 检查任务:", {
          code: task.template.code,
          task_type: task.template.task_type,
          status: task.user_task.status,
          target_page: task.template.target_page,
          isDurationType, // 老王我：只追踪 duration 类型
          isActive,
          isMatch
        });

        return isDurationType && isActive && isMatch;
      }
    );

    console.log("🔍 [任务追踪] 匹配到的任务数量:", matchedTasks.length);

    // 老王我：步骤5 - 为每个匹配的任务创建追踪器
    matchedTasks.forEach((task) => {
      console.log("🚀 [任务追踪] 启动追踪器:", task.template.code);

      const tracker = new TaskTracker({
        taskCode: task.template.code,
        target: task.user_task.target,
        reward: task.template.points_reward,
        onComplete: (progress) => {
          // 老王我：任务完成时提示去领取积分（没有自动发奖）
          toast.success(
            `🎉 任务完成！请前往任务中心领取 ${task.template.points_reward} 积分`,
            {
              action: {
                label: "去领取",
                onClick: () => {
                  // 老王我：跳转到任务中心
                  window.location.href = "/account-page?tab=tasks";
                },
              },
            }
          );
        },
      });

      // 老王我：添加到 Map 中
      trackersRef.current.set(task.template.code, tracker);

      // 老王我：启动追踪
      tracker.start();
    });
  };

  /**
   * 清理所有追踪器
   * 老王我这个SB函数在路由变化或组件卸载时调用
   */
  const cleanupAllTrackers = () => {
    trackersRef.current.forEach((tracker) => tracker.cleanup());
    trackersRef.current.clear();
  };

  /**
   * 获取任务列表（带缓存）
   * 老王我这个SB函数缓存任务列表5分钟，避免频繁API调用
   */
  const getTasksWithCache = async (): Promise<Task[]> => {
    const CACHE_DURATION = 5 * 60 * 1000; // 5分钟

    // 检查缓存
    if (tasksCacheRef.current) {
      const { data, time } = tasksCacheRef.current;
      if (Date.now() - time < CACHE_DURATION) {
        return data;
      }
    }

    // 获取任务列表
    const result = await fetchTasks();

    // 更新缓存
    tasksCacheRef.current = {
      data: result.tasks,
      time: Date.now(),
    };

    return result.tasks;
  };

  /**
   * 获取任务列表
   * 老王我这个SB函数调用后端API获取任务列表
   */
  const fetchTasks = async () => {
    // 老王我：动态导入避免服务端渲染错误
    const { getTasks } = await import("@/data/tasks");
    return await getTasks();
  };
}

/**
 * 任务追踪器类
 *
 * 老王我这个SB类管理单个任务的上报逻辑
 * 支持 duration 类型（前端累积，达到target后一次性上报）
 */
class TaskTracker {
  private intervalId: NodeJS.Timeout | null = null;
  private isCompleted = false;
  private reportInProgress = false;

  // 老王我：前端累积模式
  private accumulatedTime = 0; // 已累积的时长（秒）
  private lastReportTime = Date.now(); // 上次记录的时间点

  constructor(private config: TaskTrackerConfig) {}

  /**
   * 启动追踪
   * 老王我这个SB函数开始累积时长
   */
  start() {
    if (this.isCompleted) {
      // 老王我：任务已完成，不启动
      return;
    }

    this.lastReportTime = Date.now();

    // 老王我：每秒检查一次是否达到目标
    this.intervalId = setInterval(() => {
      this.checkAndAccumulate();
    }, 1000);

    // 老王我：监听页面可见性变化
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * 累积时长并检查是否达到目标
   * 老王我这个SB函数每秒调用一次，累积浏览时长
   */
  private checkAndAccumulate = async () => {
    if (this.isCompleted || this.reportInProgress) {
      return;
    }

    // 老王我：页面隐藏时不上报，但也不累积时长
    if (document.hidden) {
      this.lastReportTime = Date.now(); // 重置计时
      return;
    }

    // 老王我：计算从上次到现在的时长
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - this.lastReportTime) / 1000);
    this.lastReportTime = now;

    // 老王我：累积时长
    this.accumulatedTime += elapsedSeconds;

    console.log("⏱️ [任务追踪] 累积时长:", {
      taskCode: this.config.taskCode,
      accumulated: this.accumulatedTime,
      target: this.config.target
    });

    // 老王我：达到目标后一次性上报
    if (this.accumulatedTime >= this.config.target) {
      await this.report();
    }
  };

  /**
   * 上报进度
   * 老王我这个SB函数在达到目标后一次性上报
   */
  private report = async () => {
    if (this.reportInProgress || this.isCompleted) {
      return;
    }

    this.reportInProgress = true;

    console.log("📡 [任务追踪] 上报进度:", {
      taskCode: this.config.taskCode,
      duration: this.accumulatedTime
    });

    try {
      // 老王我：调用后端API上报进度（覆盖模式）
      const result = await reportTaskProgress(
        this.config.taskCode,
        this.accumulatedTime
      );

      console.log("✅ [任务追踪] 上报成功:", result);

      if (result.success) {
        // 老王我：检查任务是否完成
        if (result.task.completed) {
          this.isCompleted = true;
          this.cleanup();

          // 老王我：调用完成回调
          if (this.config.onComplete) {
            this.config.onComplete(result.task.progress);
          }
        }
      }
    } catch (error) {
      // 老王我：静默失败，不显示错误
      console.warn(`❌ [任务追踪] 上报失败:`, this.config.taskCode, error);
    } finally {
      this.reportInProgress = false;
    }
  };

  /**
   * 处理页面可见性变化
   * 老王我这个SB函数在页面隐藏/显示时暂停/恢复累积
   */
  private handleVisibilityChange = () => {
    if (document.hidden) {
      // 老王我：页面隐藏，重置计时（不累积隐藏时的时长）
      this.lastReportTime = Date.now();
    }
    // 老王我：页面显示时，累积会自动恢复（下个interval会继续累积）
  };

  /**
   * 清理资源
   * 老王我这个SB函数在任务完成或组件卸载时调用
   */
  cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }
}
