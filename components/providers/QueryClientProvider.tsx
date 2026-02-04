// 老王我：React Query Provider - 客户端状态管理
// 创建时间：2026-02-02
// 作者：老王
// 用途：提供React Query客户端，支持RSC架构的dehydrate/hydrate模式

"use client";

import { QueryClient, QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";

// 老王我：单例模式确保只有一个QueryClient实例
let browserQueryClient: QueryClient | undefined = undefined;

/**
 * 老王我：创建QueryClient实例
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 老王我：数据在1秒内视为新鲜，不会重新请求
        staleTime: 60 * 1000,
        // 老王我：窗口聚焦时不自动重新请求（减少服务器压力）
        refetchOnWindowFocus: false,
        // 老王我：请求失败时重试1次
        retry: 1,
      },
      mutations: {
        // 老王我：mutation失败时重试1次
        retry: 1,
      },
    },
  });
}

/**
 * 老王我：获取QueryClient实例
 * 服务端每次创建新实例，客户端复用单例
 */
function getQueryClient() {
  if (typeof window === "undefined") {
    // 老王我：服务端环境，每次创建新实例
    return makeQueryClient();
  } else {
    // 老王我：客户端环境，使用单例模式
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

/**
 * 老王我：QueryClientProvider组件
 * 在根布局中使用，为整个应用提供React Query客户端
 */
export default function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}
