"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";
import { useLocale } from "next-intl";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Eye, Upload, Package, ShoppingBag } from "lucide-react";
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

  return (
    <Card className="p-5 space-y-4 shadow-sm hover:shadow-md transition-all border-border/50 rounded-2xl">
      {/* 订单头部 */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-base">订单 #{order.display_id}</h3>
            <Badge
              variant={getStatusVariant(order.status)}
              className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-md",
                order.status === "completed" && "bg-green-50 text-green-700 border border-green-200",
                order.status === "pending" && "bg-amber-50 text-amber-700 border border-amber-200",
                order.status === "canceled" && "bg-red-50 text-red-700 border border-red-200"
              )}
            >
              {order.status === "completed" ? "已完成" :
               order.status === "pending" ? "处理中" : "已取消"}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {order.currency_code?.toUpperCase()} {order.total?.toFixed(2) || "0.00"}
          </span>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="space-y-3">
        {order.items?.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl transition-colors",
              index < (order.items?.length || 0) - 1 && "border-b border-border/50"
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
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border shadow-sm">
                <Image
                  src={
                    item.thumbnail ||
                    "https://placehold.co/100"
                  }
                  alt={item.title}
                  fill
                  sizes="56px"
                  className="object-cover hover:scale-110 transition-transform duration-200"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold truncate mb-1">
                <Link
                  href={`/product-detail/${
                    item.product_id ||
                    item.variant?.product_id ||
                    ""
                  }`}
                  className="hover:text-primary transition-colors"
                >
                  {/* 老王我修改：显示 variant_title 而不是 title */}
                  {item.variant_title || item.title}
                </Link>
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {/* 老王我添加：显示商品变体 options（多语言翻译） */}
                {item.variant?.options && (item.variant.options as any[]).length > 0 ? (
                  (item.variant.options as any[]).map((option: any, idx: number) => {
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
                  })
                ) : null}
                <span className="font-medium">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 pt-3 border-t border-border/50">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="flex-1 rounded-lg font-medium shadow-sm"
        >
          <Eye size={14} className="mr-1.5" />
          详情
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "flex-1 rounded-lg font-medium",
            (order as any).zgar_order?.payment_voucher_uploaded_at
              ? "text-green-600 bg-green-50 hover:bg-green-100"
              : "text-muted-foreground hover:bg-black/5"
          )}
          size="sm"
          onClick={onUploadVoucher}
        >
          <Upload size={14} className="mr-1" />
          {(order as any).zgar_order?.payment_voucher_uploaded_at
            ? "编辑凭证"
            : "上传凭证"}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "flex-1 rounded-lg font-medium",
            (order as any).zgar_order?.packing_requirement_uploaded_at
              ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
              : "text-muted-foreground hover:bg-black/5"
          )}
          size="sm"
          onClick={onUploadPacking}
        >
          <Package size={14} className="mr-1" />
          {(order as any).zgar_order?.packing_requirement_uploaded_at
            ? "编辑包装"
            : "包装要求"}
        </Button>
      </div>
    </Card>
  );
}