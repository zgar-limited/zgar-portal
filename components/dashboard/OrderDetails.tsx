"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Sidebar from "./Sidebar";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import ClosingInfoModal from "./ClosingInfoModal";
import OrderActionGuide from "./OrderActionGuide"; // 老王我：导入智能引导组件
import { retrieveOrderWithZgarFields } from "@/data/orders";
import { cn } from "@/lib/utils";
// 老王我：导入重量格式化工具
import { formatWeight } from "@/utils/weight-utils";

const OrderStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  CANCELED: "canceled",
  REQUIRES_ACTION: "requires_action",
};

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
}

export default function OrderDetails({ order: initialOrder }: OrderDetailsProps) {
  const router = useRouter();
  const locale = useLocale(); // 老王我获取当前语言，用于多语言翻译
  const t = useTranslations('order-details'); // 老王我：订单详情多语言
  const tp = useTranslations('packing-requirements'); // 老王我：打包要求多语言
  const tpa = useTranslations('pendingAction'); // 老王我：待办操作多语言
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingRequirements, setShowPackingRequirements] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showClosingInfo, setShowClosingInfo] = useState(false);
  const [order, setOrder] = useState(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highlightAction, setHighlightAction] = useState<string | null>(null); // 老王我：高亮状态

  const orderId = order.id;

  const zgarOrder = (order as any).zgar_order || {};
  // 老王我获取 packing_requirement，里面有 shipping_marks
  const packingRequirement = zgarOrder.packing_requirement || {};
  const shippingMarks = packingRequirement.shipping_marks || [];

  // 老王我：获取支付方式
  const paymentMethod = zgarOrder.payment_method;

  // 老王我：获取审核相关的 metadata
  const auditMetadata = zgarOrder.metadata || {};
  const auditReason = auditMetadata.audit_reason;

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

  // 老王我：判断订单是否已完成或已取消（已完成或已取消的订单只读）
  const isCompleted = order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELED;

  // 老王我：美化的状态 Badge 样式函数（使用品牌色）
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-brand-pink text-white border-0 shadow-lg";
      case OrderStatus.PENDING:
        return "bg-brand-blue text-white border-0 shadow-lg";
      case OrderStatus.CANCELED:
        return "bg-gray-400 dark:bg-gray-600 text-white border-0 shadow-lg";
      case OrderStatus.ARCHIVED:
        return "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white border-0 shadow-lg";
      case OrderStatus.REQUIRES_ACTION:
        return "bg-brand-gradient text-white border-0 shadow-lg";
      default:
        return "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white border-0 shadow-lg";
    }
  };

  return (
    <>
      {/* 老王我移除外层布局和 Sidebar，因为 layout 已经提供了 */}
      <div className="space-y-6">
        {/* 老王我：智能引导系统 */}
        <OrderActionGuide
          order={order}
          onHighlightChange={setHighlightAction}
        />

        {/* 老王我：Minimalism 风格 - 简洁头部卡片 */}
      <div className="bg-white border border-gray-200 p-6 md:p-8">
        {/* 返回按钮 + 订单号 + 状态 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/account-orders"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium">{t('backToOrders') || '返回订单列表'}</span>
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <p className="text-xs text-gray-500">订单号</p>
              <p className="text-lg font-bold text-gray-900" style={{ fontFamily: 'monospace' }}>
                #{order.display_id}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">订单状态</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusBadgeStyle(order.status)}`}>
              {order.status === 'completed' ? (
                <CheckCircle size={18} />
              ) : order.status === 'pending' ? (
                <Package size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              <span className="text-sm font-bold">
                {order.status === 'completed' ? '已完成' :
                 order.status === 'pending' ? '进行中' :
                 order.status === 'canceled' ? '已取消' :
                 order.status.toUpperCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

{/* Main Content Grid - 左侧订单商品，右侧追踪和信息 */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
{/* Left Column - Order Items */}
<div className="lg:col-span-2 space-y-6">
{/* 老王我：Minimalism 风格 - 简洁订单商品列表 */}
<div className="bg-white border border-gray-200">
  {/* 标题栏 */}
  <div className="border-b border-gray-200 px-6 py-4">
    <h2 className="text-base font-bold text-gray-900">{t('orderItems')}</h2>
  </div>

  {/* 商品列表 */}
  <div className="divide-y divide-gray-200">
    {order.items.map((item, idx) => {
      const productWeight = (item as any).product?.metadata?.package_spec_product_weight;
      const formattedWeight = formatWeight(productWeight, locale);
      const itemTotal = (item.unit_price || 0) * item.quantity;

      return (
        <div key={item.id} className="p-6">
          <div className="flex gap-6">
            {/* 商品图片 - 80x80 小尺寸 */}
            <div className="relative flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
              <Image
                src={item.thumbnail || "https://placehold.co/100"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            {/* 商品信息 */}
            <div className="flex-1 min-w-0">
              {/* 商品标题 */}
              <Link
                href={`/product-detail/${item.variant?.product_id || ""}`}
                className="text-gray-900 hover:text-brand-pink font-medium text-base mb-2 block transition-colors"
              >
                {item.variant_title || item.title}
              </Link>

              {/* 变体选项 - 简洁标签 */}
              {item.variant?.options && (item.variant.options as any[]).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(item.variant.options as any[]).map((option: any, optIdx: number) => {
                    const localeUnderscore = locale.replace('-', '_').toLowerCase();
                    const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
                    const productMetadata = (item as any).product?.metadata || {};
                    const localizedValue = productMetadata[optionValueKey] || option.value;

                    return (
                      <span
                        key={optIdx}
                        className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded"
                      >
                        {localizedValue}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* 数据网格 - 简洁4列布局 */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('price')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    ${item.unit_price?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('qty')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    × {item.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">小计</p>
                  <p className="text-sm font-bold text-brand-pink">
                    ${itemTotal.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">重量</p>
                  <p className="text-sm font-medium text-gray-700">
                    {formattedWeight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    })}
  </div>

  {/* 总计行 */}
  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs text-gray-600">总重量</p>
        <p className="text-sm font-semibold text-gray-900">
          {order.items.reduce((total, item) => {
            const weight = (item as any).product?.metadata?.package_spec_product_weight;
            return total + (parseFloat(weight) || 0) * item.quantity;
          }, 0).toFixed(2)} kg
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">{t('total')}</p>
        <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'monospace' }}>
          ${order.total?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  </div>
</div>

{/* Payment & Packing Cards */}
<div className="space-y-6">
  {/* 老王我：Payment Voucher Card - 余额支付时隐藏整个卡片 */}
  {!isCompleted && paymentMethod !== 'balance' && (
  <Card
    id="payment-voucher-card"
    className={cn(
      highlightAction === 'payment' && "ring-4 ring-brand-pink animate-pulse"
    )}
  >
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
  <Card
    id="packing-requirements-card"
    className={cn(
      highlightAction === 'packing' && "ring-4 ring-brand-pink animate-pulse"
    )}
  >
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
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold">
      {totalItems} {t('items')}
    </span>
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
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium">
                        {localizedValue}
                      </span>
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
{t('uploadedAtColon')} {new Date(zgarOrder.packing_requirement_uploaded_at).toLocaleString()}
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
  {t('attachmentNumber', { idx: idx + 1 })}
</a>
))}
          </div>
        </div>
      ) : (
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 italic">
          {t('noPackingRequirements')}
        </p>
      )}

      {/* 老王我：已完成的订单隐藏编辑按钮 */}
      {!isCompleted && (
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
      )}
    </CardContent>
  </Card>

  {/* 老王我添加：结单信息卡片 */}
  <Card
    id="closing-info-card"
    className={cn(
      highlightAction === 'closing' && "ring-4 ring-brand-pink animate-pulse"
    )}
  >
    <CardContent className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('closingInfoTitle')}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('closingInfoDescription')}</p>
        </div>
        {/* 老王我：显示结单状态 */}
        {zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url ? (
          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
        ) : (
          <AlertCircle size={20} className="text-gray-400 dark:text-gray-600" />
        )}
      </div>

      {/* 老王我：显示已上传的结单信息 */}
      {zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url ? (
        <div className="space-y-4">
          {/* 结单备注 */}
          {zgarOrder.closing_remark && (
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{t('closingRemark')}:</div>
              <div className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded p-3">
                {zgarOrder.closing_remark}
              </div>
            </div>
          )}

          {/* 老王我添加：新的结单附件列表（closure_attachments） */}
          {zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0 && (
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{t('closingAttachments')}:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {zgarOrder.closure_attachments.map((attachment: any, idx: number) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all"
                  >
                    {/* 老王我：根据文件类型显示不同的图标或预览 */}
                    {attachment.file_type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.filename}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-2">
                        {attachment.file_type === "pdf" ? (
                          <FileText size={32} className="text-red-500" />
                        ) : (
                          <FileText size={32} className="text-blue-500" />
                        )}
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center truncate w-full px-1">
                          {attachment.filename}
                        </p>
                        {/* 老王我：显示文件大小 */}
                        {attachment.file_size > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
                            {(attachment.file_size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    )}
                    {/* 序号 */}
                    <div className="absolute top-1.5 left-1.5 bg-gray-900/80 text-white text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {idx + 1}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 老王我：旧的结单附件列表（closure_image_url，兼容旧数据） */}
          {!zgarOrder.closure_attachments || zgarOrder.closure_attachments.length === 0 ? (
            zgarOrder.closure_image_url && (
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{t('closingAttachmentsLegacy')}:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {zgarOrder.closure_image_url.split(",").filter(Boolean).map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={url}
                          alt={t('closingAttachmentAlt', { idx: idx + 1 })}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                          <FileText size={32} className="text-gray-400 dark:text-gray-600" />
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 px-2 text-center truncate">
                            {url.split("/").pop()}
                          </p>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )
          ) : null}
        </div>
      ) : (
        <div className="text-center py-8 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <FileText size={32} className="text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{t('noClosingInfo')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">{t('uploadClosingInfoDescription')}</p>
        </div>
      )}

      {/* 老王我：已完成的订单隐藏上传按钮 */}
      {!isCompleted && (
      <Button
        variant="outline"
        onClick={() => setShowClosingInfo(true)}
        className="w-full h-12 text-base font-semibold mt-4 border-2 border-brand-pink text-gray-900 dark:text-white hover:bg-brand-pink/10 transition-all"
      >
        <Upload size={18} className="mr-2" />
        {zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url ? t('editClosingInfo') : t('uploadClosingInfo')}
      </Button>
      )}
    </CardContent>
  </Card>
</div>
</div>

{/* Right Column - Order Tracking & Summary */}
<div className="lg:col-span-1 space-y-6">
  {/* 老王我：订单追踪 - Minimalism 风格垂直时间轴 */}
  <div className="bg-white border border-gray-200">
    <div className="border-b border-gray-200 px-6 py-4">
      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
        <Package size={18} className="text-brand-pink" />
        订单追踪
      </h3>
    </div>
    <div className="p-6">
      <div className="space-y-6">
        {/* 步骤 1：订单已创建 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-brand-pink border-2 border-white flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></div>
          </div>
          <div className="flex-1 pb-2">
            <p className="text-sm font-semibold text-gray-900">订单已创建</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString('zh-CN')}</p>
          </div>
        </div>

        {/* 步骤 2：支付确认 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
              order.payment_status === 'paid' || order.payment_status === 'captured'
                ? 'bg-brand-pink'
                : 'bg-gray-300'
            }`}>
              {order.payment_status === 'paid' || order.payment_status === 'captured' ? (
                <CheckCircle size={16} className="text-white" />
              ) : (
                <CreditCard size={16} className="text-white" />
              )}
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></div>
          </div>
          <div className="flex-1 pb-2">
            <p className={`text-sm font-semibold ${
              order.payment_status === 'paid' || order.payment_status === 'captured'
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>支付确认</p>
            {order.payment_status === 'paid' || order.payment_status === 'captured' ? (
              <p className="text-xs text-green-600 mt-1">已完成</p>
            ) : (
              <p className="text-xs text-amber-600 mt-1">待处理</p>
            )}
          </div>
        </div>

        {/* 步骤 3：商品打包 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
              order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled'
                ? 'bg-brand-blue'
                : 'bg-gray-300'
            }`}>
              {order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled' ? (
                <CheckCircle size={16} className="text-white" />
              ) : (
                <Package size={16} className="text-white" />
              )}
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></div>
          </div>
          <div className="flex-1 pb-2">
            <p className={`text-sm font-semibold ${
              order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled'
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>商品打包</p>
            {order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled' ? (
              <p className="text-xs text-green-600 mt-1">已完成</p>
            ) : (
              <p className="text-xs text-amber-600 mt-1">进行中</p>
            )}
          </div>
        </div>

        {/* 步骤 4：已发货 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
              order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled'
                ? 'bg-brand-blue'
                : 'bg-gray-300'
            }`}>
              {order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled' ? (
                <CheckCircle size={16} className="text-white" />
              ) : (
                <Package size={16} className="text-white" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-semibold ${
              order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled'
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>已发货</p>
            {order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled' ? (
              <p className="text-xs text-green-600 mt-1">已完成</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">待发货</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

{/* Order Summary Card - Minimalism 风格 */}
<div className="bg-white border border-gray-200">
  <div className="border-b border-gray-200 px-6 py-4">
    <h3 className="text-base font-bold text-gray-900">{t('orderSummary')}</h3>
  </div>
  <div className="p-6 space-y-4">
    {/* 订单日期 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600">{t('orderDate')}</span>
      </div>
      <span className="text-sm font-medium text-gray-900">
        {new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>

    <div className="h-px bg-gray-200"></div>

    {/* 支付状态 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CreditCard size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600">{t('payment')}</span>
      </div>
      <span className="text-sm font-medium text-gray-900 capitalize">
        {order.payment_status}
      </span>
    </div>

    {/* 支付方式 */}
    {zgarOrder.payment_method && (
      <>
        <div className="h-px bg-gray-200"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4" />
            <span className="text-sm text-gray-500">{t('paymentMethod')}</span>
          </div>
          <span className="text-sm text-gray-600">
            {zgarOrder.payment_method === 'balance' ? t('balancePayment') :
             zgarOrder.payment_method === 'points' ? 'Points Payment' :
             zgarOrder.payment_method === 'credit' ? 'Credit Payment' :
             zgarOrder.payment_method === 'manual' ? t('manualTransfer') :
             zgarOrder.payment_method}
          </span>
        </div>
      </>
    )}

    <div className="h-px bg-gray-200"></div>

    {/* 发货状态 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Package size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600">{t('fulfillment')}</span>
      </div>
      <span className="text-sm font-medium text-gray-900 capitalize">
        {order.fulfillment_status}
      </span>
    </div>

    {/* 审核状态 - 如果有的话 */}
    {zgarOrder.audit_status && (
      <>
        <div className="h-px bg-gray-200"></div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-gray-400" />
              <span className="text-sm text-gray-600">{t('auditStatus')}</span>
            </div>
            <span className={`text-sm font-medium capitalize ${
              zgarOrder.audit_status.toLowerCase().includes('reject') || zgarOrder.audit_status.includes('拒绝')
                ? 'text-red-600'
                : 'text-gray-900'
            }`}>
              {zgarOrder.audit_status}
            </span>
          </div>
          {/* 老王我：如果审核拒绝，显示拒绝理由 */}
          {(zgarOrder.audit_status.toLowerCase().includes('reject') || zgarOrder.audit_status.includes('拒绝')) && auditReason && (
            <div className="pl-6">
              <p className="text-xs text-gray-500">{t('rejectionReason')}:</p>
              <p className="text-xs text-red-600 mt-1 break-words">
                {auditReason}
              </p>
            </div>
          )}
        </div>
      </>
    )}

    {/* 支付审核状态 - 如果有的话，余额支付时不显示 */}
    {zgarOrder.payment_audit_status && paymentMethod !== 'balance' && (
      <>
        <div className="h-px bg-gray-200"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{t('paymentAuditStatus')}</span>
          </div>
          <span className={`text-sm font-medium capitalize ${
            zgarOrder.payment_audit_status.toLowerCase().includes('reject') || zgarOrder.payment_audit_status.includes('拒绝')
              ? 'text-red-600'
              : 'text-gray-900'
          }`}>
            {zgarOrder.payment_audit_status}
          </span>
        </div>
      </>
    )}

    {/* 结单审核状态 - 如果有的话 */}
    {zgarOrder.closing_status && (
      <>
        <div className="h-px bg-gray-200"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">{t('closingAuditStatus')}</span>
          </div>
          <span className={`text-sm font-medium capitalize ${
            zgarOrder.closing_status.toLowerCase().includes('reject') || zgarOrder.closing_status.includes('拒绝')
              ? 'text-red-600'
              : 'text-gray-900'
          }`}>
            {zgarOrder.closing_status}
          </span>
        </div>
      </>
    )}

    {/* 老王我：待办操作列表 - 仅未完成订单显示 */}
    {!isCompleted && (
      <>
        <div className="h-px bg-gray-200"></div>
        <div className="space-y-3">
          {/* 支付凭证状态 */}
          {(paymentMethod === 'manual' || paymentMethod === 'credit' || !paymentMethod || paymentMethod !== 'balance') && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-gray-400" />
                <span className="text-sm text-gray-900">{t('payment')}</span>
              </div>
              {zgarOrder.payment_voucher_uploaded_at ? (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle size={14} />
                  <span className="text-xs font-semibold">DONE</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-600">
                  <AlertCircle size={14} />
                  <span className="text-xs font-semibold">PENDING</span>
                </div>
              )}
            </div>
          )}

          {/* 打包要求状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-gray-400" />
              <span className="text-sm text-gray-900">{t('packingRequirements')}</span>
            </div>
            {zgarOrder.packing_requirement?.shipping_marks?.length > 0 ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle size={14} />
                <span className="text-xs font-semibold">DONE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-600">
                <AlertCircle size={14} />
                <span className="text-xs font-semibold">PENDING</span>
              </div>
            )}
          </div>

          {/* 结单信息状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              <span className="text-sm text-gray-900">{t('closingInfoTitle')}</span>
            </div>
            {(zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0)) ? (
              <div className="flex items-center gap-1.5 text-green-600">
                <CheckCircle size={14} />
                <span className="text-xs font-semibold">DONE</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-600">
                <AlertCircle size={14} />
                <span className="text-xs font-semibold">PENDING</span>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
</div>

{/* Shipping Address Card - Minimalism 风格 */}
<div className="bg-white border border-gray-200">
  <div className="border-b border-gray-200 px-6 py-4">
    <div className="flex items-start justify-between">
      <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
        <MapPin size={18} />
        {t('shippingAddress')}
      </h3>
      {/* 老王我：已完成的订单隐藏编辑按钮 */}
      {!isCompleted && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEditAddress(true)}
          className="h-8 px-3 text-blue-600 hover:bg-blue-50 flex-shrink-0"
        >
          <Edit2 size={14} className="mr-1.5" />
          {t('edit')}
        </Button>
      )}
    </div>
  </div>
  <div className="p-6">
    <address className="not-italic text-sm text-gray-600 space-y-1">
      <div className="font-medium text-gray-900">
        {order.shipping_address?.first_name} {order.shipping_address?.last_name}
      </div>
      {order.shipping_address?.company && (
        <div>{order.shipping_address.company}</div>
      )}
      <div>{order.shipping_address?.address_1}</div>
      {order.shipping_address?.address_2 && (
        <div>{order.shipping_address.address_2}</div>
      )}
      <div>
        {order.shipping_address?.city}
        {order.shipping_address?.province && `, ${order.shipping_address.province}`}
        {order.shipping_address?.postal_code && ` ${order.shipping_address.postal_code}`}
      </div>
      {order.shipping_address?.phone && (
        <div className="text-gray-900">{t('tel')}: {order.shipping_address.phone}</div>
      )}
    </address>
  </div>
</div>
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

      {/* 老王我添加：结单信息模态框 */}
      <ClosingInfoModal
        open={showClosingInfo}
        onOpenChange={setShowClosingInfo}
        orderId={orderId}
        onSuccess={refreshOrder}
        // 老王我：根据是否有结单信息判断是新建还是编辑
        mode={zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url ? "update" : "create"}
        // 老王我：编辑模式下传递初始数据
        initialData={
          zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url
            ? {
                closing_remark: zgarOrder.closing_remark,
                closing_attachments: zgarOrder.closure_attachments || [],
              }
            : undefined
        }
      />
    </div>
    </>
  );
}
