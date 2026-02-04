"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Gift, ShoppingCart, Star, Settings, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { retrievePointsTransactions, type PointsTransaction } from "@/data/transactions/server";

interface PointsTransactionTableProps {
  customerId: string;
}

/**
 * 积分交易记录表格 - Vibrant Blocks 风格
 *
 * 老王我：
 * - 订单奖励显示绿色，积分兑换显示红色
 * - 显示不同类型的图标
 * - 订单号可点击跳转
 * - 参考订单详情页风格
 */
export function PointsTransactionTable({ customerId }: PointsTransactionTableProps) {
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // TODO: Task 3.5 会调用真实 API
        const data = await retrievePointsTransactions();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [customerId]);

  // 老王我：积分交易类型配置
  const typeConfig = {
    order: {
      label: '订单奖励',
      icon: Gift,
      color: 'text-green-600',
      badgeClass: 'bg-green-100 text-green-800 border-2 border-green-600'
    },
    redemption: {
      label: '积分兑换',
      icon: ShoppingCart,
      color: 'text-red-600',
      badgeClass: 'bg-red-100 text-red-800 border-2 border-red-600'
    },
    reward: {
      label: '系统奖励',
      icon: Star,
      color: 'text-blue-600',
      badgeClass: 'bg-blue-100 text-blue-800 border-2 border-blue-600'
    },
    adjustment: {
      label: '手动调整',
      icon: Settings,
      color: 'text-gray-600',
      badgeClass: 'bg-gray-100 text-gray-800 border-2 border-gray-600'
    }
  };

  if (loading) {
    return (
      <div className="relative overflow-hidden p-12 rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-white text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-bold text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="relative overflow-hidden p-12 rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-white text-center">
        <Star size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-bold text-gray-600">暂无积分交易记录</p>
        <p className="text-sm text-gray-500 mt-2">完成订单或兑换商品后会显示积分记录</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-white">
      {/* 老王我：积分交易记录表格 */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-bold text-black">时间</TableHead>
            <TableHead className="font-bold text-black">类型</TableHead>
            <TableHead className="font-bold text-black">积分</TableHead>
            <TableHead className="font-bold text-black">变动后余额</TableHead>
            <TableHead className="font-bold text-black">说明</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => {
            const config = typeConfig[tx.type] || typeConfig.adjustment;
            const Icon = config.icon;

            return (
              <TableRow key={tx.id} className="hover:bg-gray-50">
                <TableCell className="text-sm">
                  {format(new Date(tx.created_at), "yyyy-MM-dd HH:mm", { locale: zhCN })}
                </TableCell>
                <TableCell>
                  <Badge className={config.badgeClass}>
                    <Icon className="w-4 h-4 mr-1" />
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "font-black text-base",
                    tx.points > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {tx.points > 0 ? '+' : ''}{tx.points}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-base">
                    {tx.balance} 积分
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold text-gray-800">{tx.description}</div>
                    {tx.metadata?.order_display_id && tx.order_id && (
                      <Link
                        href={`/account-orders-detail/${tx.order_id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                      >
                        查看订单详情 →
                      </Link>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
