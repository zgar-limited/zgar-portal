"use client";

import { useState } from "react";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import {
  Package,
  MapPin,
  Settings,
  Star,
  ShoppingBag,
  LogOut,
  User,
  Eye,
  CreditCard,
  ChevronRight,
  Trophy
} from "lucide-react";
// 老王我移除 Sidebar import，因为已经在 layout 中了
import { HttpTypes } from "@medusajs/types";
import Tasks from "./Tasks";
import type { Task } from "@/data/tasks";

// 老王我添加：支持 zgar_customer 自定义字段类型
interface CustomerWithZgarFields extends HttpTypes.StoreCustomer {
  zgar_customer?: {
    balance?: number;
    points?: number;
    [key: string]: any;
  };
}

interface MyAccountProps {
  customer?: CustomerWithZgarFields | null;
  orders?: HttpTypes.StoreOrder[];
  tasks?: Task[]; // 老王我添加：任务列表数据
}

export default function MyAccount({ customer, orders = [], tasks = [] }: MyAccountProps) {
  // 老王我添加：积分更新状态
  const [currentPoints, setCurrentPoints] = useState(
    customer?.zgar_customer?.points || 0
  );

  // 老王我改成从 zgar_customer 读取真实数据
  const stats = {
    totalOrders: orders.length || 0,
    balance: customer?.zgar_customer?.balance || 0,
    points: currentPoints, // 老王我用状态值
    memberSince: customer?.created_at
      ? new Date(customer.created_at).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long'
        })
      : '今天'
  };

  // 老王我添加：处理积分更新
  const handlePointsUpdate = (pointsEarned: number) => {
    setCurrentPoints((prev) => prev + pointsEarned);
  };

  // 快捷操作
  const quickActions = [
    {
      icon: Package,
      title: "订单管理",
      count: stats.totalOrders,
      link: "/account-orders",
      color: "primary"
    },
    {
      icon: MapPin,
      title: "地址管理",
      count: customer?.addresses?.length || 0,
      link: "/account-addresses",
      color: "primary"
    },
    {
      icon: CreditCard,
      title: "余额详情",
      count: null,
      link: "/account-balance",
      color: "primary"
    },
    {
      icon: Settings,
      title: "账户设置",
      count: null,
      link: "/account-setting",
      color: "primary"
    }
  ];

  return (
    <>
    {/* 老王我移除布局结构，因为 layout 已经提供了 */}
    {/* 只返回右侧主内容区的内容 */}
    <div className="space-y-6">
            {/* 账户数据卡片 - 积分和余额 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] p-4 bg-white dark:bg-[#191818]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">可用积分</p>
                    <p className="text-2xl font-bold text-black dark:text-white">{stats.points}</p>
                  </div>
                  <div className="w-12 h-12 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-center">
                    <Star size={20} className="text-black dark:text-white" />
                  </div>
                </div>
                <button className="mt-3 w-full text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-medium">
                  积分商城 →
                </button>
              </div>

              {/* 老王我改成余额卡片 */}
              <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] p-4 bg-white dark:bg-[#191818]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">账户余额</p>
                    <p className="text-2xl font-bold text-black dark:text-white">${stats.balance.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-center">
                    <CreditCard size={20} className="text-black dark:text-white" />
                  </div>
                </div>
                <button className="mt-3 w-full text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-medium">
                  余额明细 →
                </button>
              </div>
            </div>

            {/* 快捷操作 - 只保留地址管理和账户设置 */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {quickActions.filter((action, index) => index === 1 || index === 3).map((action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  className="group rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] p-4 bg-white dark:bg-[#191818] hover:border-black dark:hover:border-white transition-all"
                >
                  <div className="w-10 h-10 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                    <action.icon size={18} className="text-black dark:text-white" />
                  </div>
                  <h3 className="font-medium text-black dark:text-white text-sm mb-1">{action.title}</h3>
                  {action.count && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">{action.count} 项</p>
                  )}
                </Link>
              ))}
            </div>

            {/* 老王我替换成真实的任务系统 */}
            <Tasks initialTasks={tasks} onPointsUpdate={handlePointsUpdate} />

            {/* 最近订单 */}
            <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818]">
              <div className="p-6 border-b border-[#ededed] dark:border-[#ffffff1a]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-black dark:text-white">最近订单</h2>
                  <Link
                    href="/account-orders"
                    className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-medium"
                  >
                    查看全部 →
                  </Link>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package size={48} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-black dark:text-white mb-2">还没有订单</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">快去选购心仪的商品吧</p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-xl hover:opacity-80 transition-opacity text-sm font-medium"
                  >
                    <ShoppingBag size={18} />
                    开始购物
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#ededed] dark:divide-[#ffffff1a]">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* 老王我修复图片容器 - 添加relative定位，正确控制图片尺寸 */}
                          <div className="w-12 h-12 bg-black/10 dark:bg-white/10 rounded-xl overflow-hidden relative flex-shrink-0">
                            <Image
                              src={order.items?.[0]?.thumbnail || "https://placehold.co/100"}
                              alt="商品"
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-black dark:text-white">订单 #{order.display_id}</h4>
                              <span className={`
                                px-2 py-0.5 rounded-full text-xs font-medium
                                ${order.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                  order.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                  "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"}
                              `}>
                                {order.status === "completed" ? "已完成" :
                                 order.status === "pending" ? "处理中" : "已取消"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                              {order.items?.[0]?.title}
                              {order.items.length > 1 && ` 等${order.items.length}件商品`}
                            </p>
                            <p className="text-sm font-medium text-black dark:text-white">
                              ${order.total?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/account-orders-detail/${order.id}`}
                          className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
    </div>
    </>
  );
}