"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { HttpTypes } from "@medusajs/types";
import {
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import UploadVoucherModal from "../modals/UploadVoucherModal";
import PackingRequirementsModal from "../modals/PackingRequirementsModal";
import EditShippingAddressModal from "../modals/EditShippingAddressModal";
import ShippingAddressSection from "./ShippingAddressSection";
import ClosingInfoModal from "./ClosingInfoModal";
import { retrieveOrderWithZgarFields } from "@/data/orders";
import { cn } from "@/lib/utils";
import { formatWeight } from "@/utils/weight-utils";
import {
  getPaymentRecords,
  createPayment,
  updatePaymentVoucher,
  type PaymentRecord,
  type PaymentSummary,
} from "@/data/payments";
import { toast } from "sonner";
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

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
  savedAddresses?: HttpTypes.StoreCustomerAddress[];
  lastOrderAddress?: {
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
  customer?: any;
}

export default function OrderDetails({ order: initialOrder, savedAddresses, lastOrderAddress, customer }: OrderDetailsProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('order-details');

  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingRequirements, setShowPackingRequirements] = useState(false);
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [editAddressMode, setEditAddressMode] = useState<'create' | 'edit'>('edit');
  const [showClosingInfo, setShowClosingInfo] = useState(false);
  const [order, setOrder] = useState(initialOrder);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [currentEditingRecordId, setCurrentEditingRecordId] = useState<string | null>(null);

  const orderId = order.id;

  const getPaymentAuditStatus = () => {
    const status = (order as any).zgar_order?.payment_audit_status;
    const statusMap = {
      "not_uploaded": { label: t('paymentAuditStatusObj.notUploaded') },
      "uploaded": { label: t('paymentAuditStatusObj.uploaded') },
      "partial": { label: t('paymentAuditStatusObj.partial') },
      "completed": { label: t('paymentAuditStatusObj.completed') },
    };
    return statusMap[status] || statusMap["not_uploaded"];
  };

  useEffect(() => {
    refreshOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const zgarOrder = (order as any).zgar_order || {};
  console.log('[OrderDetails] zgarOrder:', zgarOrder);
  const packingRequirement = zgarOrder.packing_requirement || {};
  const shippingMarks = packingRequirement.shipping_marks || [];

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  const paymentMethod = zgarOrder.payment_method;

  const refreshOrder = async () => {
    setIsRefreshing(true);
    try {
      const updatedOrder = await retrieveOrderWithZgarFields(orderId);
      if (updatedOrder) setOrder(updatedOrder);

      try {
        const paymentData = await getPaymentRecords(orderId);
        setPaymentRecords(paymentData.payment_records || []);

        const summary = paymentData.summary;
        if (!summary || summary.total_payable_amount === null) {
          const orderTotal = updatedOrder?.total || 0;
          const paidRecords = paymentData.payment_records || [];
          const totalPaid = paidRecords.reduce((sum, record) => sum + (record.amount || 0), 0);
          const remaining = orderTotal - totalPaid;
          const progress = orderTotal > 0 ? (totalPaid / orderTotal) * 100 : 0;

          setPaymentSummary({
            total_payable_amount: orderTotal,
            total_paid_amount: totalPaid,
            remaining_amount: remaining,
            payment_progress: progress,
            status_counts: summary?.status_counts || { pending: 0, reviewing: 0, approved: 0, rejected: 0 },
            method_counts: summary?.method_counts || { balance: 0, manual: 0 },
          });
        } else {
          setPaymentSummary(summary);
        }
      } catch (error) {
        const orderTotal = updatedOrder?.total || 0;
        setPaymentSummary({
          total_payable_amount: orderTotal,
          total_paid_amount: 0,
          remaining_amount: orderTotal,
          payment_progress: 0,
          status_counts: { pending: 0, reviewing: 0, approved: 0, rejected: 0 },
          method_counts: { balance: 0, manual: 0 },
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreatePayment = async (data: CreatePaymentInput) => {
    try {
      if (data.payment_method === "balance") {
        const customerBalance = customer?.zgar_customer?.balance || 0;
        if (customerBalance < data.amount) {
          toast.error(`${t('errors.insufficientBalance')}: ${formatAmount(customerBalance)}, ${t('errors.required')}: ${formatAmount(data.amount)}`);
          return;
        }
      }

      const result = await createPayment(orderId, {
        amount: data.amount,
        payment_method: data.payment_method,
        payment_description: data.payment_description,
        payment_voucher_urls: data.payment_voucher_urls,
        installment_number: paymentRecords.length + 1,
      });

      toast.success(result.message || t('payment.createSuccess'));
      setShowCreatePaymentModal(false);
      await refreshOrder();
    } catch (error: any) {
      if (error.message?.includes(t('errors.insufficientBalance')) || error.message?.includes("Insufficient balance") || error.message?.includes("餘額不足")) {
        toast.error(error.message);
        return;
      }
      toast.error(error.message || t('payment.createFailed'));
    }
  };

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

  const isCompleted = order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELED;

  // 进度步骤 - 手绘盖章风格里程碑
  // 判断审核状态：approved 表示已审核
  const isAudited = zgarOrder.audit_status === 'approved';

  // 判断付款状态：以 medusa order 的 payment_status 为准
  // paid/captured = 已付款, partially_paid = 部分付款, 其他用支付进度判断
  const isPaid = order.payment_status === 'paid' || order.payment_status === 'captured';
  const isPartialPaid = order.payment_status === 'partially_paid' ||
    (!isPaid && paymentSummary && paymentSummary.payment_progress > 0);

  // 判断发货状态
  const isShipped = order.fulfillment_status === 'shipped' || order.fulfillment_status === 'fulfilled';

  // 判断订单完成状态
  const isOrderCompleted = order.status === 'completed';

  // 获取状态标签：已完成显示正向，未完成显示反向
  const getStatusLabel = (key: string, completed: boolean, partial?: boolean) => {
    if (completed) {
      switch (key) {
        case 'audited': return t('tracking.audited');
        case 'payment': return t('tracking.paid');
        case 'shipped': return t('tracking.shipped');
        case 'completed': return t('tracking.orderCompleted');
      }
    } else if (partial) {
      switch (key) {
        case 'payment': return t('tracking.partialPayment');
      }
    }
    // 未完成状态显示反向
    switch (key) {
      case 'audited': return t('tracking.notAudited');
      case 'payment': return t('tracking.notPaid');
      case 'shipped': return t('tracking.notShipped');
      case 'completed': return t('tracking.orderNotCompleted');
    }
    return '';
  };

  const orderSteps = [
    { key: 'audited', completed: isAudited },
    { key: 'payment', completed: isPaid, partial: isPartialPaid && !isPaid },
    { key: 'shipped', completed: isShipped },
    { key: 'completed', completed: isOrderCompleted },
  ].map(step => ({
    ...step,
    label: getStatusLabel(step.key, step.completed, step.partial),
  }));

  // 待办事项
  const pendingActions = useMemo(() => {
    const actions = [];
    if (!isCompleted) {
      if ((paymentMethod === 'manual' || paymentMethod === 'credit' || !paymentMethod || paymentMethod !== 'balance') && !zgarOrder.payment_voucher_uploaded_at) {
        actions.push({ key: 'payment', label: t('uploadPaymentVoucher') });
      }
      if (!zgarOrder.packing_requirement?.shipping_marks?.length && !zgarOrder.packing_requirement_uploaded_at) {
        actions.push({ key: 'packing', label: t('createPackingPlan') });
      }
      // 结单信息被拒绝时也要提示用户重新编辑
      if (zgarOrder.closing_info_status === 'rejected') {
        actions.push({ key: 'closing', label: t('resubmitClosingInfo'), priority: true });
      } else if (!zgarOrder.closing_remark && !(zgarOrder.closure_attachments && zgarOrder.closure_attachments.length > 0)) {
        actions.push({ key: 'closing', label: t('uploadClosingInfo') });
      }
    }
    return actions;
  }, [isCompleted, paymentMethod, zgarOrder, t]);

  const totalWeight = order.items.reduce((total, item) => {
    const weight = (item as any).product?.metadata?.package_spec_product_weight;
    return total + (parseFloat(weight) || 0) * item.quantity;
  }, 0).toFixed(2);

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* 顶部导航 - 极简 */}
        <div className="border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-8 h-14 flex items-center">
            <Link
              href="/account-orders"
              className="text-sm text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              {t('backToOrders')}
            </Link>
          </div>
        </div>

        <main className="max-w-5xl mx-auto px-8 py-12">
          {/* 订单头部 - 关键信息 */}
          <div className="pb-8 mb-12 border-b border-gray-100">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-3xl font-light text-gray-900 mb-2">#{order.id}</h1>
                <div className="text-sm text-gray-400">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-900 mb-1">{formatAmount(order.total)}</div>
                <div className={cn(
                  "text-sm",
                  order.status === 'completed' ? 'text-gray-900' :
                  order.status === 'canceled' ? 'text-red-500' : 'text-gray-400'
                )}>
                  {order.status.toUpperCase()}
                </div>
              </div>
            </div>

            {/* 进度条 - 手绘盖章风格里程碑 */}
            <div className="flex items-center justify-between">
              {orderSteps.map((step, idx) => (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center relative">
                    {/* 手绘盖章 */}
                    <div className={cn(
                      "relative flex items-center justify-center",
                      step.completed && "animate-stamp-in"
                    )}>
                      {step.completed ? (
                        // 已完成 - 手绘印章风格
                        <div className="relative w-10 h-10">
                          {/* 外圈 - 手绘不规则椭圆 */}
                          <div
                            className="absolute inset-0 border-[2.5px] border-emerald-600"
                            style={{
                              borderRadius: '46% 54% 49% 51% / 52% 47% 53% 48%',
                              transform: 'rotate(-5deg)',
                            }}
                          />
                          {/* 内圈 - 略微偏移 */}
                          <div
                            className="absolute inset-1 border-2 border-emerald-500"
                            style={{
                              borderRadius: '52% 48% 51% 49% / 48% 54% 46% 52%',
                              transform: 'rotate(3deg)',
                            }}
                          />
                          {/* 手绘勾选 */}
                          <svg
                            viewBox="0 0 24 24"
                            className="absolute inset-0 m-auto w-5 h-5 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 12.5 L9.5 17 L19 7" style={{ transform: 'rotate(-2deg)' }} />
                          </svg>
                          {/* 墨迹飞溅点 */}
                          <div className="absolute -top-0.5 right-0.5 w-1 h-1 bg-emerald-500 rounded-full opacity-50" />
                          <div className="absolute bottom-0 -left-0.5 w-0.5 h-0.5 bg-emerald-600 rounded-full opacity-40" />
                        </div>
                      ) : step.partial ? (
                        // 部分完成 - 手绘进行中
                        <div className="relative w-10 h-10">
                          {/* 外圈 - 手绘虚线 */}
                          <div
                            className="absolute inset-0 border-[2px] border-dashed border-orange-500"
                            style={{
                              borderRadius: '49% 51% 47% 53% / 50% 46% 54% 50%',
                              animation: 'spin 8s linear infinite',
                            }}
                          />
                          {/* 内部点 */}
                          <div
                            className="absolute inset-0 m-auto w-2.5 h-2.5 bg-orange-500 rounded-full opacity-70"
                            style={{
                              borderRadius: '45% 55% 50% 50%',
                            }}
                          />
                        </div>
                      ) : (
                        // 未完成 - 手绘灰圈
                        <div className="relative w-10 h-10">
                          <div
                            className="absolute inset-0 border-2 border-dashed border-gray-300"
                            style={{
                              borderRadius: '50% 50% 48% 52% / 52% 48% 52% 48%',
                            }}
                          />
                          <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        </div>
                      )}
                    </div>
                    {/* 标签 */}
                    <span className={cn(
                      "mt-2 text-xs font-medium whitespace-nowrap",
                      step.completed
                        ? "text-emerald-700"
                        : step.partial
                          ? "text-orange-600"
                          : "text-gray-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {/* 连接线 - 手绘波浪虚线 */}
                  {idx < orderSteps.length - 1 && (
                    <div className="flex-1 mx-3 relative" style={{ top: '-12px' }}>
                      <div
                        className="h-0.5 w-full"
                        style={{
                          backgroundImage: step.completed
                            ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath d='M0 2 Q 5 1, 10 2 T 20 2' stroke='%2310b981' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`
                            : step.partial
                              ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cpath d='M0 2 Q 5 3, 10 2 T 20 2' stroke='%23f97316' stroke-width='1' stroke-dasharray='3 3' fill='none'/%3E%3C/svg%3E")`
                              : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 4'%3E%3Cline x1='0' y1='2' x2='20' y2='2' stroke='%23d1d5db' stroke-width='1' stroke-dasharray='3 4'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'repeat-x',
                          backgroundSize: '20px 4px',
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 待办操作 - 极简 */}
          {pendingActions.length > 0 && (
            <div className="mb-12 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 uppercase tracking-wide">{t('pendingActions')}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {pendingActions.map((action) => (
                  <button
                    key={action.key}
                    onClick={() => {
                      if (action.key === 'payment') setShowVoucherModal(true);
                      else if (action.key === 'packing') setShowPackingRequirements(true);
                      else if (action.key === 'closing') setShowClosingInfo(true);
                    }}
                    className={cn(
                      "text-sm transition-colors flex items-center gap-1.5 cursor-pointer",
                      action.priority
                        ? "text-red-600 hover:text-red-700 font-medium"
                        : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    {action.priority ? (
                      <AlertCircle size={12} className="text-red-500" />
                    ) : (
                      <ArrowRight size={12} />
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 双栏布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* 主内容 - 3/5 */}
            <div className="lg:col-span-3 space-y-12">
              {/* 订单商品 */}
              <section>
                <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-6">{t('orderItems')}</h2>
                <div className="space-y-0">
                  {order.items.map((item) => {
                    const formattedWeight = formatWeight((item as any).product?.metadata?.package_spec_product_weight, locale);
                    const itemTotal = (item.unit_price || 0) * item.quantity;

                    return (
                      <div key={item.id} className="py-5 border-b border-gray-100 first:pt-0 last:border-b-0">
                        <div className="flex gap-5">
                          <div className="relative w-16 h-16 bg-gray-50 flex-shrink-0">
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
                              className="text-gray-900 hover:text-gray-500 transition-colors"
                            >
                              {item.variant_title || item.title}
                            </Link>
                            <div className="flex items-center gap-5 mt-2 text-sm text-gray-400">
                              <span>{formatAmount(item.unit_price)}</span>
                              <span>×{item.quantity}</span>
                              {formattedWeight && <span>{formattedWeight}</span>}
                              <span className="ml-auto text-gray-900">{formatAmount(itemTotal)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-6 flex items-center justify-between text-sm">
                  <span className="text-gray-400">{totalWeight} kg</span>
                  <span className="text-gray-900 font-medium">{formatAmount(order.total)}</span>
                </div>
              </section>

              {/* 支付 */}
              {paymentSummary && (
                <section>
                  <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-6">Payment</h2>
                  <PaymentSummaryCard summary={paymentSummary} />
                  <div className="mt-6">
                    <PaymentRecordsList
                      records={paymentRecords}
                      summary={paymentSummary}
                      orderAuditStatus={zgarOrder.audit_status}
                      isCompleted={isCompleted}
                      onCreatePayment={() => setShowCreatePaymentModal(true)}
                      onUpdateVoucher={(recordId) => {
                        setCurrentEditingRecordId(recordId);
                        setShowVoucherModal(true);
                      }}
                    />
                  </div>
                </section>
              )}

              {/* 打包要求 */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">{t('packingRequirements')}</h2>
                  {shippingMarks?.length > 0 || zgarOrder.packing_requirement_uploaded_at ? (
                    <CheckCircle size={14} className="text-gray-900" />
                  ) : (
                    <AlertCircle size={14} className="text-gray-300" />
                  )}
                </div>
                {shippingMarks?.length > 0 ? (
                  <div className="space-y-3">
                    {shippingMarks.map((mark: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-900">{mark.name}</span>
                        <span className="text-sm text-gray-400">
                          {mark.allocations?.reduce((sum: number, a: any) => sum + (a.quantity || 0), 0) || 0} {t('items')}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : zgarOrder.packing_requirement_uploaded_at ? (
                  <div className="flex gap-4">
                    {zgarOrder.packing_requirement_url?.split(",").filter(Boolean).map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
                        <ExternalLink size={12} />
                        {t('attachmentNumber', { idx: idx + 1 })}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-300">{t('noPackingRequirements')}</p>
                )}
                {!isCompleted && (
                  <button onClick={() => setShowPackingRequirements(true)}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer">
                    <Upload size={12} />
                    {shippingMarks?.length > 0 ? t('editPackingPlan') : t('createPackingPlan')}
                  </button>
                )}
              </section>

              {/* 结单信息 */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide">{t('closingInfoTitle')}</h2>
                  {zgarOrder.closing_status === 'rejected' ? (
                    <AlertCircle size={14} className="text-red-500" />
                  ) : zgarOrder.closing_remark || zgarOrder.closure_attachments?.items?.length > 0 ? (
                    <CheckCircle size={14} className="text-gray-900" />
                  ) : (
                    <AlertCircle size={14} className="text-gray-300" />
                  )}
                </div>

                {/* 被拒绝时显示警告 */}
                {zgarOrder.closing_status === 'rejected' && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-700 mb-1">
                          {t('closingInfoRejected')}
                        </p>
                        {zgarOrder.closing_remark && (
                          <p className="text-sm text-red-600">
                            {t('rejectionReason')}: {zgarOrder.closing_remark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {zgarOrder.closing_remark && (
                  <p className="text-sm text-gray-600 mb-4">{zgarOrder.closing_remark}</p>
                )}
                {zgarOrder.closure_attachments?.items?.length > 0 && (
                  <div className="flex gap-3">
                    {zgarOrder.closure_attachments.items.map((a: any, idx: number) => (
                      <a key={idx} href={a.url} target="_blank" rel="noopener noreferrer" className="w-16 h-16 bg-gray-50">
                        {a.file_type === "image" ? (
                          <img src={a.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText size={20} className="text-gray-300" />
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
                {!zgarOrder.closing_remark && !zgarOrder.closure_attachments?.items?.length && (
                  <p className="text-sm text-gray-300">{t('noClosingInfo')}</p>
                )}
                {!isCompleted && (
                  <button onClick={() => setShowClosingInfo(true)}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer">
                    <Upload size={12} />
                    {zgarOrder.closing_status === 'rejected' ? t('resubmitClosingInfo') :
                     zgarOrder.closing_remark || zgarOrder.closure_attachments?.items?.length > 0 ? t('editClosingInfo') : t('uploadClosingInfo')}
                  </button>
                )}
              </section>
            </div>

            {/* 侧边栏 - 2/5 */}
            <div className="lg:col-span-2 space-y-12">
              {/* 订单摘要 */}
              <section>
                <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-6">{t('orderSummary')}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('orderDate')}</span>
                    <span className="text-gray-900">{new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </div>
                  {zgarOrder.audit_status && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('auditStatus')}</span>
                      <span className="text-gray-900">{t(`auditStatusObj.${zgarOrder.audit_status}`)}</span>
                    </div>
                  )}
                  {paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('paymentMethod')}</span>
                      <span className="text-gray-900">{paymentMethod === 'balance' ? t('balancePayment') : paymentMethod === 'manual' ? t('manualTransfer') : paymentMethod}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('paymentAuditStatus')}</span>
                    <span className="text-gray-900">{t(`paymentStatusObj.${order.payment_status}`)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('fulfillment')}</span>
                    <span className="text-gray-900">{t(`fulfillmentStatusObj.${order.fulfillment_status}`)}</span>
                  </div>
                </div>
              </section>

              {/* 收货地址 */}
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
        </main>
      </div>

      {/* Modals */}
      <UploadVoucherModal
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          setCurrentEditingRecordId(null);
          refreshOrder();
        }}
        orderId={orderId}
        paymentRecordId={currentEditingRecordId}
        initialVouchers={currentEditingRecordId
          ? paymentRecords.find(r => r.id === currentEditingRecordId)?.payment_voucher_urls || []
          : (zgarOrder.payment_voucher_url ? zgarOrder.payment_voucher_url.split(",").filter(Boolean) : [])
        }
        onSubmit={handleUpdateVoucher}
      />

      <PackingRequirementsModal
        show={showPackingRequirements}
        onHide={() => {
          setShowPackingRequirements(false);
          refreshOrder();
        }}
        orderId={orderId}
        order={order}
        initialData={shippingMarks}
      />

      <EditShippingAddressModal
        show={showEditAddress}
        onHide={() => setShowEditAddress(false)}
        orderId={orderId}
        address={order.shipping_address || null}
        onAddressUpdated={refreshOrder}
        mode={editAddressMode}
      />

      <ClosingInfoModal
        open={showClosingInfo}
        onOpenChange={setShowClosingInfo}
        orderId={orderId}
        onSuccess={refreshOrder}
        mode={zgarOrder.closing_remark || zgarOrder.closure_attachments?.length > 0 ? "update" : "create"}
        initialData={
          zgarOrder.closing_remark || zgarOrder.closure_attachments?.length > 0
            ? { closing_remark: zgarOrder.closing_remark, closing_attachments: zgarOrder.closure_attachments || [] }
            : undefined
        }
      />

      {paymentSummary && (
        <CreatePaymentModal
          show={showCreatePaymentModal}
          onHide={() => setShowCreatePaymentModal(false)}
          remainingAmount={paymentSummary.remaining_amount}
          customerBalance={customer?.zgar_customer?.balance || 0}
          onSubmit={handleCreatePayment}
        />
      )}
    </>
  );
}
