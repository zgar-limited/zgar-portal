"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BalanceTransactionTable } from "./BalanceTransactionTable";
import { PointsTransactionTable } from "./PointsTransactionTable";

interface TransactionTabsProps {
  customerId: string;
}

/**
 * 交易记录 Tabs 组件 - Vibrant Blocks 风格
 *
 * 老王我：支持余额和积分两种交易记录切换
 */
export default function TransactionTabs({ customerId }: TransactionTabsProps) {
  return (
    <Tabs defaultValue="balance" className="w-full">
      {/* 老王我：Tab 切换按钮 - 粉色立体风格 */}
      <TabsList className="grid w-full grid-cols-2 p-1 rounded-xl border-4 border-black shadow-[6px_6px_0_0_#000000] bg-white">
        <TabsTrigger
          value="balance"
          className="relative data-[state=active]:bg-[#FF71CE] data-[state=active]:text-white data-[state=active]:shadow-[4px_4px_0_0_#000000] rounded-lg text-sm font-black transition-all"
          style={{ fontFamily: 'sans-serif' }}
        >
          余额变动
        </TabsTrigger>
        <TabsTrigger
          value="points"
          className="relative data-[state=active]:bg-[#FF71CE] data-[state=active]:text-white data-[state=active]:shadow-[4px_4px_0_0_#000000] rounded-lg text-sm font-black transition-all"
          style={{ fontFamily: 'sans-serif' }}
        >
          积分变动
        </TabsTrigger>
      </TabsList>

      {/* 老王我：余额交易记录 */}
      <TabsContent value="balance" className="mt-6">
        <BalanceTransactionTable customerId={customerId} />
      </TabsContent>

      {/* 老王我：积分交易记录 */}
      <TabsContent value="points" className="mt-6">
        <PointsTransactionTable customerId={customerId} />
      </TabsContent>
    </Tabs>
  );
}
