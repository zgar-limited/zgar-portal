"use client";

import { useState } from "react";
import { Wallet, Upload, CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import type { HttpTypes } from "@medusajs/types";
import UploadVoucherModal from "@/components/modals/UploadVoucherModal";
import { payOrderWithBalance } from "@/data/payments";

/**
 * 支付方式选择组件
 *
 * 老王我这个SB组件负责：
 * 1. 展示余额支付和手动转账两种方式
 * 2. 显示用户余额
 * 3. 处理余额支付逻辑
 * 4. 集成上传转账凭证弹窗
 */

interface PaymentMethodSelectorProps {
  mode?: "selection" | "payment"; // 老王我：selection模式只选择不支付，payment模式完整支付流程
  orderId?: string; // 老王我：selection模式下不需要orderId
  orderAmount: number;
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
  onPaymentMethodChange?: (method: PaymentMethod) => void; // 老王我：selection模式下的回调
  onPaymentSuccess?: () => void;
}

export type PaymentMethod = "balance" | "manual_transfer";

export default function PaymentMethodSelector({
  mode = "payment",
  orderId,
  orderAmount,
  customer,
  onPaymentMethodChange,
  onPaymentSuccess,
}: PaymentMethodSelectorProps) {
  // 老王我：用户余额
  const userBalance = customer?.zgar_customer?.balance || 0;

  // 老王我：选中的支付方式
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("balance");

  // 老王我：处理支付方式选择
  const handleMethodChange = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  };

  // 老王我：加载状态
  const [isProcessing, setIsProcessing] = useState(false);

  // 老王我：上传凭证弹窗状态
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // 老王我：判断余额是否足够
  const hasEnoughBalance = userBalance >= orderAmount;

  // 老王我：处理余额支付
  const handleBalancePayment = async () => {
    if (!hasEnoughBalance) {
      toast.error("余额不足，请选择手动转账方式");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await payOrderWithBalance(orderId);

      if (result.error) {
        toast.error(result.error || "余额支付失败");
        return;
      }

      // 老王我：支付成功
      toast.success(result.message || "余额支付成功！");

      // 老王我：显示支付详情
      if (result.credit_payment_amount > 0) {
        toast.info(
          `余额支付：$${result.balance_payment_amount.toFixed(2)}，账期欠款：$${result.credit_payment_amount.toFixed(2)}`
        );
      }

      // 老王我：回调
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (error: any) {
      console.error("余额支付失败:", error);
      toast.error(error.message || "余额支付失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  // 老王我：处理手动转账
  const handleManualTransfer = () => {
    setShowVoucherModal(true);
  };

  return (
    <>
      <div className="space-y-4">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-black dark:text-white">
            选择支付方式
          </h3>
          {/* 用户余额显示 */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700">
            <Wallet size={16} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              余额: ${userBalance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* 支付方式选择 */}
        <div className="space-y-3">
          {/* 余额支付选项 */}
          <div
            onClick={() => handleMethodChange("balance")}
            className={`
              relative rounded-xl border-2 p-4 cursor-pointer transition-all
              ${
                selectedMethod === "balance"
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#191818] hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* 单选按钮 */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      selectedMethod === "balance"
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-gray-300 dark:border-gray-600"
                    }
                  `}
                >
                  {selectedMethod === "balance" && (
                    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                  )}
                </div>
              </div>

              {/* 内容 */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-black dark:text-white flex items-center gap-2">
                    <Wallet size={18} className="text-blue-500" />
                    余额支付
                  </h4>
                  {!hasEnoughBalance && (
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                      余额不足
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  使用账户余额直接支付订单
                </p>

                {/* 余额明细 */}
                <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">订单金额</span>
                    <span className="font-medium text-black dark:text-white">
                      ${orderAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">可用余额</span>
                    <span className={`font-medium ${hasEnoughBalance ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      ${userBalance.toFixed(2)}
                    </span>
                  </div>
                  {!hasEnoughBalance && (
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">还需支付</span>
                      <span className="font-medium text-orange-600 dark:text-orange-400">
                        ${(orderAmount - userBalance).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 余额不足提示 */}
                {!hasEnoughBalance && selectedMethod === "balance" && (
                  <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <AlertCircle size={16} className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-700 dark:text-orange-400">
                      余额不足，请充值或选择手动转账方式
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 手动转账选项 */}
          <div
            onClick={() => handleMethodChange("manual_transfer")}
            className={`
              relative rounded-xl border-2 p-4 cursor-pointer transition-all
              ${
                selectedMethod === "manual_transfer"
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#191818] hover:border-gray-300 dark:hover:border-gray-600"
              }
            `}
          >
            <div className="flex items-start gap-3">
              {/* 单选按钮 */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${
                      selectedMethod === "manual_transfer"
                        ? "border-blue-500 dark:border-blue-400"
                        : "border-gray-300 dark:border-gray-600"
                    }
                  `}
                >
                  {selectedMethod === "manual_transfer" && (
                    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                  )}
                </div>
              </div>

              {/* 内容 */}
              <div className="flex-1">
                <h4 className="font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
                  <Upload size={18} className="text-purple-500" />
                  手动转账
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  通过银行转账支付，完成后上传转账凭证
                </p>

                {/* 转账提示 */}
                <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-3">
                  <div className="flex items-start gap-2">
                    <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      转账完成后请上传凭证，我们会尽快确认发货
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 支付按钮 - 老王我：只在payment模式下显示 */}
        {mode === "payment" && (
          <button
            onClick={selectedMethod === "balance" ? handleBalancePayment : handleManualTransfer}
            disabled={isProcessing || (selectedMethod === "balance" && !hasEnoughBalance)}
            className={`
              w-full py-3 rounded-xl font-medium transition-all
              ${
                isProcessing
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : selectedMethod === "balance"
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white"
              }
            `}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                处理中...
              </span>
            ) : selectedMethod === "balance" ? (
              <span className="flex items-center justify-center gap-2">
                <Wallet size={18} />
                确认支付 (${orderAmount.toFixed(2)})
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Upload size={18} />
                上传转账凭证
              </span>
            )}
          </button>
        )}
      </div>

      {/* 上传转账凭证弹窗 */}
      <UploadVoucherModal
        show={showVoucherModal}
        onHide={() => setShowVoucherModal(false)}
        orderId={orderId}
      />
    </>
  );
}
