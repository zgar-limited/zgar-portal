"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Upload, Package, ShoppingBag, Star, Wallet, CreditCard, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: HttpTypes.StoreOrder;
  onViewDetails: () => void;
  onUploadVoucher: () => void;
  onUploadPacking: () => void;
}

export default function OrderCard({
  order,
  onViewDetails,
  onUploadVoucher,
  onUploadPacking
}: OrderCardProps) {
  const locale = useLocale(); // 老王我获取当前语言，用于多语言翻译
  const tOrders = useTranslations('Orders'); // 老王我添加：订单翻译
  const tPayment = useTranslations('PaymentMethods'); // 老王我添加：支付方式翻译
  const tCard = useTranslations('OrderCard'); // 老王我添加：订单卡片翻译

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 老王我添加：判断是否是积分订单
  const isPointsOrder = (order as any).zgar_order?.payment_method === 'points'; // 老王我修复：数据值是 'points' 不是 'zgar_points'

  // 订单状态颜色映射
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "canceled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // 老王我添加：支付方式图标映射 - 黑白简洁风格
  const getPaymentIcon = (paymentMethod: string) => {
    const method = paymentMethod || 'manual';
    switch (method) {
      case 'balance':
        return <Wallet size={16} className="text-gray-700" />;
      case 'points':
        return <Star size={16} className="text-gray-700" />;
      case 'credit':
        return <CreditCard size={16} className="text-gray-700" />;
      case 'manual':
        return <Landmark size={16} className="text-gray-700" />;
      default:
        return <Wallet size={16} className="text-gray-700" />;
    }
  };

  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl">
      {/* 老王我优化：渐变背景头部 */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-5 border-b border-gray-200">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            {/* 老王我优化：订单号 + 类型图标一体化 - 使用品牌统一色圆形 */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* 老王我个性设计：积分订单星星图标 - 品牌粉蓝渐变圆形 */}
              {isPointsOrder ? (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Star size={18} className="text-white fill-white" />
                </div>
              ) : (
                /* 老王我个性设计：付款订单钱包图标 - 品牌粉蓝渐变圆形 */
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-pink to-brand-blue flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Wallet size={18} className="text-white" />
                </div>
              )}
              <h3 className="font-bold text-xl text-gray-900">#{order.display_id}</h3>

              {/* 老王我优化：状态标签渐变色 */}
              <Badge
                className={cn(
                  "text-xs font-bold px-3 py-1.5 rounded-full border-0 shadow-sm",
                  order.status === "completed" && "bg-gradient-to-r from-green-400 to-green-500 text-white",
                  order.status === "pending" && "bg-gradient-to-r from-amber-400 to-orange-400 text-white",
                  order.status === "canceled" && "bg-gradient-to-r from-red-400 to-red-500 text-white"
                )}
              >
                {order.status === "completed" ? tOrders('completed') :
                 order.status === "pending" ? tOrders('pending') : tOrders('canceled')}
              </Badge>
            </div>

            {/* 老王我优化：支付方式图标化 - 简洁黑白圆形 */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                {getPaymentIcon((order as any).zgar_order?.payment_method)}
              </div>
              <span className="font-semibold">{tPayment('zgar_' + ((order as any).zgar_order?.payment_method || 'manual'))}</span>
            </div>

            {/* 老王我优化：金额显示更突出 */}
            {!isPointsOrder && (
            <div className="pt-1">
              <span className="text-2xl font-black text-gray-900">
                {order.currency_code?.toUpperCase() === 'USD' ? '$' : order.currency_code?.toUpperCase() + ' '}
                {formatAmount(order.total).replace('$', '')}
              </span>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* 老王我优化：商品列表更清爽 */}
      <div className="p-5 space-y-3 bg-white">
        {order.items?.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
              index < (order.items?.length || 0) - 1 && "border-b border-gray-100",
              "hover:bg-gradient-to-r hover:from-brand-pink/5 hover:to-brand-blue/5"
            )}
          >
            <Link
              href={`/product-detail/${
                item.product_id ||
                item.variant?.product_id ||
                ""
              }`}
              className="flex-shrink-0"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 group-hover:border-brand-pink/50 shadow-md group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={
                    item.thumbnail ||
                    "https://placehold.co/100"
                  }
                  alt={item.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate mb-1.5 group-hover:text-brand-pink transition-colors">
                <Link
                  href={`/product-detail/${
                    item.product_id ||
                    item.variant?.product_id ||
                    ""
                  }`}
                  className="hover:text-brand-pink transition-colors"
                >
                  {item.variant_title || item.title}
                </Link>
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {item.variant?.options && (item.variant.options as any[]).length > 0 ? (
                  (item.variant.options as any[]).map((option: any, idx: number) => {
                    const localeUnderscore = locale.replace('-', '_').toLowerCase();
                    const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
                    const productMetadata = (item as any).product?.metadata || {};
                    const localizedValue = productMetadata[optionValueKey] || option.value;

                    return (
                      <Badge key={idx} variant="secondary" className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border-0 font-medium">
                        {localizedValue}
                      </Badge>
                    );
                  })
                ) : null}
                <span className="font-bold text-gray-900">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 老王我优化：操作按钮更现代 */}
      <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="rounded-xl font-bold shadow-sm hover:shadow-md transition-all duration-300 border-2 hover:bg-brand-gradient hover:text-white hover:border-transparent"
          >
            <Eye size={16} className="mr-1.5" />
            {tCard('details')}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "rounded-xl font-bold shadow-sm hover:shadow-md transition-all duration-300",
              (order as any).zgar_order?.payment_voucher_uploaded_at
                ? "bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200"
                : "bg-white text-gray-700 hover:bg-gray-200 border-2 border-gray-300"
            )}
            size="sm"
            onClick={onUploadVoucher}
          >
            <Upload size={16} className="mr-1" />
            {(order as any).zgar_order?.payment_voucher_uploaded_at ? tCard('uploaded') : tCard('voucher')}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "rounded-xl font-bold shadow-sm hover:shadow-md transition-all duration-300",
              (order as any).zgar_order?.packing_requirement_uploaded_at
                ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-2 border-blue-200"
                : "bg-white text-gray-700 hover:bg-gray-200 border-2 border-gray-300"
            )}
            size="sm"
            onClick={onUploadPacking}
          >
            <Package size={16} className="mr-1" />
            {(order as any).zgar_order?.packing_requirement_uploaded_at ? tCard('uploaded') : tCard('packing')}
          </Button>
        </div>
      </div>
    </Card>
  );
}