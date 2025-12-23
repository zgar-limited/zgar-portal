"use client";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import React from "react";
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
    <Card className="p-4 space-y-4">
      {/* 订单头部 */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-medium text-sm">订单 #{order.display_id}</h3>
          <div className="flex items-center gap-2">
            <Badge
              variant={getStatusVariant(order.status)}
              className="text-xs"
            >
              {order.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {order.currency_code?.toUpperCase()} {order.total?.toFixed(2) || "0.00"}
            </span>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="space-y-3">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Link
              href={`/product-detail/${
                item.product_id ||
                item.variant?.product_id ||
                ""
              }`}
              className="flex-shrink-0"
            >
              <div className="relative w-12 h-12 rounded-md overflow-hidden border bg-muted">
                <Image
                  src={
                    item.thumbnail ||
                    "https://placehold.co/100"
                  }
                  alt={item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">
                <Link
                  href={`/product-detail/${
                    item.product_id ||
                    item.variant?.product_id ||
                    ""
                  }`}
                  className="hover:text-primary transition-colors"
                >
                  {item.title}
                </Link>
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {item.variant_title && (
                  <Badge variant="secondary" className="text-xs">
                    {item.variant_title}
                  </Badge>
                )}
                <span>x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewDetails}
          className="flex-1"
        >
          <Eye size={14} className="mr-1" />
          详情
        </Button>
        <Button
          variant={cn(
            "ghost",
            (order as any).zgar_order?.payment_voucher_uploaded_at
              ? "text-green-600 hover:text-green-700 hover:bg-green-50"
              : "text-muted-foreground hover:text-foreground"
          )}
          size="sm"
          onClick={onUploadVoucher}
          className="flex-1"
        >
          <Upload size={14} className="mr-1" />
          {(order as any).zgar_order?.payment_voucher_uploaded_at
            ? "编辑凭证"
            : "上传凭证"}
        </Button>
        <Button
          variant={cn(
            "ghost",
            (order as any).zgar_order?.packing_requirement_uploaded_at
              ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              : "text-muted-foreground hover:text-foreground"
          )}
          size="sm"
          onClick={onUploadPacking}
          className="flex-1"
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