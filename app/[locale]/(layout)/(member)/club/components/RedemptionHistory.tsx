"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle, Package } from "lucide-react";
import type { RedemptionRecord } from "@/data/points-products";
import { getRedemptionRecords } from "@/data/points-products";

/**
 * 兑换记录组件
 *
 * 老王我这个SB组件负责：
 * 1. 展示用户的兑换记录
 * 2. 显示不同状态的记录
 * 3. 处理空状态和加载状态
 */

export default function RedemptionHistory() {
  const [records, setRecords] = useState<RedemptionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // 老王我：状态映射
  const STATUS_INFO = {
    pending: {
      icon: Clock,
      label: "待处理",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    processing: {
      icon: Clock,
      label: "处理中",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
    completed: {
      icon: CheckCircle,
      label: "已完成",
      color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    cancelled: {
      icon: XCircle,
      label: "已取消",
      color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
    },
  };

  // 老王我：加载兑换记录
  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true);
      const data = await getRedemptionRecords(10);
      setRecords(data);
      setLoading(false);
    };

    loadRecords();
  }, []);

  // 老王我：加载状态
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] p-12 text-center">
        <div className="animate-pulse">
          <Package size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 老王我：空状态
  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] p-12 text-center">
        <Package size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-black dark:text-white mb-2">
          暂无兑换记录
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          快去兑换心仪的商品吧
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {records.map((record) => {
        const StatusIcon = STATUS_INFO[record.status].icon;
        const statusInfo = STATUS_INFO[record.status];

        return (
          <div
            key={record.id}
            className="rounded-xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818] p-4"
          >
            <div className="flex items-start justify-between">
              {/* 左侧：商品信息 */}
              <div className="flex-1">
                <h4 className="font-medium text-black dark:text-white text-sm mb-1">
                  {record.product_name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <span>消耗积分: {record.points_spent.toLocaleString()}</span>
                  <span>•</span>
                  <span>
                    {new Date(record.created_at).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              {/* 右侧：状态标签 */}
              <span
                className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  flex items-center gap-1 flex-shrink-0
                  ${statusInfo.color}
                `}
              >
                <StatusIcon size={12} />
                {statusInfo.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
