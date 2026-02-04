// 老王我：付款弹窗组件（新架构 - 多次支付）
// 设计风格：Minimalism，直角设计，匹配订单详情页面
// 创建时间：2026-02-03
// 作者：老王

"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, CreditCard, Loader2, AlertCircle } from "lucide-react";
import VoucherUploadArea from "./VoucherUploadArea";
import { toast } from "sonner";

interface CreatePaymentModalProps {
  show: boolean;
  onHide: () => void;
  remainingAmount: number;
  onSubmit: (data: CreatePaymentInput) => Promise<void>;
}

export interface CreatePaymentInput {
  amount: number;
  payment_method: "balance" | "manual";
  payment_description?: string;
  payment_voucher_urls?: string[];
}

/**
 * 老王我：付款弹窗组件
 *
 * 功能：
 * - 显示剩余应付金额
 * - 输入支付金额（带验证）
 * - 选择支付方式（余额/打款）
 * - 打款支付时上传多张支付凭证
 * - 输入支付说明（可选）
 *
 * 设计风格：Minimalism，直角设计，参考订单详情页面
 */
export default function CreatePaymentModal({
  show,
  onHide,
  remainingAmount,
  onSubmit,
}: CreatePaymentModalProps) {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<"balance" | "manual">("balance");
  const [description, setDescription] = useState<string>("");
  const [voucherUrls, setVoucherUrls] = useState<string[]>([]);  // 老王注：改为直接存储 URL 数组（2026-02-05）
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!show) {
      setAmount(0);
      setMethod("balance");
      setDescription("");
      setVoucherUrls([]);  // 老王注：改为 URL 数组（2026-02-05）
      setError("");
    }
  }, [show]);

  const formatAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return "$0.00";
    }
    return `$${amount.toFixed(2)}`;
  };

  const validateAmount = (value: number): boolean => {
    if (!value || value <= 0) {
      setError("请输入有效的支付金额");
      return false;
    }
    if (value > remainingAmount) {
      setError(`支付金额不能超过剩余应付金额 ${formatAmount(remainingAmount)}`);
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

  // 老王注：移除旧的图片处理函数，使用 VoucherUploadArea 组件（2026-02-05）

  const handleSubmit = async () => {
    if (!validateAmount(amount)) return;

    // 老王注：manual 支付必填凭证验证（2026-02-05）
    if (method === "manual" && voucherUrls.length === 0) {
      setError("打款支付必须上传至少一张支付凭证");
      toast.error("请上传支付凭证");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        amount,
        payment_method: method,
        payment_description: description || undefined,
        payment_voucher_urls: voucherUrls.length > 0 ? voucherUrls : undefined,  // 老王注：直接传递 URL 数组（2026-02-05）
      });
      // 老王注：成功提示由父组件处理（2026-02-05）
    } catch (error: any) {
      setError(error.message || "付款失败，请稍后重试");
      toast.error(error.message || "付款失败，请稍后重试");  // 老王注：添加 toast 错误提示（2026-02-05）
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMethodSelect = (selectedMethod: "balance" | "manual") => {
    setMethod(selectedMethod);
    if (!description) {
      setDescription(selectedMethod === "balance" ? "余额支付" : "银行转账支付");
    }
    if (selectedMethod === "balance") {
      setVoucherUrls([]);  // 老王注：切换到余额支付时清空凭证（2026-02-05）
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onHide()}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Wallet size={18} className="text-brand-pink" />
            付款
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* 剩余应付 */}
          <div className="p-4 bg-gray-50 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">剩余应付金额</p>
                <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'monospace' }}>
                  {formatAmount(remainingAmount)}
                </p>
              </div>
              <Wallet size={24} className="text-brand-pink" />
            </div>
          </div>

          {/* 支付金额 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              支付金额 <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min={0}
              max={remainingAmount}
              step="0.01"
              placeholder="请输入支付金额"
              value={amount === 0 ? "" : amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="h-10"
            />
          </div>

          {/* 支付方式 */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              支付方式 <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={method === "balance" ? "default" : "outline"}
                onClick={() => handleMethodSelect("balance")}
                className={`
                  h-16 flex flex-col items-center justify-center gap-1
                  ${method === "balance"
                    ? "bg-brand-pink text-white border-brand-pink hover:bg-brand-pink/90"
                    : "hover:border-brand-pink"
                  }
                `}
              >
                <Wallet size={20} />
                <span className="text-xs font-semibold">余额支付</span>
              </Button>
              <Button
                type="button"
                variant={method === "manual" ? "default" : "outline"}
                onClick={() => handleMethodSelect("manual")}
                className={`
                  h-16 flex flex-col items-center justify-center gap-1
                  ${method === "manual"
                    ? "bg-brand-blue text-white border-brand-blue hover:bg-brand-blue/90"
                    : "hover:border-brand-blue"
                  }
                `}
              >
                <CreditCard size={20} />
                <span className="text-xs font-semibold">银行转账</span>
              </Button>
            </div>
          </div>

          {/* 上传凭证 - 老王注：使用 VoucherUploadArea 组件（2026-02-05） */}
          {method === "manual" && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-900">
                支付凭证 <span className="text-red-500">*</span>
              </Label>
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
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">
              支付说明（可选）
            </Label>
            <Input
              type="text"
              placeholder="如：首期付款、第二期付款"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-10"
            />
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="border-t pt-4 flex gap-3">
          <Button
            variant="outline"
            onClick={onHide}
            className="flex-1 h-10 font-semibold"
            disabled={isSubmitting}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 h-10 font-semibold bg-brand-pink text-white hover:bg-brand-pink/90"
            disabled={
              !amount ||
              !method ||
              (method === "manual" && voucherUrls.length === 0) ||  // 老王注：改用 voucherUrls（2026-02-05）
              isSubmitting ||
              !!error
            }
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                处理中...
              </span>
            ) : (
              "确认付款"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
