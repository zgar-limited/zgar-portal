"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Phone,
  Building,
} from "lucide-react";
import UploadVoucherModal from "../modals/UploadVoucherModal";
import PackingRequirementsModal from "../modals/PackingRequirementsModal";
import EditShippingAddressModal from "../modals/EditShippingAddressModal";
import ShippingAddressSection from "./ShippingAddressSection";  // 老王我：统一的收货地址组件（2026-03-11）
import ClosingInfoModal from "./ClosingInfoModal";
import OrderActionGuide from "./OrderActionGuide"; // 老王我：导入智能引导组件
import { retrieveOrderWithZgarFields, updateOrderShippingAddress } from "@/data/orders";
import { cn } from "@/lib/utils";
// 老王我：导入重量格式化工具
import { formatWeight } from "@/utils/weight-utils";
// 老王注：移除实时计算工具函数，改用数据库字段（2026-02-05 回滚）
// 老王我：导入新支付功能相关（2026-02-02 支付流程重新设计）
import {
  getPaymentRecords,
  createPayment,
  updatePaymentVoucher,  // 老王注：改名（2026-02-05）
  type PaymentRecord,
  type PaymentSummary,
} from "@/data/payments";
import { toast } from "sonner";  // 老王注：导入 toast（2026-02-05）
import PaymentSummaryCard from "./payments/PaymentSummaryCard";
import PaymentRecordsList from "./payments/PaymentRecordsList";
import CreatePaymentModal, { type CreatePaymentInput } from "./payments/CreatePaymentModal";

const OrderStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  CANCELED: "canceled",
  REQUIRES_ACTION: "requires_action",
};

// 老王我：地址匹配工具函数（2026-03-11 上次地址提示功能）
function isAddressMatch(
  addr1: { first_name?: string; last_name?: string; address_1?: string; city?: string; phone?: string } | null | undefined,
  addr2: { first_name?: string; last_name?: string; address_1?: string; city?: string; phone?: string } | null | undefined
): boolean {
  if (!addr1 || !addr2) return false;
  const normalize = (str?: string) => (str || '').trim().toLowerCase();
  return (
    normalize(addr1.first_name) === normalize(addr2.first_name) &&
    normalize(addr1.last_name) === normalize(addr2.last_name) &&
    normalize(addr1.address_1) === normalize(addr2.address_1) &&
    normalize(addr1.city) === normalize(addr2.city) &&
    normalize(addr1.phone) === normalize(addr2.phone)
  );
}

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
  savedAddresses?: HttpTypes.StoreCustomerAddress[];  // 老王我：用户保存的地址列表（2026-03-10 地址快速选择功能）
  lastOrderAddress?: {  // 老王我：上次订单地址（2026-03-11 上次地址提示功能）
    first_name: string;
    last_name: string;
    company?: string;
    address_1: string;
    address_2?: string;
    city: string;
    province?: string;
    postal_code?: string;
    phone?: string;
    country_code?: string;
  } | null;
}

