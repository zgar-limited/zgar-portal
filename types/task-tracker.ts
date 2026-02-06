/**
 * 任务追踪器相关类型定义
 *
 * 老王我定义了全局任务追踪系统的所有类型
 */

/**
 * 任务追踪器配置接口
 */
export interface TaskTrackerConfig {
  taskCode: string; // 任务代码
  target: number; // 目标值（秒）
  reward: number; // 奖励积分
  onComplete?: (progress: number) => void; // 完成回调函数
}

/**
 * 任务追踪器状态接口
 */
export interface TaskTrackerState {
  progress: number; // 当前进度
  isCompleted: boolean; // 是否已完成
  isRunning: boolean; // 是否正在运行
}

/**
 * 页面匹配规则类型
 */
export type PageMatchRule = 'exact' | 'prefix' | 'pattern' | 'multi';

/**
 * 页面匹配结果接口
 */
export interface PageMatchResult {
  matched: boolean; // 是否匹配
  rule?: PageMatchRule; // 使用的匹配规则
}

/**
 * 全局任务管理器配置
 */
export interface GlobalTaskManagerOptions {
  defaultReportInterval?: number; // 默认上报间隔（秒）
  enableCache?: boolean; // 是否启用任务列表缓存
  cacheDuration?: number; // 缓存时长（毫秒）
}
