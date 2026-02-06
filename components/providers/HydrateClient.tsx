// 老王我：HydrateClient组件 - React Query RSC模式支持
// 创建时间：2026-02-02
// 作者：老王
// 用途：将服务端prefetch的数据dehydrate后传递给客户端hydrate

"use client";

import { HydrationBoundary, QueryClient } from "@tanstack/react-query";

/**
 * 老王我：HydrateClient组件属性
 */
interface HydrateClientProps {
  children: React.ReactNode;
  state: unknown; // dehydrated state
}

/**
 * 老王我：HydrateClient组件
 * 用于在RSC架构中连接服务端和客户端的React Query状态
 *
 * 使用方式：
 * 1. 服务端组件中prefetch数据并dehydrate
 * 2. 将dehydrated state传递给此组件
 * 3. 客户端组件通过useQuery获取数据（会自动从hydrate的state中读取）
 */
export default function HydrateClient({ children, state }: HydrateClientProps) {
  // 老王我：创建客户端QueryClient（使用dehydrated state作为初始数据）
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <HydrationBoundary state={state}>
      {children}
    </HydrationBoundary>
  );
}
