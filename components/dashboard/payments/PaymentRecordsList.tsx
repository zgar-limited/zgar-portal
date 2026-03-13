// 支付记录列表组件（新架构 - 多次支付）
// 设计风格：Tesla极简风格
// 参考：订单详情页面
//
// 显示所有支付记录
// - 支付记录卡片列表
// - 创建支付按钮
// - 上传凭证按钮
// - 每条记录的状态、方式、金额、审核信息
//
// 淡化区域设计
// - 无卡片边框
// - 用分隔线区分
// - 更简洁的状态标签
// - 极简的按钮

import React from "react";
import { Plus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { PaymentRecord, PaymentSummary } from "@/data/payments";

interface PaymentRecordsListProps {
  records: PaymentRecord[];
  summary: PaymentSummary;
  orderAuditStatus?: string;
  isCompleted: boolean;
  onCreatePayment: () => void;
  onUpdateVoucher: (recordId: string) => void;
}

// 格式化金额
const formatAmount = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "$0.00";
  }
  return `$${amount.toFixed(2)}`;
};

// 返回支付状态的样式类名
const getStatusStyle = (status: string): string => {
  switch (status) {
    case "approved":
      return "text-black";
    case "reviewing":
      return "text-gray-700";
    case "rejected":
      return "text-red-600";
    default:
      return "text-gray-500";
  }
};

export default function PaymentRecordsList({
  records,
  summary,
  orderAuditStatus,
  isCompleted,
  onCreatePayment,
  onUpdateVoucher
}: PaymentRecordsListProps) {
  const t = useTranslations("PaymentRecords");

  // 按时间倒序排列（最新的在最前面）
  const sortedRecords = React.useMemo(() => {
    return [...records].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [records]);

  // 判断订单是否已审核通过
  const isOrderApproved = orderAuditStatus === "approved";

  // 判断是否可以创建支付 - 订单已审核且未完成且有剩余金额
  const canCreatePayment = !isCompleted && summary.remaining_amount > 0 && isOrderApproved;

  // 判断是否全部已付清
  const isFullyPaid = summary.remaining_amount === 0;

  return (
    <div className="py-8">
      {/* 标题和创建按钮 */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">{t("title")}</h3>

        {canCreatePayment && (
          <button
            onClick={onCreatePayment}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors cursor-pointer"
          >
            <Plus size={16} />
            {t("createPayment")}
          </button>
        )}
      </div>

      {/* 记录列表 */}
      {sortedRecords.length > 0 ? (
        <div className="space-y-0">
          {sortedRecords.map((record, index) => (
            <div
              key={record.id}
              className="group py-6 border-b border-gray-100 first:pt-0 last:border-b-0"
            >
              {/* 第一行：序号、金额、状态、日期 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 w-8">#{record.installment_number || index + 1}</span>
                  <span className="text-lg font-light text-gray-900 tracking-tight">
                    {formatAmount(record.amount)}
                  </span>
                  <span className={`text-xs font-medium uppercase tracking-wide ${getStatusStyle(record.payment_status)}`}>
                    {record.payment_status}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(record.created_at).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* 第二行：支付方式、描述 */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 ml-12">
                  <span className="text-xs text-gray-400">
                    {record.payment_method === "balance"
                      ? t("balancePayment")
                      : record.payment_method === "manual"
                      ? t("manualTransfer")
                      : record.payment_method}
                  </span>
                  {record.payment_description && (
                    <span className="text-xs text-gray-500">· {record.payment_description}</span>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-4">
                  {/* 凭证 */}
                  <div className="flex items-center gap-2">
                    {record.payment_voucher_urls && record.payment_voucher_urls.length > 0 ? (
                      <>
                        <span className="text-xs text-gray-400">{record.payment_voucher_urls.length} {t("files")}</span>
                        <div className="flex gap-1">
                          {record.payment_voucher_urls.slice(0, 3).map((url, urlIndex) => (
                            <a
                              key={urlIndex}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-gray-500 hover:text-black transition-colors"
                            >
                              #{urlIndex + 1}
                            </a>
                          ))}
                          {record.payment_voucher_urls.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{record.payment_voucher_urls.length - 3}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </div>

                  {/* 操作按钮 - 仅银行转账且待审核或被拒绝时可上传/修改凭证 */}
                  {!isCompleted && record.payment_method === "manual" && (
                    <button
                      onClick={() => onUpdateVoucher(record.id)}
                      className="text-xs text-gray-500 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Upload size={12} />
                      {record.payment_voucher_urls && record.payment_voucher_urls.length > 0
                        ? t("editVoucher")
                        : t("uploadVoucher")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 空状态 */
        <div className="text-center py-12">
          {isOrderApproved ? (
            <p className="text-sm text-gray-400">{t("noRecords")}</p>
          ) : (
            <p className="text-sm text-gray-400">{t("waitApprovalHint")}</p>
          )}
        </div>
      )}
    </div>
  );
}
