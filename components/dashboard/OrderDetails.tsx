"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Sidebar from "./Sidebar";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Edit2,
} from "lucide-react";
import UploadVoucherModal from "../modals/UploadVoucherModal";
import PackingRequirementsModal from "../modals/PackingRequirementsModal";
import EditShippingAddressModal from "../modals/EditShippingAddressModal";
import { retrieveOrderWithZgarFields } from "@/data/orders";
// 老王我：导入重量格式化工具
import { formatWeight } from "@/utils/weight-utils";

const OrderStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  CANCELED: "canceled",
  REQUIRES_ACTION: "requires_action",
};

const AuditStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
}

export default function OrderDetails({ order: initialOrder }: OrderDetailsProps) {
  const router = useRouter();
  const locale = useLocale(); // 老王我获取当前语言，用于多语言翻译
  const t = useTranslations('order-details'); // 老王我：订单详情多语言
  const tp = useTranslations('packing-requirements'); // 老王我：打包要求多语言
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingRequirements, setShowPackingRequirements] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [order, setOrder] = useState(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const orderId = order.id;

  const zgarOrder = (order as any).zgar_order || {};
  // 老王我获取 packing_requirement，里面有 shipping_marks
  const packingRequirement = zgarOrder.packing_requirement || {};
  const shippingMarks = packingRequirement.shipping_marks || [];

  // 老王我：获取支付方式
  const paymentMethod = zgarOrder.payment_method;

  // 老王我添加：手动刷新订单数据，不刷新页面
  const refreshOrder = async () => {
    setIsRefreshing(true);
    try {
      const updatedOrder = await retrieveOrderWithZgarFields(orderId);
      if (updatedOrder) {
        setOrder(updatedOrder);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const getOrderStatusVariant = (status: string) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "default";
      case OrderStatus.PENDING:
        return "secondary";
      case OrderStatus.CANCELED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getAuditStatusVariant = (status: string) => {
    switch (status) {
      case AuditStatus.APPROVED:
        return "default";
      case AuditStatus.PENDING:
        return "secondary";
      case AuditStatus.REJECTED:
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      {/* 老王我移除外层布局和 Sidebar，因为 layout 已经提供了 */}
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-6">
<div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <Link
      href="/account-orders"
      className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
    >
      <ChevronLeft size={24} />
    </Link>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
      Order #{order.display_id}
    </h2>
  </div>
  <div className="flex items-center gap-2">
    <Badge variant={getOrderStatusVariant(order.status)} className="px-3 py-1">
      {order.status.toUpperCase()}
    </Badge>
    {zgarOrder.audit_status && (
      <Badge variant={getAuditStatusVariant(zgarOrder.audit_status)} className="px-3 py-1">
        Audit: {zgarOrder.audit_status.toUpperCase()}
      </Badge>
    )}
  </div>
</div>
</CardContent>
</Card>

{/* Main Content Grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Left Column - Order Items */}
<div className="lg:col-span-2 space-y-6">
{/* Order Items Card */}
<Card>
  <CardHeader>
    <CardTitle className="text-lg font-bold">{t('orderItems')}</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <tr>
<th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
{t('product')}
</th>
<th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
{t('price')}
</th>
<th className="px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
{t('qty')}
</th>
<th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
{t('total')}
</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
<tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
<td className="px-4 py-4">
  <div className="flex items-center gap-3">
    {/* 老王我修复图片容器 - 添加relative定位 */}
    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-200 dark:border-gray-700">
      <Image
        src={item.thumbnail || "https://placehold.co/100"}
        alt={item.title}
        fill
        className="object-cover"
        sizes="64px"
      />
    </div>
    <div className="flex-1 min-w-0">
      <Link
        href={`/product-detail/${item.variant?.product_id || ""}`}
        className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-medium text-sm truncate block mb-1"
      >
        {/* 老王我修改：显示 variant_title 而不是 title */}
        {item.variant_title || item.title}
      </Link>
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        {/* 老王我添加：显示商品变体 options（多语言翻译） */}
        {item.variant?.options && (item.variant.options as any[]).length > 0 ? (
          <>
            {(item.variant.options as any[]).map((option: any, idx: number) => {
              // 老王我：locale 需要转成下划线格式（zh-HK -> zh_hk）
              const localeUnderscore = locale.replace('-', '_').toLowerCase();
              const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
              const productMetadata = (item as any).product?.metadata || {};
              const localizedValue = productMetadata[optionValueKey] || option.value;

              return (
                <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5 rounded-md">
                  {localizedValue}
                </Badge>
              );
            })}
            {/* 老王我：显示重量信息（从 product metadata 获取） */}
            {(() => {
              const productWeight = (item as any).product?.metadata?.package_spec_product_weight;
              const formattedWeight = formatWeight(productWeight, locale);

              if (formattedWeight === '-') return null;

              return <span>• {formattedWeight} / unit</span>;
            })()}
          </>
        ) : item.variant_title ? (
          <>
            <span>{item.variant_title}</span>
            {/* 老王我：显示重量信息 */}
            {(() => {
              const productWeight = (item as any).product?.metadata?.package_spec_product_weight;
              const formattedWeight = formatWeight(productWeight, locale);

              if (formattedWeight === '-') return null;

              return (
                <>
                  <span className="text-gray-300">•</span>
                  <span>{formattedWeight} / unit</span>
                </>
              );
            })()}
          </>
        ) : (
          // 老王我：没有 options 和 variant_title，只显示重量
          {(() => {
            const productWeight = (item as any).product?.metadata?.package_spec_product_weight;
            const formattedWeight = formatWeight(productWeight, locale);

            if (formattedWeight === '-') return null;

            return <span>{formattedWeight} / unit</span>;
          })()}
        )}
      </div>
    </div>
  </div>
</td>
<td className="px-4 py-4 text-right text-sm text-gray-900 dark:text-white font-medium">
  {order.currency_code.toUpperCase()} {item.unit_price?.toFixed(2) || "0.00"}
</td>
<td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-white">
  {item.quantity}
</td>
<td className="px-4 py-4 text-right text-sm text-gray-900 dark:text-white font-semibold">
  {order.currency_code.toUpperCase()}
  {/* 老王我直接用接口返回的total字段 */}
  {item.total?.toFixed(2) || "0.00"}
</td>
</tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50 dark:bg-gray-800/50 border-t-2 border-gray-200 dark:border-gray-700">
          <tr>
<td colSpan={3} className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
{t('subtotal')}
</td>
<td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
{order.currency_code.toUpperCase()} {order.subtotal?.toFixed(2) || "0.00"}
</td>
          </tr>
          <tr>
<td colSpan={3} className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-400">
{t('shipping')}
</td>
<td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
{order.currency_code.toUpperCase()} {order.shipping_total?.toFixed(2) || "0.00"}
</td>
          </tr>
          <tr>
<td colSpan={3} className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
{t('total')}
</td>
<td className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
{order.currency_code.toUpperCase()} {order.total?.toFixed(2) || "0.00"}
</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </CardContent>
</Card>

{/* Payment & Packing Cards */}
<div className="space-y-6">
  {/* 老王我：Payment Voucher Card - 余额支付时隐藏整个卡片 */}
  {paymentMethod !== 'balance' && (
  <Card>
    <CardContent className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard size={22} className="text-blue-600 dark:text-blue-400" />
          <div>
<h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('paymentVoucher')}</h3>
<p className="text-xs text-gray-500 dark:text-gray-400">{t('uploadYourPaymentReceipt')}</p>
          </div>
        </div>
        {zgarOrder.payment_voucher_uploaded_at ? (
          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
        ) : (
          <AlertCircle size={20} className="text-gray-400 dark:text-gray-600" />
        )}
      </div>

      {zgarOrder.payment_voucher_uploaded_at ? (
        <div className="space-y-4">
          {/* 上传时间 */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
<Calendar size={16} />
<span>
Uploaded on {new Date(zgarOrder.payment_voucher_uploaded_at).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})}
</span>
          </div>

          {/* 凭证列表 - 老王我改成网格布局 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
{zgarOrder.payment_voucher_url?.split(",").filter(Boolean).map((url: string, idx: number) => (
<a
  key={idx}
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200"
>
  <img
    src={url}
    alt={`Voucher ${idx + 1}`}
    className="w-full h-full object-cover"
  />
  {/* 老王我添加悬停遮罩 */}
  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
    <FileText size={24} className="text-white" />
  </div>
  {/* 序号标识 */}
  <div className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
    {idx + 1}
  </div>
</a>
))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
<Upload size={32} className="text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{t('noVoucherUploaded')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{t('uploadVoucherDescription')}</p>
        </div>
      )}

      {/* 上传按钮 */}
      <Button
        variant="outline"
        onClick={() => setShowVoucherModal(true)}
        className="w-full h-12 text-base font-semibold mt-4 border-2 border-gray-900 dark:border-gray-600 bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-all"
      >
        <Upload size={18} className="mr-2" />
        {zgarOrder.payment_voucher_uploaded_at ? t('uploadNewVoucher') : t('uploadPaymentVoucher')}
      </Button>
    </CardContent>
  </Card>
  )}

  {/* Packing Requirements Card - 老王我改成交互式唛头管理 */}
  <Card>
    <CardContent className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package size={22} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">{t('packingRequirements')}</h3>
        </div>
        {/* 老王我显示唛头分组状态 */}
        {shippingMarks && Array.isArray(shippingMarks) && shippingMarks.length > 0 ? (
          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
        ) : zgarOrder.packing_requirement_uploaded_at ? (
          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
        ) : (
          <AlertCircle size={20} className="text-gray-400 dark:text-gray-600" />
        )}
      </div>

      {/* 老王我显示唛头分组信息 */}
      {shippingMarks && Array.isArray(shippingMarks) && shippingMarks.length > 0 ? (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
{t('createdGroups', { count: shippingMarks.length })}
          </p>
          <div className="space-y-3">
{shippingMarks.map((mark: any, idx: number) => {
  // 老王我计算商品总数：allocations 中所有 quantity 的总和
  const totalItems = mark.allocations?.reduce((sum: number, alloc: any) => sum + (alloc.quantity || 0), 0) || 0;

  return (
<div
  key={idx}
  className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
>
  {/* 唛头标题 */}
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2">
      <Package size={16} className="text-blue-500" />
      <span className="text-sm font-bold text-gray-900 dark:text-white">
        {mark.name}
      </span>
      {mark.description && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          - {mark.description}
        </span>
      )}
    </div>
    <Badge variant="outline" className="text-xs">
      {totalItems} {t('items')}
    </Badge>
  </div>

  {/* 老王我：显示该唛头下的商品明细 */}
  {mark.allocations && mark.allocations.length > 0 && (
    <div className="ml-6 space-y-1.5">
      {mark.allocations.map((alloc: any, allocIdx: number) => {
        // 老王我：通过itemId查找商品信息
        const item = order.items.find((i) => i.id === alloc.itemId);
        if (!item) return null;

        return (
          <div key={allocIdx} className="flex flex-col gap-1">
            {/* 老王我修改：商品标题 + 多语言 options */}
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="font-medium">{item.variant_title || item.title}</span>
              {item.variant?.options && (item.variant.options as any[]).length > 0 && (
                <div className="flex items-center gap-1">
                  {(item.variant.options as any[]).map((option: any, idx: number) => {
                    // 老王我：locale 需要转成下划线格式（zh-HK -> zh_hk）
                    const localeUnderscore = locale.replace('-', '_').toLowerCase();
                    const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
                    const productMetadata = (item as any).product?.metadata || {};
                    const localizedValue = productMetadata[optionValueKey] || option.value;

                    return (
                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5 rounded-md">
                        {localizedValue}
                      </Badge>
                    );
                  })}
                </div>
              )}
              {/* 老王我：添加重量显示 */}
              {(() => {
                const productWeight = (item as any).product?.metadata?.package_spec_product_weight;
                const formattedWeight = formatWeight(productWeight, locale);

                if (formattedWeight === '-') return null;

                return <span className="ml-auto mr-2">{formattedWeight}</span>;
              })()}
              <span className="ml-auto">× {alloc.quantity}</span>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
);
})}
          </div>
          {packingRequirement.updated_at && (
<p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
{t('updatedAt')}: {new Date(packingRequirement.updated_at).toLocaleString()}
</p>
          )}
        </div>
      ) : zgarOrder.packing_requirement_uploaded_at ? (
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
上传于: {new Date(zgarOrder.packing_requirement_uploaded_at).toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-3">
{zgarOrder.packing_requirement_url?.split(",").filter(Boolean).map((url: string, idx: number) => (
<a
  key={idx}
  href={url}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
>
  <FileText size={15} />
  附件 {idx + 1}
</a>
))}
          </div>
        </div>
      ) : (
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 italic">
          {t('noPackingRequirements')}
        </p>
      )}

      <Button
        variant="outline"
        className="w-full h-12 text-base font-semibold"
        onClick={() => setShowPackingRequirements(true)}
      >
        <Upload size={18} className="mr-2" />
        {shippingMarks && shippingMarks.length > 0
          ? t('editPackingPlan')
          : zgarOrder.packing_requirement_uploaded_at
          ? t('updatePackingRequirements')
          : t('createPackingPlan')}
      </Button>
    </CardContent>
  </Card>
</div>
</div>

{/* Right Column - Order Summary & Shipping */}
<div className="lg:col-span-1 space-y-6">
{/* Order Summary Card */}
<Card>
  <CardContent className="p-6">
    <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t('orderSummary')}</h3>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
          <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{t('orderDate')}</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
{new Date(order.created_at).toLocaleDateString("en-US", {
year: "numeric",
month: "short",
day: "numeric",
})}
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
          <CreditCard size={18} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{t('payment')}</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize truncate">
            {order.payment_status}
          </div>
          {/* 老王我：显示支付方式 - 添加多语言支持 */}
          {zgarOrder.payment_method && (
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              {zgarOrder.payment_method === 'balance' ? t('balancePayment') : t('manualTransfer')}
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
          <Package size={18} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{t('fulfillment')}</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize truncate">
{order.fulfillment_status}
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

{/* Shipping Address Card */}
<Card>
  <CardContent className="p-6">
    {/* 老王我：重新设计标题和按钮布局 - 垂直排列防止换行问题 */}
    <div className="flex items-start justify-between mb-4">
      <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white">
        <MapPin size={18} />
        {t('shippingAddress')}
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowEditAddress(true)}
        className="h-8 px-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex-shrink-0"
      >
        <Edit2 size={14} className="mr-1.5" />
        编辑
      </Button>
    </div>
    <address className="not-italic text-sm text-gray-600 dark:text-gray-400 space-y-1">
      <div className="font-medium text-gray-900 dark:text-white">
        {order.shipping_address?.first_name} {order.shipping_address?.last_name}
      </div>
      {order.shipping_address?.company && (
        <div>{order.shipping_address.company}</div>
      )}
      <div>{order.shipping_address?.address_1}</div>
      {order.shipping_address?.address_2 && (
        <div>{order.shipping_address.address_2}</div>
      )}
      {/* 老王我：修复逗号问题 - 只在有province时才显示逗号 */}
      <div>
        {order.shipping_address?.city}
        {order.shipping_address?.province && `, ${order.shipping_address.province}`}
        {order.shipping_address?.postal_code && ` ${order.shipping_address.postal_code}`}
      </div>
      {/* 老王我：移除国家代码显示 */}
      {order.shipping_address?.phone && (
        <div className="text-gray-900 dark:text-white">{t('tel')}: {order.shipping_address.phone}</div>
      )}
    </address>
  </CardContent>
</Card>
</div>
</div>

      {/* Modals */}
      <UploadVoucherModal
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          refreshOrder(); // 老王我改成手动刷新数据，不刷新页面
        }}
        orderId={orderId}
        initialVouchers={zgarOrder.payment_voucher_url ? zgarOrder.payment_voucher_url.split(",").filter(Boolean) : []}
      />

      {/* 老王我用新的唛头管理模态框 */}
      <PackingRequirementsModal
        show={showPackingRequirements}
        onHide={() => {
          setShowPackingRequirements(false);
          refreshOrder(); // 老王我改成手动刷新数据，不刷新页面
        }}
        orderId={orderId}
        order={order}
        initialData={shippingMarks}
      />

      {/* 老王我添加编辑收货地址模态框 */}
      <EditShippingAddressModal
        show={showEditAddress}
        onHide={() => setShowEditAddress(false)}
        orderId={orderId}
        address={order.shipping_address || null}
        onAddressUpdated={refreshOrder}
      />
    </div>
    </>
  );
}
