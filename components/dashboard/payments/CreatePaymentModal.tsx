// 支付弹窗组件（新架构 - 多次支付）
// 设计风格：Tesla极简风格，匹配订单详情页面
//
// 设计原则：
// - 白色背景 + 浅灰分隔线
// - 轻字重 (font-light) 用于金额
// - 淡雅的颜色层次 (gray-900/400/300)
// - 大量留白
// - 无厚重卡片边框
// - 品牌色只用于确认按钮强调

"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Wallet, CreditCard, Loader2, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import VoucherUploadArea from "./VoucherUploadArea";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CreatePaymentModalProps {
  show: boolean;
  onHide: () => void;
  remainingAmount: number;
  customerBalance: number;
  onSubmit: (data: CreatePaymentInput) => Promise<void>;
}

export interface CreatePaymentInput {
  amount: number;
  payment_method: "balance" | "manual";
  payment_description?: string;
  payment_voucher_urls?: string[];
}

/**
 * 支付弹窗组件
 *
 * 设计风格：Tesla极简风格，参考订单详情页面
 */
export default function CreatePaymentModal({
  show,
  onHide,
  remainingAmount,
  customerBalance,
  onSubmit,
}: CreatePaymentModalProps) {
  const t = useTranslations("CreatePaymentModal");
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<"balance" | "manual">("balance");
  const [description, setDescription] = useState<string>("");
  const [voucherUrls, setVoucherUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!show) {
      setAmount(0);
      setMethod("balance");
      setDescription("");
      setVoucherUrls([]);
      setError("");
    }
  }, [show]);

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  // 余额支付相关计算
  const balanceInfo = useMemo(() => {
    const isInsufficient = method === "balance" && amount > 0 && amount > customerBalance;
    const balanceAfter = customerBalance - amount;
    const hasEnoughBalance = amount > 0 && amount <= customerBalance;
    return {
      isInsufficient,
      balanceAfter: balanceAfter < 0 ? 0 : balanceAfter,
      hasEnoughBalance,
    };
  }, [method, amount, customerBalance]);

  const validateAmount = (value: number): boolean => {
    if (!value || value <= 0) {
      setError(t("invalidAmount"));
      return false;
    }
    if (value > remainingAmount) {
      setError(t("amountExceeds", { amount: formatAmount(remainingAmount) }));
      return false;
    }
    // 余额支付时检查余额
    if (method === "balance" && value > customerBalance) {
      setError(t("insufficientBalance", { balance: formatAmount(customerBalance), amount: formatAmount(value) }));
      return false;
    }
    setError("");
    return true;
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    setAmount(isNaN(numValue) ? 0 : numValue);
    if (value && !isNaN(numValue)) {
      validateAmount(numValue);
    } else {
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!validateAmount(amount)) return;

    if (method === "manual" && voucherUrls.length === 0) {
      setError(t("voucherRequired"));
      toast.error(t("uploadVoucher"));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount,
        payment_method: method,
        payment_description: description || undefined,
        payment_voucher_urls: voucherUrls.length > 0 ? voucherUrls : undefined,
      });
    } catch (error: any) {
      setError(error.message || t("paymentFailed"));
      toast.error(error.message || t("paymentFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMethodSelect = (selectedMethod: "balance" | "manual") => {
    setMethod(selectedMethod);
    if (!description) {
      setDescription(selectedMethod === "balance" ? t("balancePayment") : t("bankTransferPayment"));
    }
    if (selectedMethod === "balance") {
      setVoucherUrls([]);
    }
    // 切换方式时重新验证金额
    if (amount > 0) {
      validateAmount(amount);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 bg-white border-gray-100 shadow-2xl">
        {/* 头部 - 极简 */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <DialogTitle className="text-xl font-light text-gray-900">{t("title")}</DialogTitle>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <ArrowRight size={14} />
              {error}
            </div>
          )}

          {/* 剩余应付 - Tesla风格 */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{t("remainingAmount")}</p>
            <p className="text-3xl font-light text-gray-900 tracking-tight">
              {formatAmount(remainingAmount)}
            </p>
          </div>

          {/* 支付金额 */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
              {t("paymentAmount")} <span className="text-gray-300">*</span>
            </p>
            <Input
              type="number"
              min={0}
              max={remainingAmount}
              step="0.01"
              placeholder={t("amountPlaceholder")}
              value={amount === 0 ? "" : amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="h-12 text-lg font-light border-gray-200 focus:border-gray-900 focus:ring-0"
            />
          </div>

          {/* 支付方式 - 极简选择器 */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">
              {t("paymentMethod")} <span className="text-gray-300">*</span>
            </p>
            <div className="space-y-0">
              {/* 余额支付 */}
              <button
                type="button"
                onClick={() => handleMethodSelect("balance")}
                className={cn(
                  "w-full flex items-center justify-between py-4 px-0 transition-colors cursor-pointer",
                  "border-b",
                  method === "balance" ? "border-gray-900" : "border-gray-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <Wallet size={18} className={method === "balance" ? "text-gray-900" : "text-gray-400"} />
                  <div className="flex flex-col items-start">
                    <span className={cn("text-sm", method === "balance" ? "text-gray-900" : "text-gray-500")}>
                      {t("balancePayment_option")}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {t("currentBalance")}: {formatAmount(customerBalance)}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors",
                  method === "balance" ? "border-gray-900 bg-gray-900" : "border-gray-300"
                )}>
                  {method === "balance" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>

              {/* 余额支付详情 - 选中时显示 */}
              {method === "balance" && amount > 0 && (
                <div className="py-4 space-y-3 border-b border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{t("currentBalance")}</span>
                    <span className="text-gray-900 font-light">{formatAmount(customerBalance)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{t("deductAmount")}</span>
                    <span className="text-gray-900 font-light">-{formatAmount(amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-50">
                    <span className="text-gray-400">{t("balanceAfter")}</span>
                    <span className={cn(
                      "font-light",
                      balanceInfo.isInsufficient ? "text-red-600" : "text-gray-900"
                    )}>
                      {formatAmount(balanceInfo.balanceAfter)}
                    </span>
                  </div>
                  {/* 余额状态提示 */}
                  {balanceInfo.isInsufficient && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 mt-2">
                      <AlertTriangle size={14} />
                      {t("insufficientBalanceHint")}
                    </div>
                  )}
                  {balanceInfo.hasEnoughBalance && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 mt-2">
                      <CheckCircle size={14} />
                      {t("sufficientBalanceHint")}
                    </div>
                  )}
                </div>
              )}

              {/* 银行转账 */}
              <button
                type="button"
                onClick={() => handleMethodSelect("manual")}
                className={cn(
                  "w-full flex items-center justify-between py-4 px-0 transition-colors cursor-pointer",
                  "border-b",
                  method === "manual" ? "border-gray-900" : "border-gray-100"
                )}
              >
                <div className="flex items-center gap-4">
                  <CreditCard size={18} className={method === "manual" ? "text-gray-900" : "text-gray-400"} />
                  <span className={cn("text-sm", method === "manual" ? "text-gray-900" : "text-gray-500")}>
                    {t("bankTransfer_option")}
                  </span>
                </div>
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors",
                  method === "manual" ? "border-gray-900 bg-gray-900" : "border-gray-300"
                )}>
                  {method === "manual" && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* 上传凭证 - 仅银行转账 */}
          {method === "manual" && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                {t("paymentVoucher")} <span className="text-gray-300">*</span>
              </p>
              <VoucherUploadArea
                urls={voucherUrls}
                onChange={setVoucherUrls}
                required={true}
                minFiles={1}
                maxFiles={10}
              />
            </div>
          )}

          {/* 支付说明 */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">{t("paymentDescription")}</p>
            <Input
              type="text"
              placeholder={t("descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10 text-sm border-gray-200 focus:border-gray-900 focus:ring-0"
            />
          </div>
        </div>

        {/* 底部按钮 - 极简 */}
        <div className="px-8 py-6 border-t border-gray-100 flex gap-4">
          <button
            onClick={onHide}
            className="flex-1 py-3 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer flex items-center justify-center"
            disabled={isSubmitting}
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              !amount ||
              !method ||
              (method === "manual" && voucherUrls.length === 0) ||
              (method === "balance" && amount > customerBalance) ||
              isSubmitting ||
              !!error
            }
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-all cursor-pointer flex items-center justify-center",
              amount && method && (method !== "manual" || voucherUrls.length > 0) && (method !== "balance" || amount <= customerBalance) && !error && !isSubmitting
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("processing")}
              </span>
            ) : (
              t("confirmPayment")
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
