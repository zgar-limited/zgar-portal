// 老王我：任务模块类型定义
// 创建时间：2026-02-02
// 作者：老王
// 说明：任务系统相关类型定义

/**
 * 任务类型定义（老王我根据后端API搞的类型）
 */
export type TaskGroup = "newbie" | "daily" | "achievement" | "campaign";

export type TaskStatus = "locked" | "active" | "completed" | "claimed" | "expired";

export type TaskType = "event" | "counter" | "time" | "manual";

export interface TaskTemplate {
  code: string;
  name: string;
  description: string | null;
  group: TaskGroup;
  icon_url: string | null; // 老王我添加：任务图标地址
  redirect_url: string | null; // 老王我添加：任务跳转链接
  points_reward: number;
  is_daily: boolean;
  task_type: TaskType;
  start_time: string | null;
  end_time: string | null;
}

export interface UserTask {
  progress: number;
  target: number;
  status: TaskStatus;
  is_claimed: boolean;
  completed_at: string | null;
}

export interface Task {
  template: TaskTemplate;
  user_task: UserTask;
  is_locked: boolean;
  can_claim: boolean;
}

export interface TaskListResponse {
  tasks: Task[];
  count: number;
}

export interface DailyCheckinResponse {
  success: boolean;
  message: string;
  points_awarded?: number;
  new_balance?: number;
  already_signed?: boolean;
  task_updated?: any;
}

export interface ClaimRewardResponse {
  success: boolean;
  points_awarded?: number;
  new_balance?: number;
  message: string;
  error?: string;
}

/**
 * 任务进度上报响应类型
 */
export interface ReportProgressResponse {
  success: boolean;
  message: string;
  task: {
    task_code: string;
    progress: number;
    target: number;
    status: TaskStatus;
    completed: boolean;
  };
  points_reward?: number;
  error?: string;
}
