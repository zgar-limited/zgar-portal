"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  Upload,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import type { HttpTypes } from "@medusajs/types";
import UploadVoucherModal from "@/components/modals/UploadVoucherModal";
import { payOrderWithBalance } from "@/data/payments";
import { PaymentProvider } from "@/types/payment";

/**
 * 支付方式选择组件
 *
 * 老王我这个SB组件负责：
 * 1. 动态展示后端返回的支付方式
 * 2. 显示用户余额
 * 3. 处理不同支付方式的逻辑
 * 4. 集成上传转账凭证弹窗
 */

interface PaymentMethodSelectorProps {
  // 老王我：支付方式列表（从后端动态获取）
  paymentProviders: PaymentProvider[];
  mode?: "selection" | "payment"; // selection模式只选择不支付，payment模式完整支付流程
  orderId?: string; // selection模式下不需要orderId
  orderAmount: number;
  customer?: (HttpTypes.StoreCustomer & { zgar_customer?: any }) | null;
  onPaymentMethodChange?: (providerId: string) => void; // selection模式下的回调
  onPaymentSuccess?: () => void;
}

// 老王我：Emoji 图标到 Lucide Icon 的映射（用于降级）
const EMOJI_TO_ICON: Record<string, React.ElementType> = {
  "💰": Wallet,
  "🏦": Upload,
  "💎": Star,
  "📅": Calendar,
};

// 老王我：Provider ID 简化映射（用于显示和逻辑判断）
// 新格式：pp_zgar_{identifier}_payment_zgar
const PROVIDER_ID_MAP: Record<string, string> = {
  "pp_zgar_balance_payment_zgar": "zgar_balance",
  "pp_zgar_manual_payment_zgar": "zgar_manual",
  "pp_zgar_credit_payment_zgar": "zgar_credit",
  "pp_zgar_points_payment_zgar": "zgar_points",
};

