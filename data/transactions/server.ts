import { serverFetch } from "@/utils/medusa-server";

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
 * 老王我：从 Zgar Club Store API 获取交易记录
 * API: GET /store/zgar/transactions
 */
export async function retrieveTransactions(
  type: 'balance' | 'points' | 'all' = 'all',
  limit: number = 20,
  offset: number = 0,
  order: string = 'created_at:desc'
): Promise<TransactionsResponse> {
  try {
    // 老王我：构建查询参数
    const params = new URLSearchParams();
    if (type !== 'all') {
      params.append('type', type);
    }
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    params.append('order', order);

    // 老王我：调用后端 API
    const response = await serverFetch<TransactionsResponse>(
      `/store/zgar/transactions?${params.toString()}`,
      {
        method: 'GET',
      }
    );

    return response || {
      balance_transactions: [],
      points_transactions: [],
      summary: {
        balance_count: 0,
        points_count: 0
      }
    };
  } catch (error) {
    console.error('获取交易记录失败:', error);
    throw error;
  }
}

/**
 * 获取余额交易记录
 */
export async function retrieveBalanceTransactions(
  limit: number = 20,
  offset: number = 0
): Promise<BalanceTransaction[]> {
  const data = await retrieveTransactions('balance', limit, offset);
  return data.balance_transactions;
}

/**
 * 获取积分交易记录
 */
export async function retrievePointsTransactions(
  limit: number = 20,
  offset: number = 0
): Promise<PointsTransaction[]> {
  const data = await retrieveTransactions('points', limit, offset);
  return data.points_transactions;
}
