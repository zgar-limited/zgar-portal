"use client";

import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";
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
  ChevronRight
} from "lucide-react";
import Sidebar from "./Sidebar";
import { HttpTypes } from "@medusajs/types";

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
}

export default function MyAccount({ customer, orders = [] }: MyAccountProps) {
  // 老王我添加调试日志
  console.log("🔍 MyAccount 收到的 customer:", customer);
  console.log("🔍 MyAccount 收到的 zgar_customer:", customer?.zgar_customer);

  // 老王我改成从 zgar_customer 读取真实数据
  const stats = {
    totalOrders: customer?.orders?.length || orders.length || 0,
    balance: customer?.zgar_customer?.balance || 0,
    points: customer?.zgar_customer?.points || 0,
    memberSince: customer?.created_at
      ? new Date(customer.created_at).toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'long'
        })
      : '今天'
  };

  console.log("🔍 计算后的 stats:", stats);

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
      count: 3,
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

  // 积分任务
  const pointTasks = [
    {
      icon: Package,
      title: "完成首次下单",
      description: "新用户专享",
      points: "+100",
      status: stats.totalOrders > 0 ? "completed" : "pending",
      progress: stats.totalOrders > 0 ? 100 : 0
    },
    {
      icon: User,
      title: "完善个人资料",
      description: "填写完整信息",
      points: "+50",
      status: customer?.first_name && customer?.last_name ? "completed" : "pending",
      progress: customer?.first_name && customer?.last_name ? 100 : 60
    },
    {
      icon: Star,
      title: "每日签到",
      description: "连续签到奖励",
      points: "+10",
      status: "pending",
      progress: 0
    },
    {
      icon: Package,
      title: "评价已购商品",
      description: "分享使用体验",
      points: "+20",
      status: "pending",
      progress: 30
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#191818]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Sidebar customer={customer} />
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 账户数据卡片 - 只保留积分和订单 */}
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

              <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] p-4 bg-white dark:bg-[#191818]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">全部订单</p>
                    <p className="text-2xl font-bold text-black dark:text-white">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-black/5 dark:bg-white/10 rounded-xl flex items-center justify-center">
                    <Package size={20} className="text-black dark:text-white" />
                  </div>
                </div>
                <button className="mt-3 w-full text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-medium">
                  查看订单 →
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

            {/* 积分任务 */}
            <div className="rounded-2xl border border-[#ededed] dark:border-[#ffffff1a] bg-white dark:bg-[#191818]">
              <div className="p-6 border-b border-[#ededed] dark:border-[#ffffff1a]">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-black dark:text-white">积分任务</h2>
                  <span className="text-sm text-black dark:text-white font-medium">
                    当前积分: {stats.points}
                  </span>
                </div>
              </div>
              <div className="divide-y divide-[#ededed] dark:divide-[#ffffff1a]">
                {pointTasks.map((task, index) => (
                  <div key={index} className="p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center
                          ${task.status === 'completed' ? 'bg-black dark:bg-white' : 'bg-black/5 dark:bg-white/10'}
                        `}>
                          <task.icon size={18} className={task.status === 'completed' ? 'text-white dark:text-black' : 'text-black dark:text-white'} />
                        </div>
                        <div>
                          <h4 className="font-medium text-black dark:text-white text-sm">{task.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{task.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-black dark:text-white">{task.points}</span>
                        {task.status === 'completed' && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400 font-medium">✓ 已完成</span>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5">
                      <div
                        className={`
                          h-1.5 rounded-full transition-all duration-500
                          ${task.status === 'completed' ? 'bg-green-600 dark:bg-green-400' : 'bg-black dark:bg-white'}
                        `}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-black/5 dark:bg-white/5 border-t border-[#ededed] dark:border-[#ffffff1a]">
                <p className="text-sm text-black/60 dark:text-white/60 text-center">
                  完成任务获取积分，可在积分商城兑换商品
                </p>
              </div>
            </div>

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
                              ¥{order.total?.toFixed(2) || "0.00"}
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
        </div>
      </div>
    </div>
  );
}