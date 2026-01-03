"use server";

import { revalidateTag } from "next/cache";
import { getLocale } from "next-intl/server";

import { getAuthHeaders } from "@/utils/cookies";
import { medusaSDK } from "@/utils/medusa";
import { getMedusaHeaders } from "@/utils/medusa-server";

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

/**
 * 上报任务进度
 *
 * 这个SB函数调用 /store/task/report-progress 上报任务进度
 * 用于浏览页面、点击按钮等需要持续上报进度的场景
 *
 * 使用场景：
 * - 用户浏览页面，每5秒上报一次浏览时长
 * - 用户点击按钮，上报点击次数
 * - 用户观看视频，上报观看进度
 *
 * 防作弊机制：
 * - 后端有最小上报间隔限制（3秒）
 * - 单次上报最大3600秒（1小时）
 *
 * @param taskCode - 任务代码
 * @param incrementValue - 递增值（秒），默认1秒
 * @returns 上报结果
 */
export const reportTaskProgress = async (
  taskCode: string,
  incrementValue: number = 1
): Promise<ReportProgressResponse> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return {
      success: false,
      message: "Unauthorized",
      task: {
        task_code: taskCode,
        progress: 0,
        target: 0,
        status: "locked",
        completed: false,
      },
    };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client
    .fetch<ReportProgressResponse>(`/store/tasks/${taskCode}/progress`, {
      // 老王我：RESTful路径，taskCode在URL里
      method: "POST",
      body: {
        increment_value: incrementValue,
      },
      headers,
    })
    .then((response) => {
      // 老王我刷新缓存，让任务列表更新
      revalidateTag("tasks");
      return response;
    })
    .catch((error: any) => {
      console.error("Failed to report task progress:", error);
      return {
        success: false,
        message: error.message || "上报进度失败",
        task: {
          task_code: taskCode,
          progress: 0,
          target: 0,
          status: "locked",
          completed: false,
        },
        error: error.message,
      };
    });
};

/**
 * 获取任务列表
 *
 * 这个SB函数调用 GET /store/tasks 获取用户的任务列表（RESTful风格）
 * 支持按 group 和 status 筛选
 *
 * @param group - 任务分组（可选）
 * @param status - 任务状态（可选）
 * @returns 任务列表响应
 */
export const getTasks = async (
  group?: TaskGroup,
  status?: TaskStatus
): Promise<TaskListResponse> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return { tasks: [], count: 0 };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  const query: Record<string, string> = {};
  if (group) query.group = group;
  if (status) query.status = status;

  return await medusaSDK.client
    .fetch<TaskListResponse>(`/store/tasks`, {
      // 老王我：RESTful路径
      method: "GET",
      query,
      headers,
    })
    .then((response) => response)
    .catch((error) => {
      console.error("Failed to fetch tasks:", error);
      return { tasks: [], count: 0 };
    });
};

/**
 * 每日签到
 *
 * 这个SB接口调用 POST /store/tasks/daily-checkin 完成每日签到
 * 如果是首次签到，完成任务并自动领取奖励（RESTful风格）
 *
 * @returns 签到结果
 */
export const dailyCheckin = async (): Promise<DailyCheckinResponse> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client
    .fetch<DailyCheckinResponse>(`/store/tasks/daily-checkin`, {
      // 老王我：RESTful路径
      method: "POST",
      headers,
    })
    .then((response) => {
      // 老王我刷新缓存，让任务列表更新
      revalidateTag("tasks");
      return response;
    })
    .catch((error: any) => {
      console.error("Failed to daily checkin:", error);
      return {
        success: false,
        message: error.message || "签到失败",
      };
    });
};

/**
 * 领取任务奖励
 *
 * 这个SB函数调用 POST /store/tasks/:taskCode/claim 领取任务积分奖励（RESTful风格）
 * 只有状态为 completed 且未领取的任务才能调用
 *
 * @param taskCode - 任务代码
 * @returns 领取结果
 */
export const claimTaskReward = async (
  taskCode: string
): Promise<ClaimRewardResponse> => {
  const authHeaders = await getAuthHeaders();

  if (!authHeaders) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const locale = await getLocale();
  const headers = getMedusaHeaders(locale, authHeaders);

  return await medusaSDK.client
    .fetch<ClaimRewardResponse>(`/store/tasks/${taskCode}/claim`, {
      // 老王我：RESTful路径，taskCode在URL里
      method: "POST",
      headers,
    })
    .then((response) => {
      // 老王我刷新缓存，让任务列表更新
      revalidateTag("tasks");
      return response;
    })
    .catch((error: any) => {
      console.error("Failed to claim task reward:", error);
      return {
        success: false,
        message: error.message || "领取奖励失败",
        error: error.message,
      };
    });
};
