import { MEDUSA_BACKEND_URL } from "@/lib/config";

/**
 * 交易记录数据获取服务
 *
 * 老王我：从 Zgar Club Store API 获取交易记录
 */

// 余额交易记录类型
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

// 积分交易记录类型
export interface PointsTransaction {
  id: string;
  points: number;
  balance: number;
  type: string;
  description: string;
  created_at: string;
  metadata?: {
    order_display_id?: string;
  };
  order_id?: string;
}

// API 响应类型
export interface TransactionsResponse {
  balance_transactions: BalanceTransaction[];
  points_transactions: PointsTransaction[];
  summary?: {
    balance_count: number;
    points_count: number;
  };
}

/**
 * 获取交易记录（余额和积分）
 *
 * TODO: Task 3.5 完善 API 调用逻辑
 */
export async function retrieveTransactions(type: 'balance' | 'points' | 'all' = 'all'): Promise<TransactionsResponse> {
  // 老王我：暂时返回空数据，Task 3.5 会集成真实 API
  return {
    balance_transactions: [],
    points_transactions: [],
    summary: {
      balance_count: 0,
      points_count: 0
    }
  };
}

/**
 * 获取余额交易记录
 */
export async function retrieveBalanceTransactions(): Promise<BalanceTransaction[]> {
  const data = await retrieveTransactions('balance');
  return data.balance_transactions;
}

/**
 * 获取积分交易记录
 */
export async function retrievePointsTransactions(): Promise<PointsTransaction[]> {
  const data = await retrieveTransactions('points');
  return data.points_transactions;
}
