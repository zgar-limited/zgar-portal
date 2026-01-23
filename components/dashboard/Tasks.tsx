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
  Sparkles,
  Clock,
} from "lucide-react";
import { dailyCheckin, claimTaskReward } from "@/data/tasks";
import type {
  Task,
  TaskGroup,
} from "@/data/tasks";

/**
 * 任务分组图标映射
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
 * 任务分组颜色映射 - Vibrant Blocks 风格
 */
const TASK_GROUP_COLORS: Record<TaskGroup, { bg: string; accent: string }> = {
  newbie: { bg: '#FF71CE', accent: '#01CDFE' },      // 粉色 + 蓝色
  daily: { bg: '#01CDFE', accent: '#FF71CE' },       // 蓝色 + 粉色
  achievement: { bg: '#FFFB00', accent: '#FF71CE' }, // 黄色 + 粉色
  campaign: { bg: '#FF6B35', accent: '#FFFB00' },    // 橙色 + 黄色（活动特殊）
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
 * 任务列表组件 - Vibrant Blocks 重新设计
 *
 * 老王我完全重构：网格布局 + 大卡片 + 立体效果
 */
export default function Tasks({
  initialTasks,
  onPointsUpdate,
}: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(Array.isArray(initialTasks) ? initialTasks : []);
  const [loading, setLoading] = useState<string | null>(null);
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
   */
  const handleDailyCheckin = async () => {
    setLoading("daily_checkin");
    setMessage(null);

    try {
      const result = await dailyCheckin();

      if (result.success) {
        // 老王我：刷新任务列表
        const updatedTasks = tasks.map(task => {
          if (task.template.code === "daily_checkin" && result.task_updated) {
            return { ...task, ...result.task_updated };
          }
          return task;
        });
        setTasks(updatedTasks);

        // 老王我：通知父组件更新积分
        if (result.points_awarded && onPointsUpdate) {
          onPointsUpdate(result.new_balance || 0);
        }

        setMessage({
          type: "success",
          text: result.already_signed
            ? "今天已经签到过了哦~"
            : `签到成功！获得 ${result.points_awarded} 积分`,
        });
      } else {
        setMessage({
          type: "error",
          text: result.message,
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "签到失败，请稍后重试",
      });
    } finally {
      setLoading(null);
    }
  };

  /**
   * 领取任务奖励
   */
  const handleClaimReward = async (taskCode: string) => {
    setLoading(taskCode);
    setMessage(null);

    try {
      const result = await claimTaskReward(taskCode);

      if (result.success) {
        // 老王我：更新任务状态
        const updatedTasks = tasks.map(task => {
          if (task.template.code === taskCode) {
            return {
              ...task,
              user_task: {
                ...task.user_task,
                status: "claimed",
                is_claimed: true,
              },
              can_claim: false,
            };
          }
          return task;
        });
        setTasks(updatedTasks);

        // 老王我：通知父组件更新积分
        if (result.points_awarded && onPointsUpdate) {
          onPointsUpdate(result.new_balance || 0);
        }

        setMessage({
          type: "success",
          text: `领取成功！获得 ${result.points_awarded} 积分 🎉`,
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || result.error || "领取失败",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "领取失败，请稍后重试",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* 老王我：全局提示消息 */}
      {message && (
        <div
          className={`relative overflow-hidden p-4 rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] ${
            message.type === "success" ? "bg-[#00FF87]" : "bg-[#FF6B6B]"
          }`}
        >
          <p className="text-sm font-black text-gray-900 text-center">
            {message.text}
          </p>
          <button
            onClick={() => setMessage(null)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* 老王我：任务分组列表 */}
      {Object.entries(groupedTasks).map(([groupKey, groupTasks]) => {
        const GroupIcon = TASK_GROUP_ICONS[groupKey as TaskGroup];
        const colors = TASK_GROUP_COLORS[groupKey as TaskGroup];
        const isCampaign = groupKey === 'campaign';

        return (
          <div key={groupKey} className="space-y-4">
            {/* 分组标题 - Vibrant Blocks 风格 */}
            <div className="relative overflow-hidden px-6 py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000000]" style={{ backgroundColor: colors.bg }}>
              {/* 几何装饰 */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-black opacity-10 rounded-full"></div>
              <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-white opacity-20"
                   style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)", transform: "rotate(-30deg)" }}>
              </div>

              {/* 活动任务特殊装饰 */}
              {isCampaign && (
                <>
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black rounded-lg">
                    <Clock size={12} className="text-[#FFFB00]" />
                    <span className="text-xs font-bold text-[#FFFB00]">限时</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-2 opacity-30"
                       style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 12px)' }}>
                  </div>
                </>
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* 图标盒子 */}
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center shadow-[3px_3px_0_0_#FFFFFF]">
                    <GroupIcon size={20} className="text-white" />
                  </div>
                  {/* 标题 */}
                  <h2 className="text-xl md:text-2xl font-black text-white" style={{
                    fontFamily: 'sans-serif',
                    textShadow: '2px_2px_0_#000000'
                  }}>
                    {TASK_GROUP_NAMES[groupKey as TaskGroup]}
                  </h2>
                </div>
                {/* 任务数量 */}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[3px_3px_0_0_#000000]">
                  <span className="text-base font-black" style={{ color: colors.bg }}>
                    {groupTasks.length}
                  </span>
                </div>
              </div>
            </div>

            {/* 任务网格 - 响应式布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupTasks.map((task) => (
                <TaskCard
                  key={task.template.code}
                  task={task}
                  loading={loading}
                  onDailyCheckin={handleDailyCheckin}
                  onClaimReward={handleClaimReward}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* 无任务提示 */}
      {tasks.length === 0 && (
        <div className="relative overflow-hidden text-center p-16 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000000] bg-white">
          {/* 几何装饰 */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#FF71CE] opacity-10 rounded-full"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-black opacity-5"
               style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}>
          </div>

          <div className="relative z-10">
            <div
              className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#f0f0f0] rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000]"
            >
              <Trophy size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-3" style={{ fontFamily: 'sans-serif' }}>
              暂无任务
            </h3>
            <p className="text-gray-600">
              敬请期待更多精彩任务
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 任务卡片组件 - Vibrant Blocks 风格
 */
interface TaskCardProps {
  task: Task;
  loading: string | null;
  onDailyCheckin: () => void;
  onClaimReward: (taskCode: string) => void;
}

function TaskCard({ task, loading, onDailyCheckin, onClaimReward }: TaskCardProps) {
  const GroupIcon = TASK_GROUP_ICONS[task.template.group];
  const isDailyCheckin = task.template.code === "daily_checkin";
  const colors = TASK_GROUP_COLORS[task.template.group];
  const progress = task.user_task.target > 0
    ? (task.user_task.progress / task.user_task.target) * 100
    : 0;
  const canNavigate = task.template.redirect_url && !task.is_locked;

  // 老王我：任务卡片内容
  const cardContent = (
    <div className="relative overflow-hidden p-5 h-full flex flex-col">
      {/* 几何装饰 */}
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-black opacity-5 rounded-full"></div>
      <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-white opacity-10"
           style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}>
      </div>

      {/* 锁定状态遮罩 */}
      {task.is_locked && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-center justify-center rounded-2xl">
          <Lock size={32} className="text-white" />
        </div>
      )}

      {/* 跳转提示（右上角） */}
      {canNavigate && (
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 flex items-center justify-center bg-black rounded-lg shadow-[2px_2px_0_0_#FFFFFF]">
            <ChevronRight size={18} className="text-white" />
          </div>
        </div>
      )}

      {/* 任务头部 */}
      <div className="relative z-10 flex items-start gap-3 mb-4">
        {/* 任务图标 */}
        <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-[3px_3px_0_0_#FFFFFF] flex-shrink-0">
          <GroupIcon size={24} className="text-white" />
        </div>

        {/* 任务标题和奖励 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black text-gray-900 mb-1 truncate" style={{ fontFamily: 'sans-serif' }}>
            {task.template.name}
          </h3>
          {task.template.description && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.template.description}
            </p>
          )}
        </div>

        {/* 积分奖励 */}
        <div className="flex-shrink-0">
          <div className="px-2 py-1 bg-[#FFFB00] border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000000]">
            <span className="text-xs font-black text-gray-900">
              +{task.template.points_reward}
            </span>
          </div>
        </div>
      </div>

      {/* 进度条（非签到任务） */}
      {!isDailyCheckin && task.user_task.target > 0 && (
        <div className="relative z-10 mb-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-gray-700">
              进度: {task.user_task.progress}/{task.user_task.target}
            </span>
            <span className="font-bold" style={{ color: colors.bg }}>
              {Math.round(progress)}%
            </span>
          </div>
          {/* 进度条背景 */}
          <div className="h-3 bg-gray-200 rounded-full border-2 border-black overflow-hidden">
            {/* 进度条填充 */}
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                backgroundColor: colors.bg
              }}
            >
              {/* 立体效果装饰 */}
              <div className="h-full w-full"
                   style={{
                     background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
                   }}>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 任务状态标签 */}
      <div className="relative z-10 mb-4">
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-black font-bold text-xs ${
          task.user_task.status === 'completed' || task.user_task.status === 'claimed'
            ? 'bg-[#00FF87] text-gray-900'
            : task.user_task.status === 'active'
            ? 'bg-[#01CDFE] text-white'
            : task.user_task.status === 'locked'
            ? 'bg-gray-300 text-gray-700'
            : 'bg-gray-200 text-gray-700'
        }`}>
          {TASK_STATUS_NAMES[task.user_task.status] || task.user_task.status}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="relative z-10 mt-auto">
        {isDailyCheckin ? (
          // 每日签到按钮
          <button
            onClick={onDailyCheckin}
            disabled={loading === "daily_checkin" || task.user_task.status === 'claimed'}
            className="w-full py-3 px-4 rounded-xl border-4 border-black font-black text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.bg,
              boxShadow: '6px_6px_0_0_#000000'
            }}
          >
            {loading === "daily_checkin" ? "签到中..." : task.user_task.status === 'claimed' ? "今日已签到" : "每日签到"}
          </button>
        ) : task.can_claim ? (
          // 领取奖励按钮
          <button
            onClick={() => onClaimReward(task.template.code)}
            disabled={loading === task.template.code}
            className="w-full py-3 px-4 rounded-xl border-4 border-black font-black text-white transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000000] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.bg,
              boxShadow: '6px_6px_0_0_#000000'
            }}
          >
            {loading === task.template.code ? "领取中..." : "领取奖励"}
          </button>
        ) : canNavigate ? (
          // 前往任务按钮
          <Link
            href={task.template.redirect_url}
            className="block w-full py-3 px-4 rounded-xl border-4 border-black font-black text-white text-center transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[4px_4px_0_0_#000000]"
            style={{
              backgroundColor: colors.accent,
              boxShadow: '6px_6px_0_0_#000000'
            }}
          >
            前往完成
          </Link>
        ) : (
          // 查看详情按钮（锁定或无法跳转）
          <button
            disabled
            className="w-full py-3 px-4 rounded-xl border-4 border-black font-bold text-gray-500 text-center cursor-not-allowed bg-gray-100"
            style={{
              boxShadow: '6px_6px_0_0_#000000'
            }}
          >
            {task.is_locked ? "任务锁定" : "查看详情"}
          </button>
        )}
      </div>
    </div>
  );

  // 老王我：根据任务状态决定卡片样式
  if (task.is_locked) {
    // 锁定状态：灰色卡片
    return (
      <div className="relative overflow-hidden rounded-2xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-gray-100">
        {cardContent}
      </div>
    );
  }

  // 普通状态：白色卡片
  return (
    <Link
      href={canNavigate ? task.template.redirect_url! : '#'}
      className={`
        relative overflow-hidden block rounded-2xl border-4 border-black shadow-[6px_6px_0_0_#000000]
        bg-white transition-all duration-200
        ${canNavigate ? 'hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#000000]' : ''}
      `}
      onClick={(e) => {
        if (!canNavigate) e.preventDefault();
      }}
    >
      {cardContent}
    </Link>
  );
}