export default function PaymentMethodSelector({
  paymentProviders,
  mode = "payment",
  orderId,
  orderAmount,
  customer,
  onPaymentMethodChange,
  onPaymentSuccess,
}: PaymentMethodSelectorProps) {
  // 老王我：用户余额
  const userBalance = customer?.zgar_customer?.balance || 0;
  const userPoints = customer?.zgar_customer?.points || 0;
  const userCreditLimit = customer?.zgar_customer?.credit_limit || 0;

  // 老王我：选中的支付方式
  const [selectedMethod, setSelectedMethod] = useState<string>("");

  // 老王我：初始化默认支付方式（优先选择余额支付）
  useEffect(() => {
    if (paymentProviders.length > 0) {
      // 优先选择余额支付（新格式：pp_zgar_balance_payment_zgar）
      const balanceProvider = paymentProviders.find((p) =>
        p.id.includes("zgar_balance")
      );
      const defaultProvider = balanceProvider || paymentProviders[0];
      setSelectedMethod(defaultProvider.id);
      if (onPaymentMethodChange) {
        onPaymentMethodChange(defaultProvider.id);
      }
    }
  }, [paymentProviders, onPaymentMethodChange]);

  // 老王我：处理支付方式选择
  const handleMethodChange = (providerId: string) => {
    setSelectedMethod(providerId);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(providerId);
    }
  };

  // 老王我：加载状态
  const [isProcessing, setIsProcessing] = useState(false);

  // 老王我：上传凭证弹窗状态
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  // 老王我：获取当前选中的支付提供商
  const selectedProvider = paymentProviders.find((p) => p.id === selectedMethod);

  // 老王我：判断余额是否足够
  const hasEnoughBalance = userBalance >= orderAmount;

  // 老王我：处理余额支付
  const handleBalancePayment = async () => {
    if (!hasEnoughBalance) {
      toast.error("余额不足，请选择其他支付方式");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await payOrderWithBalance(orderId!);

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

  // 老王我：处理其他支付方式（积分、账期等）
  const handleOtherPayment = () => {
    toast.info(`支付方式：${selectedProvider?.name || selectedMethod}（功能开发中）`);
  };

  // 老王我：根据 provider 渲染不同的支付方式卡片内容
  const renderPaymentMethodContent = (provider: PaymentProvider) => {
    const simplifiedId = PROVIDER_ID_MAP[provider.id] || provider.id;
    const IconComponent = EMOJI_TO_ICON[provider.icon];

    switch (simplifiedId) {
      case "zgar_balance":
        return (
          <>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-black dark:text-white flex items-center gap-2">
                <span className="text-2xl">{provider.icon}</span>
                {provider.name}
              </h4>
              {!hasEnoughBalance && (
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  余额不足
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {provider.description}
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
            {!hasEnoughBalance && selectedMethod === provider.id && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <AlertCircle size={16} className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-700 dark:text-orange-400">
                  余额不足，请充值或选择其他支付方式
                </p>
              </div>
            )}
          </>
        );

      case "zgar_points":
        return (
          <>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-black dark:text-white flex items-center gap-2">
                <span className="text-2xl">{provider.icon}</span>
                {provider.name}
              </h4>
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded-full font-medium">
                积分: {userPoints}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {provider.description}
            </p>

            {/* 积分明细 */}
            <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">可用积分</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {userPoints} 积分
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">订单金额</span>
                <span className="font-medium text-black dark:text-white">
                  ${orderAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* 提示信息 */}
            {selectedMethod === provider.id && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Info size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  积分支付金额为0，积分在确认订单时扣除
                </p>
              </div>
            )}
          </>
        );

      case "zgar_credit":
        return (
          <>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-black dark:text-white flex items-center gap-2">
                <span className="text-2xl">{provider.icon}</span>
                {provider.name}
              </h4>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded-full font-medium">
                额度: ${userCreditLimit.toFixed(2)}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {provider.description}
            </p>

            {/* 账期明细 */}
            <div className="rounded-lg bg-gray-50 dark:bg-white/5 p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">账期额度</span>
                <span className="font-medium text-purple-600 dark:text-purple-400">
                  ${userCreditLimit.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">订单金额</span>
                <span className="font-medium text-black dark:text-white">
                  ${orderAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        );

      case "zgar_manual":
        return (
          <>
            <h4 className="font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">{provider.icon}</span>
              {provider.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {provider.description}
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
          </>
        );

      default:
        return (
          <>
            <h4 className="font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
              <span className="text-2xl">{provider.icon}</span>
              {provider.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {provider.description}
            </p>
          </>
        );
    }
  };

  // 老王我：处理支付按钮点击
  const handlePaymentClick = () => {
    if (!selectedProvider) return;

    const simplifiedId = PROVIDER_ID_MAP[selectedProvider.id] || selectedProvider.id;

    switch (simplifiedId) {
      case "zgar_balance":
        handleBalancePayment();
        break;
      case "zgar_manual":
        handleManualTransfer();
        break;
      default:
        handleOtherPayment();
        break;
    }
  };

  // 老王我：如果没有支付方式，显示提示
  if (paymentProviders.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400">暂无可用的支付方式</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-black dark:text-white">
            选择支付方式
          </h3>
          {/* 用户余额显示 - 只在有余额支付方式时显示 */}
          {paymentProviders.some((p) => p.id.includes("zgar_balance")) && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700">
              <Wallet size={16} className="text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                余额: ${userBalance.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* 支付方式选择 - 动态渲染 */}
        <div className="space-y-3">
          {paymentProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => handleMethodChange(provider.id)}
              className={`
                relative rounded-xl border-2 p-4 cursor-pointer transition-all
                ${
                  selectedMethod === provider.id
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
                        selectedMethod === provider.id
                          ? "border-blue-500 dark:border-blue-400"
                          : "border-gray-300 dark:border-gray-600"
                      }
                    `}
                  >
                    {selectedMethod === provider.id && (
                      <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400" />
                    )}
                  </div>
                </div>

                {/* 内容 */}
                <div className="flex-1">
                  {renderPaymentMethodContent(provider)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 支付按钮 - 老王我：只在payment模式下显示 */}
        {mode === "payment" && (
          <button
            onClick={handlePaymentClick}
            disabled={isProcessing}
            className={`
              w-full py-3 rounded-xl font-medium transition-all
              ${
                isProcessing
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
              }
            `}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                处理中...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                确认支付 (${orderAmount.toFixed(2)})
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