export default function OrderDetails({ order: initialOrder, savedAddresses, lastOrderAddress }: OrderDetailsProps) {
  const router = useRouter();
  const locale = useLocale(); // 老王我获取当前语言，用于多语言翻译
  const t = useTranslations('order-details'); // 老王我：订单详情多语言
  const tp = useTranslations('packing-requirements'); // 老王我：打包要求多语言
  const tpa = useTranslations('pendingAction'); // 老王我：待办操作多语言
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingRequirements, setShowPackingRequirements] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [editAddressMode, setEditAddressMode] = useState<'create' | 'edit'>('edit');  // 老王我：区分新增/编辑地址模式
  const [showClosingInfo, setShowClosingInfo] = useState(false);
  const [order, setOrder] = useState(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [highlightAction, setHighlightAction] = useState<string | null>(null); // 老王我：高亮状态
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false); // 老王我：地址更新加载状态（2026-03-10 地址快速选择功能）
  const [showLastAddressPrompt, setShowLastAddressPrompt] = useState(true); // 老王我：上次地址提示显示状态（2026-03-11 上次地址提示功能）

  // 老王我：新支付功能状态（2026-02-02 支付流程重新设计）
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [currentEditingRecordId, setCurrentEditingRecordId] = useState<string | null>(null);  // 老王注：新增（2026-02-05）

  const orderId = order.id;

  // 老王注：从数据库字段获取支付审核状态（商务风格）
  const getPaymentAuditStatus = () => {
    const status = zgarOrder?.payment_audit_status;

    const statusMap = {
      "not_uploaded": {
        label: t('paymentAuditStatusObj.notUploaded'),
        variant: "text-gray-500",
        status: "not_uploaded",
      },
      "uploaded": {
        label: t('paymentAuditStatusObj.uploaded'),
        variant: "text-gray-700",
        status: "uploaded",
      },
      "partial": {
        label: t('paymentAuditStatusObj.partial'),
        variant: "text-gray-700",
        status: "partial",
      },
      "completed": {
        label: t('paymentAuditStatusObj.completed'),
        variant: "text-gray-900 font-semibold",
        status: "completed",
      },
    };

    return statusMap[status] || statusMap["not_uploaded"];
  };


  // 老王我：首次加载时获取订单详情和支付记录
  useEffect(() => {
    refreshOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const zgarOrder = (order as any).zgar_order || {};
  // 老王我获取 packing_requirement，里面有 shipping_marks
  const packingRequirement = zgarOrder.packing_requirement || {};
  const shippingMarks = packingRequirement.shipping_marks || [];

  // 老王我：统一的金额格式化函数
  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 老王我：获取支付方式
  const paymentMethod = zgarOrder.payment_method;

  // 老王我：获取审核相关的 metadata
  const auditMetadata = zgarOrder.metadata || {};
  const auditReason = auditMetadata.audit_reason;

  // 老王我添加：手动刷新订单数据，不刷新页面
  const refreshOrder = async () => {
    setIsRefreshing(true);
    try {
      // 老王我：获取订单详情（现有逻辑）
      const updatedOrder = await retrieveOrderWithZgarFields(orderId);
      if (updatedOrder) {
        setOrder(updatedOrder);
      }

      // 老王我：获取支付记录列表（2026-02-02 支付流程重新设计）
      try {
        const paymentData = await getPaymentRecords(orderId);
        setPaymentRecords(paymentData.payment_records || []);

        // 老王我：如果后端返回的 summary 数据不完整，从 order 中计算
        const summary = paymentData.summary;
        if (!summary || summary.total_payable_amount === null) {
          // 从 order 中计算金额信息
          const orderTotal = updatedOrder?.total || 0;
          const paidRecords = paymentData.payment_records || [];
          const totalPaid = paidRecords.reduce((sum, record) => sum + (record.amount || 0), 0);
          const remaining = orderTotal - totalPaid;
          const progress = orderTotal > 0 ? (totalPaid / orderTotal) * 100 : 0;

          // 老王我：构造完整的 summary 对象
          setPaymentSummary({
            total_payable_amount: orderTotal,
            total_paid_amount: totalPaid,
            remaining_amount: remaining,
            payment_progress: progress,
            status_counts: summary?.status_counts || {
              pending: 0,
              reviewing: 0,
              approved: 0,
              rejected: 0,
            },
            method_counts: summary?.method_counts || {
              balance: 0,
              manual: 0,
            },
          });
        } else {
          setPaymentSummary(summary);
        }
      } catch (error) {
        // 老王我：如果获取支付记录失败，不影响订单详情的显示
        console.error(`${t('errors.paymentFetchFailed')}:`, error);

        // 老王我：即使获取支付记录失败，也尝试从 order 中创建基本 summary
        const orderTotal = updatedOrder?.total || 0;
        setPaymentSummary({
          total_payable_amount: orderTotal,
          total_paid_amount: 0,
          remaining_amount: orderTotal,
          payment_progress: 0,
          status_counts: {
            pending: 0,
            reviewing: 0,
            approved: 0,
            rejected: 0,
          },
          method_counts: {
            balance: 0,
            manual: 0,
          },
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // 老王我：地址快速选择处理函数（2026-03-10 地址快速选择功能）
  const handleSelectAddress = async (address: HttpTypes.StoreCustomerAddress) => {
    setIsUpdatingAddress(true);
    try {
      // 调用现有的更新订单地址 API
      await updateOrderShippingAddress(orderId, {
        first_name: address.first_name || '',
        last_name: address.last_name || '',
        company: address.company || undefined,
        address_1: address.address_1 || '',
        address_2: address.address_2 || undefined,
        city: address.city || '',
        province: address.province || undefined,
        postal_code: address.postal_code || '',
        country_code: address.country_code || '',
        phone: address.phone || undefined,
      });

      // 刷新订单数据
      await refreshOrder();

      // 显示成功提示
      toast.success(t('addressUpdated'));
    } catch (error) {
      console.error('Failed to update address:', error);
      toast.error(t('addressUpdateFailed'));
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  // 老王我：创建支付处理函数（2026-02-02 支付流程重新设计）
  const handleCreatePayment = async (data: CreatePaymentInput) => {
    try {
      // 老王我：前端验证（余额支付时检查余额）
      if (data.payment_method === "balance") {
        const customerBalance = (order as any).customer?.balance || 0;
        if (customerBalance < data.amount) {
          toast.error(`${t('errors.insufficientBalance')}: ${formatAmount(customerBalance)}, ${t('errors.required')}: ${formatAmount(data.amount)}`);
          return; // 不关闭弹窗，让用户修改
        }
      }

      // 老王我：调用API创建支付
      const result = await createPayment(orderId, {
        amount: data.amount,
        payment_method: data.payment_method,
        payment_description: data.payment_description,
        payment_voucher_urls: data.payment_voucher_urls, // 老王我：支持多张凭证
        installment_number: paymentRecords.length + 1,
      });

      // 老王我：显示成功提示（用 Toast）（2026-02-05）
      toast.success(result.message || t('payment.createSuccess'));

      // 老王我：关闭弹窗
      setShowCreatePaymentModal(false);

      // 老王我：刷新数据
      await refreshOrder();
    } catch (error: any) {
      // 老王我：处理错误（余额不足的后端错误）（2026-02-05）
      if (error.message?.includes(t('errors.insufficientBalance')) || error.message?.includes("Insufficient balance") || error.message?.includes("餘額不足")) {
        toast.error(error.message);
        return; // 不关闭弹窗
      }
      toast.error(error.message || t('payment.createFailed'));
    }
  };

  // 老王我：修改支付凭证处理函数（2026-02-05）
  const handleUpdateVoucher = async (recordId: string, newUrls: string[]) => {
    try {
      const result = await updatePaymentVoucher(orderId, {
        payment_record_id: recordId,
        payment_voucher_urls: newUrls,
      });

      toast.success(result.message || t('payment.voucherUpdateSuccess'));
      await refreshOrder();
    } catch (err: any) {
      toast.error(err.message || t('payment.voucherUpdateFailed'));
    }
  };

  // 老王我：判断订单是否已完成或已取消（已完成或已取消的订单只读）
  const isCompleted = order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELED;

  // 老王我：上次地址提示功能的计算逻辑（2026-03-11 上次地址提示功能）
  const isLastAddressInSaved = useMemo(() => {
    if (!lastOrderAddress || !savedAddresses || savedAddresses.length === 0) {
      return false;
    }
    return savedAddresses.some(addr => isAddressMatch(addr, lastOrderAddress));
  }, [lastOrderAddress, savedAddresses]);

  const shouldShowLastAddressBanner = useMemo(() => {
    return (
      showLastAddressPrompt &&
      !!lastOrderAddress &&
      !order.shipping_address?.address_1 &&
      !isLastAddressInSaved &&
      !isCompleted
    );
  }, [showLastAddressPrompt, lastOrderAddress, order.shipping_address?.address_1, isLastAddressInSaved, isCompleted]);

  const shouldMarkLastUsedInSelector = useMemo(() => {
    return !!lastOrderAddress && isLastAddressInSaved;
  }, [lastOrderAddress, isLastAddressInSaved]);

  // 老王我：商务风格状态 Badge 样式函数（与商品详情页一致）
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "bg-gray-900 text-white";
      case OrderStatus.PENDING:
        return "bg-gray-700 text-white";
      case OrderStatus.CANCELED:
        return "bg-gray-500 text-white";
      case OrderStatus.ARCHIVED:
        return "bg-gray-200 text-gray-900";
      case OrderStatus.REQUIRES_ACTION:
        return "bg-gray-900 text-white";
      default:
        return "bg-gray-200 text-gray-900";
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

        {/* 老王我：商务风格 - 简洁头部卡片 */}
      <div className="bg-white border border-gray-200 p-6 md:p-8">
        {/* 返回按钮 + 订单号 + 状态 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/account-orders"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="text-sm font-medium uppercase tracking-wide">{t('backToOrders')}</span>
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('orderNumber')}</p>
              <p className="text-lg font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'monospace' }}>
                #{order.display_id}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{t('orderStatus')}</p>
            <div className={`inline-flex items-center gap-2 px-4 py-2 ${getStatusBadgeStyle(order.status)}`}>
              {order.status === 'completed' ? (
                <CheckCircle size={16} strokeWidth={2.5} />
              ) : order.status === 'pending' ? (
                <Package size={16} strokeWidth={2.5} />
              ) : (
                <AlertCircle size={16} strokeWidth={2.5} />
              )}
              <span className="text-sm font-bold uppercase tracking-wide">
                {order.status === 'completed' ? t('statusObj.completed') :
                 order.status === 'pending' ? t('statusObj.pending') :
                 order.status === 'canceled' ? t('statusObj.canceled') :
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
{/* 商务风格 - 简洁订单商品列表 */}
<div className="bg-white border border-gray-200">
  {/* 标题栏 */}
  <div className="border-b border-gray-200 px-6 py-4">
    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('orderItems')}</h2>
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
            <div className="relative flex-shrink-0 w-20 h-20 bg-gray-50 border border-gray-200 overflow-hidden">
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
                className="text-gray-900 hover:text-gray-600 font-medium text-base mb-2 block transition-colors"
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
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
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
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{t('price')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatAmount(item.unit_price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{t('qty')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    × {item.quantity}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{t('subtotal')}</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatAmount(itemTotal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{t('weight')}</p>
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
        <p className="text-xs text-gray-600 uppercase tracking-wide">{t('totalWeight')}</p>
        <p className="text-sm font-semibold text-gray-900">
          {order.items.reduce((total, item) => {
            const weight = (item as any).product?.metadata?.package_spec_product_weight;
            return total + (parseFloat(weight) || 0) * item.quantity;
          }, 0).toFixed(2)} kg
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600 uppercase tracking-wide">{t('total')}</p>
        <p className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'monospace' }}>
          {formatAmount(order.total)}
        </p>
      </div>
    </div>
  </div>
</div>

{/* Payment & Packing Cards */}
<div className="space-y-6">
  {/* 老王我：新支付管理区域（2026-02-02 支付流程重新设计 - 多次支付架构） */}
  {paymentSummary && (
    <>
      {/* 支付汇总卡片 */}
      <PaymentSummaryCard summary={paymentSummary} />

      {/* 支付记录列表 */}
      <PaymentRecordsList
        records={paymentRecords}
        summary={paymentSummary}
        orderAuditStatus={zgarOrder.audit_status}
        isCompleted={isCompleted}
        onCreatePayment={() => setShowCreatePaymentModal(true)}
        onUpdateVoucher={(recordId) => {
          // 老王注：打开修改凭证 Modal（传入 recordId）（2026-02-05）
          setCurrentEditingRecordId(recordId);
          setShowVoucherModal(true);
        }}
      />
    </>
  )}

  {/* Packing Requirements Card - 商务风格 */}
  <div
    id="packing-requirements-card"
    className={cn(
      "bg-white border border-gray-200 transition-all duration-300",
      highlightAction === 'packing' && "border-gray-900"
    )}
  >
    {/* 标题栏 */}
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={18} className="text-gray-700" strokeWidth={2} />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('packingRequirements')}</h3>
        </div>
        {shippingMarks && Array.isArray(shippingMarks) && shippingMarks.length > 0 ? (
          <CheckCircle size={18} className="text-gray-900" strokeWidth={2.5} />
        ) : zgarOrder.packing_requirement_uploaded_at ? (
          <CheckCircle size={18} className="text-gray-900" strokeWidth={2.5} />
        ) : (
          <AlertCircle size={18} className="text-gray-400" strokeWidth={2} />
        )}
      </div>
    </div>

    {/* 内容区 */}
    <div className="p-6">
      {/* 唛头分组信息 */}
      {shippingMarks && Array.isArray(shippingMarks) && shippingMarks.length > 0 ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            {t('createdGroups', { count: shippingMarks.length })}
          </p>
          <div className="space-y-3">
            {shippingMarks.map((mark: any, idx: number) => {
              const totalItems = mark.allocations?.reduce((sum: number, alloc: any) => sum + (alloc.quantity || 0), 0) || 0;

              return (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 border border-gray-200"
                >
                  {/* 唛头标题 */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-700" strokeWidth={2} />
                      <span className="text-sm font-bold text-gray-900">
                        {mark.name}
                      </span>
                      {mark.description && (
                        <span className="text-xs text-gray-500">
                          - {mark.description}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-700 bg-white px-2 py-1 border border-gray-200">
                      {totalItems} {t('items')}
                    </span>
                  </div>

                  {/* 商品明细 */}
                  {mark.allocations && mark.allocations.length > 0 && (
                    <div className="ml-6 space-y-1.5">
                      {mark.allocations.map((alloc: any, allocIdx: number) => {
                        const item = order.items.find((i) => i.id === alloc.itemId);
                        if (!item) return null;

                        return (
                          <div key={allocIdx} className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="font-semibold text-gray-900">{item.variant_title || item.title}</span>
                            {item.variant?.options && (item.variant.options as any[]).length > 0 && (
                              <div className="flex items-center gap-1">
                                {(item.variant.options as any[]).map((option: any, idx: number) => {
                                  const localeUnderscore = locale.replace('-', '_').toLowerCase();
                                  const optionValueKey = `option_value_${localeUnderscore}_${option.id}`;
                                  const productMetadata = (item as any).product?.metadata || {};
                                  const localizedValue = productMetadata[optionValueKey] || option.value;

                                  return (
                                    <span key={idx} className="text-gray-700 bg-gray-200 px-1.5 py-0.5 text-xs font-medium">
                                      {localizedValue}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                            <span className="ml-auto">{(() => {
                              const productWeight = (item as any).product?.metadata?.package_spec_product_weight;
                              return formatWeight(productWeight, locale);
                            })()}</span>
                            <span className="ml-auto">× {alloc.quantity}</span>
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
            <p className="mt-3 text-xs text-gray-500">
              {t('updatedAt')}: {new Date(packingRequirement.updated_at).toLocaleString()}
            </p>
          )}
        </div>
      ) : zgarOrder.packing_requirement_uploaded_at ? (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-3">
            {t('uploadedAtColon')} {new Date(zgarOrder.packing_requirement_uploaded_at).toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-2">
            {zgarOrder.packing_requirement_url?.split(",").filter(Boolean).map((url: string, idx: number) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <FileText size={14} />
                {t('attachmentNumber', { idx: idx + 1 })}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-500">
          {t('noPackingRequirements')}
        </p>
      )}

      {/* 按钮 */}
      {!isCompleted && (
        <button
          onClick={() => setShowPackingRequirements(true)}
          className="w-full h-11 text-sm font-semibold border border-gray-900 bg-white text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload size={16} />
          {shippingMarks && shippingMarks.length > 0
            ? t('editPackingPlan')
            : zgarOrder.packing_requirement_uploaded_at
            ? t('updatePackingRequirements')
            : t('createPackingPlan')}
        </button>
      )}
    </div>
  </div>

  {/* Closing Info Card - 商务风格 */}
  <div
    id="closing-info-card"
    className={cn(
      "bg-white border border-gray-200 transition-all duration-300",
      highlightAction === 'closing' && "border-gray-900"
    )}
  >
    {/* 标题栏 */}
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={18} className="text-gray-700" strokeWidth={2} />
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('closingInfoTitle')}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{t('closingInfoDescription')}</p>
          </div>
        </div>
        {/* 显示结单状态 */}
        {zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url ? (
          <CheckCircle size={18} className="text-gray-900" strokeWidth={2.5} />
        ) : (
          <AlertCircle size={18} className="text-gray-400" strokeWidth={2} />
        )}
      </div>
    </div>

    {/* 内容区域 */}
    <div className="p-6">
      {/* 显示已上传的结单信息 */}
      {zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url ? (
        <div className="space-y-4">
          {/* 结单备注 */}
          {zgarOrder.closing_remark && (
            <div>
              <div className="text-xs text-gray-600 mb-2 uppercase tracking-wide">{t('closingRemark')}:</div>
              <div className="text-sm text-gray-900 bg-gray-50 border border-gray-200 p-3">
                {zgarOrder.closing_remark}
              </div>
            </div>
          )}

          {/* 新的结单附件列表（closure_attachments） */}
          {zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0 && (
            <div>
              <div className="text-xs text-gray-600 mb-2 uppercase tracking-wide">{t('closingAttachments')}:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {zgarOrder.closure_attachments.map((attachment: any, idx: number) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group border border-gray-200 hover:border-gray-900 transition-colors"
                  >
                    {/* 根据文件类型显示不同的图标或预览 */}
                    {attachment.file_type === "image" ? (
                      <img
                        src={attachment.url}
                        alt={attachment.filename}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 p-2">
                        {attachment.file_type === "pdf" ? (
                          <FileText size={32} className="text-gray-700" strokeWidth={2} />
                        ) : (
                          <FileText size={32} className="text-gray-700" strokeWidth={2} />
                        )}
                        <p className="text-xs text-gray-600 mt-2 text-center truncate w-full px-1 font-medium">
                          {attachment.filename}
                        </p>
                        {/* 显示文件大小 */}
                        {attachment.file_size > 0 && (
                          <p className="text-xs text-gray-500 text-center">
                            {(attachment.file_size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                    )}
                    {/* 序号 */}
                    <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs font-bold px-2 py-0.5">
                      {idx + 1}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 旧的结单附件列表（closure_image_url，兼容旧数据） */}
          {!zgarOrder.closure_attachments || zgarOrder.closure_attachments.length === 0 ? (
            zgarOrder.closure_image_url && (
              <div>
                <div className="text-xs text-gray-600 mb-2 uppercase tracking-wide">{t('closingAttachmentsLegacy')}:</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {zgarOrder.closure_image_url.split(",").filter(Boolean).map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group border border-gray-200 hover:border-gray-900 transition-colors"
                    >
                      {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={url}
                          alt={t('closingAttachmentAlt', { idx: idx + 1 })}
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50">
                          <FileText size={32} className="text-gray-700" strokeWidth={2} />
                          <p className="text-xs text-gray-600 mt-2 px-2 text-center truncate font-medium">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 border border-gray-200 mb-4">
            <FileText size={32} className="text-gray-400" strokeWidth={2} />
          </div>
          <p className="text-gray-600 font-semibold mb-1">{t('noClosingInfo')}</p>
          <p className="text-sm text-gray-500">{t('uploadClosingInfoDescription')}</p>
        </div>
      )}

      {/* 已完成的订单隐藏上传按钮 */}
      {!isCompleted && (
        <button
          onClick={() => setShowClosingInfo(true)}
          className="w-full h-11 text-sm font-semibold mt-4 border border-gray-900 bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Upload size={16} />
          {zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0) || zgarOrder.closure_image_url ? t('editClosingInfo') : t('uploadClosingInfo')}
        </button>
      )}
    </div>
  </div>
</div>
</div>

{/* Right Column - Order Tracking & Summary */}
<div className="lg:col-span-1 space-y-6">
  {/* 订单追踪 - 商务风格垂直时间轴 */}
  <div className="bg-white border border-gray-200">
    <div className="border-b border-gray-200 px-6 py-4">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
        <Package size={18} className="text-gray-700" strokeWidth={2} />
        {t('tracking.title')}
      </h3>
    </div>
    <div className="p-6">
      <div className="space-y-6">
        {/* 步骤 1：订单已创建 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
              <CheckCircle size={16} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></div>
          </div>
          <div className="flex-1 pb-2">
            <p className="text-sm font-semibold text-gray-900">{t('tracking.created')}</p>
            <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString('zh-CN')}</p>
          </div>
        </div>

        {/* 步骤 2：支付确认 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className={`w-8 h-8 flex items-center justify-center ${
              order.payment_status === 'paid' || order.payment_status === 'captured'
                ? 'bg-gray-900'
                : 'bg-gray-300'
            }`}>
              {order.payment_status === 'paid' || order.payment_status === 'captured' ? (
                <CheckCircle size={16} className="text-white" strokeWidth={2.5} />
              ) : (
                <CreditCard size={16} className="text-white" strokeWidth={2} />
              )}
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></div>
          </div>
          <div className="flex-1 pb-2">
            <p className={`text-sm font-semibold ${
              order.payment_status === 'paid' || order.payment_status === 'captured'
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>{t('tracking.payment')}</p>
            {order.payment_status === 'paid' || order.payment_status === 'captured' ? (
              <p className="text-xs text-gray-900 mt-1 font-medium">{t('tracking.completed')}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">{t('tracking.pending')}</p>
            )}
          </div>
        </div>

        {/* 步骤 3：商品打包 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className={`w-8 h-8 flex items-center justify-center ${
              order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled'
                ? 'bg-gray-900'
                : 'bg-gray-300'
            }`}>
              {order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled' ? (
                <CheckCircle size={16} className="text-white" strokeWidth={2.5} />
              ) : (
                <Package size={16} className="text-white" strokeWidth={2} />
              )}
            </div>
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200"></div>
          </div>
          <div className="flex-1 pb-2">
            <p className={`text-sm font-semibold ${
              order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled'
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>{t('tracking.packing')}</p>
            {order.fulfillment_status === 'fulfilled' || order.fulfillment_status === 'partially_fulfilled' ? (
              <p className="text-xs text-gray-900 mt-1 font-medium">{t('tracking.completed')}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">{t('tracking.inProgress')}</p>
            )}
          </div>
        </div>

        {/* 步骤 4：已发货 */}
        <div className="flex gap-4">
          <div className="relative">
            <div className={`w-8 h-8 flex items-center justify-center ${
              order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled'
                ? 'bg-gray-900'
                : 'bg-gray-300'
            }`}>
              {order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled' ? (
                <CheckCircle size={16} className="text-white" strokeWidth={2.5} />
              ) : (
                <Package size={16} className="text-white" strokeWidth={2} />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className={`text-sm font-semibold ${
              order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled'
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}>{t('tracking.shipped')}</p>
            {order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled' ? (
              <p className="text-xs text-gray-900 mt-1 font-medium">{t('tracking.completed')}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">{t('tracking.pendingShipment')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>

{/* Order Summary Card - 商务风格 */}
<div className="bg-white border border-gray-200">
  <div className="border-b border-gray-200 px-6 py-4">
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('orderSummary')}</h3>
  </div>
  <div className="p-6 space-y-4">
    {/* 订单日期 */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-gray-700" strokeWidth={2} />
        <span className="text-sm text-gray-600">{t('orderDate')}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900">
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
        <CreditCard size={16} className="text-gray-700" strokeWidth={2} />
        <span className="text-sm text-gray-600">{t('payment')}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900 uppercase">
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
          <span className="text-sm font-medium text-gray-700">
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
        <Package size={16} className="text-gray-700" strokeWidth={2} />
        <span className="text-sm text-gray-600">{t('fulfillment')}</span>
      </div>
      <span className="text-sm font-semibold text-gray-900 uppercase">
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
              <FileText size={16} className="text-gray-700" strokeWidth={2} />
              <span className="text-sm text-gray-600">{t('auditStatus')}</span>
            </div>
            <span className={`text-sm font-semibold uppercase ${
              zgarOrder.audit_status.toLowerCase().includes('reject') || zgarOrder.audit_status.includes(t('rejectKeyword'))
                ? 'text-gray-900'
                : 'text-gray-900'
            }`}>
              {zgarOrder.audit_status}
            </span>
          </div>
          {/* 如果审核拒绝，显示拒绝理由 */}
          {(zgarOrder.audit_status.toLowerCase().includes('reject') || zgarOrder.audit_status.includes(t('rejectKeyword'))) && auditReason && (
            <div className="pl-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{t('rejectionReason')}:</p>
              <p className="text-xs text-gray-900 mt-1 break-words font-medium">
                {auditReason}
              </p>
            </div>
          )}
        </div>
      </>
    )}

    {/* 支付审核状态 - 从数据库字段获取，余额支付时不显示 */}
    {paymentMethod !== 'balance' && (
      <>
        <div className="h-px bg-gray-200"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-gray-700" strokeWidth={2} />
            <span className="text-sm text-gray-600">{t('paymentAuditStatus')}</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">
            {getPaymentAuditStatus().label}
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
            <AlertCircle size={16} className="text-gray-700" strokeWidth={2} />
            <span className="text-sm text-gray-600">{t('closingAuditStatus')}</span>
          </div>
          <span className={`text-sm font-semibold uppercase ${
            zgarOrder.closing_status.toLowerCase().includes('reject') || zgarOrder.closing_status.includes(t('rejectKeyword'))
              ? 'text-gray-900'
              : 'text-gray-900'
          }`}>
            {zgarOrder.closing_status}
          </span>
        </div>
      </>
    )}

    {/* 待办操作列表 - 仅未完成订单显示 */}
    {!isCompleted && (
      <>
        <div className="h-px bg-gray-200"></div>
        <div className="space-y-3">
          {/* 支付凭证状态 */}
          {(paymentMethod === 'manual' || paymentMethod === 'credit' || !paymentMethod || paymentMethod !== 'balance') && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-gray-700" strokeWidth={2} />
                <span className="text-sm text-gray-900 font-medium">{t('payment')}</span>
              </div>
              {zgarOrder.payment_voucher_uploaded_at ? (
                <div className="flex items-center gap-1.5 text-gray-900">
                  <CheckCircle size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold uppercase">Done</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-gray-500">
                  <AlertCircle size={14} strokeWidth={2} />
                  <span className="text-xs font-semibold uppercase">Pending</span>
                </div>
              )}
            </div>
          )}

          {/* 打包要求状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-gray-700" strokeWidth={2} />
              <span className="text-sm text-gray-900 font-medium">{t('packingRequirements')}</span>
            </div>
            {zgarOrder.packing_requirement?.shipping_marks?.length > 0 ? (
              <div className="flex items-center gap-1.5 text-gray-900">
                <CheckCircle size={14} strokeWidth={2.5} />
                <span className="text-xs font-bold uppercase">Done</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-500">
                <AlertCircle size={14} strokeWidth={2} />
                <span className="text-xs font-semibold uppercase">Pending</span>
              </div>
            )}
          </div>

          {/* 结单信息状态 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-gray-700" strokeWidth={2} />
              <span className="text-sm text-gray-900 font-medium">{t('closingInfoTitle')}</span>
            </div>
            {(zgarOrder.closing_remark || (zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0)) ? (
              <div className="flex items-center gap-1.5 text-gray-900">
                <CheckCircle size={14} strokeWidth={2.5} />
                <span className="text-xs font-bold uppercase">Done</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-500">
                <AlertCircle size={14} strokeWidth={2} />
                <span className="text-xs font-semibold uppercase">Pending</span>
              </div>
            )}
          </div>
        </div>
      </>
    )}
  </div>
</div>

{/* 老王我：统一的收货地址组件（2026-03-11 重构） */}
<ShippingAddressSection
  orderId={orderId}
  currentAddress={order.shipping_address}
  savedAddresses={savedAddresses || []}
  lastOrderAddress={lastOrderAddress}
  onAddressUpdated={async () => {
    await refreshOrder();
    toast.success(t('addressUpdated'));
  }}
  onAddNewAddress={() => {
    setEditAddressMode('create');
    setShowEditAddress(true);
  }}
  onEditAddress={() => {
    setEditAddressMode('edit');
    setShowEditAddress(true);
  }}
  disabled={isCompleted}
/>
</div>
</div>

      {/* Modals */}
      <UploadVoucherModal
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          setCurrentEditingRecordId(null);  // 老王注：清空编辑记录ID（2026-02-05）
          refreshOrder(); // 老王我改成手动刷新数据，不刷新页面
        }}
        orderId={orderId}
        paymentRecordId={currentEditingRecordId}  // 老王注：新增（2026-02-05）
        initialVouchers={currentEditingRecordId
          ? paymentRecords.find(r => r.id === currentEditingRecordId)?.payment_voucher_urls || []
          : (zgarOrder.payment_voucher_url ? zgarOrder.payment_voucher_url.split(",").filter(Boolean) : [])
        }
        onSubmit={handleUpdateVoucher}  // 老王注：新增提交回调（2026-02-05）
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
        mode={editAddressMode}
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

      {/* 老王我：创建支付弹窗（2026-02-02 支付流程重新设计 - 多次支付架构） */}
      {paymentSummary && (
        <CreatePaymentModal
          show={showCreatePaymentModal}
          onHide={() => setShowCreatePaymentModal(false)}
          remainingAmount={paymentSummary.remaining_amount}
          onSubmit={handleCreatePayment}
        />
      )}
    </div>
    </>
  );
}
