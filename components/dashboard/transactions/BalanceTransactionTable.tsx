"use client";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpCircle, ArrowDownCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// 老王我：类型定义（从 server.ts 复制，避免导入 server-only 模块）
export interface BalanceTransaction {
  id: string;
  amount: number;
  balance: number;
  type: string;
  description: string;
  created_at: string;
  metadata?: {
    order_display_id?: string;
    audit_amount?: number;
    audit_by_name?: string;
    jdc_bill_no?: string;
  };
  order_id?: string;
}

interface BalanceTransactionTableProps {
  transactions: BalanceTransaction[];
}

/**
 * 余额交易记录表格 - Vibrant Blocks 风格
 *
 * 老王我：
 * - Client Component（需要交互）
 * - 通过 props 接收数据，不再调用 API
 * - 避免导入 server-only 模块
 */
export function BalanceTransactionTable({ transactions }: BalanceTransactionTableProps) {
  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  if (transactions.length === 0) {
    return (
      <div className="relative overflow-hidden p-12 rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-white text-center">
        <FileText size={48} className="mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-bold text-gray-600">暂无余额交易记录</p>
        <p className="text-sm text-gray-500 mt-2">完成订单后会显示交易记录</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-white">
      {/* 老王我：交易记录表格 */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-bold text-black">时间</TableHead>
            <TableHead className="font-bold text-black">类型</TableHead>
            <TableHead className="font-bold text-black">金额</TableHead>
            <TableHead className="font-bold text-black">变动后余额</TableHead>
            <TableHead className="font-bold text-black">说明</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id} className="hover:bg-gray-50">
              <TableCell className="text-sm">
                {dayjs(tx.created_at).locale("zh-cn").format("YYYY-MM-DD HH:mm")}
              </TableCell>
              <TableCell>
                {tx.amount > 0 ? (
                  <Badge className="bg-green-100 text-green-800 border-2 border-green-600 hover:bg-green-100">
                    <ArrowUpCircle className="w-4 h-4 mr-1" />
                    充值
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 border-2 border-red-600 hover:bg-red-100">
                    <ArrowDownCircle className="w-4 h-4 mr-1" />
                    扣除
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <span className={cn(
                  "font-black text-base",
                  tx.amount > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {tx.amount > 0 ? '+' : ''}{formatAmount(tx.amount)}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-base">
                  {formatAmount(tx.balance)}
                </span>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="font-semibold text-gray-800">{tx.description}</div>
                  {tx.metadata?.jdc_bill_no && (
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <span className="font-medium">金蝶收款单号：</span>
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                        {tx.metadata.jdc_bill_no}
                      </span>
                    </div>
                  )}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
