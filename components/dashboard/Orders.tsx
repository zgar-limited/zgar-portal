"use client";
import { Link, useRouter } from '@/i18n/routing';
import Image from "next/image";
import React, { useState } from "react";
// 老王我移除 Sidebar import，因为已经在 layout 中了
import OrderCard from "./OrderCard";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Upload, Package, ShoppingBag, FileText } from "lucide-react";
import UploadVoucherModal from "../modals/UploadVoucherModal";
import UploadPackingModal from "../modals/UploadPackingModal";
import { cn } from "@/lib/utils";

interface OrdersProps {
  customer: HttpTypes.StoreCustomer;
  orders: { orders: HttpTypes.StoreOrder[]; count: number } | null;
  currentPage: number;
  totalPages: number;
}

export default function Orders({ customer, orders, currentPage, totalPages }: OrdersProps) {
  const router = useRouter();
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderVouchers, setSelectedOrderVouchers] = useState<string[]>([]);
  const [selectedOrderPackingFiles, setSelectedOrderPackingFiles] = useState<string[]>([]);

  const orderList = orders?.orders || [];
  const count = orders?.count || 0;

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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`/account-orders?page=${page}`);
    }
  };

  // 处理订单操作 - 老王我用router.push代替硬编码跳转
  const handleViewDetails = (orderId: string) => {
    router.push(`/account-orders-detail/${orderId}`);
  };

  const handleUploadVoucher = (order: HttpTypes.StoreOrder) => {
    setSelectedOrderId(order.id);
    const vouchers = (order as any).zgar_order?.payment_voucher_url;
    let voucherList: string[] = [];
    if (typeof vouchers === "string") {
      voucherList = vouchers
        .split(",")
        .map((v: string) => v.trim())
        .filter(Boolean);
    }
    setSelectedOrderVouchers(voucherList);
    setShowVoucherModal(true);
  };

  const handleUploadPacking = (order: HttpTypes.StoreOrder) => {
    setSelectedOrderId(order.id);
    const files =
      (order as any).zgar_order?.packing_requirement_url ||
      (order as any).zgar_order?.packing_requirement;
    let fileList: string[] = [];
    if (typeof files === "string") {
      fileList = files
        .split(",")
        .map((v: string) => v.trim())
        .filter(Boolean);
    } else if (Array.isArray(files)) {
      fileList = files;
    }
    setSelectedOrderPackingFiles(fileList);
    setShowPackingModal(true);
  };

  return (
    /* 老王我移除外层布局和 Sidebar，因为 layout 已经提供了 */
    <div className="space-y-6">
              {/* 页面标题 */}
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">我的订单</h1>
                <p className="text-muted-foreground">查看和管理您的所有订单</p>
              </div>

              {/* 订单列表 */}
              <div className="space-y-4">
                {/* 桌面端表格布局 */}
                <Card className="hidden md:block">
                  <div className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">订单号</TableHead>
                          <TableHead>商品</TableHead>
                          <TableHead className="w-[120px] text-right">金额</TableHead>
                          <TableHead className="w-[100px] text-center">状态</TableHead>
                          <TableHead className="w-[240px] text-right">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center">
                              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <ShoppingBag size={32} className="opacity-50" />
                                <span>暂无订单</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          orderList.map((order) => (
                            <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-medium">
                                <span className="text-sm">#{order.display_id}</span>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
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
                                        <div className="relative w-9 h-9 rounded-md overflow-hidden border bg-muted">
                                          <Image
                                            src={
                                              item.thumbnail ||
                                              "https://placehold.co/100"
                                            }
                                            alt={item.title}
                                            fill
                                            sizes="36px"
                                            className="object-cover"
                                          />
                                        </div>
                                      </Link>
                                      <div className="flex-1 min-w-0">
                                        <h6 className="text-sm font-medium truncate mb-1">
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
                                        </h6>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
                              </TableCell>
                              <TableCell className="text-right font-mono text-sm">
                                {order.currency_code?.toUpperCase()}{" "}
                                {order.total?.toFixed(2) || "0.00"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={getStatusVariant(order.status)}
                                  className="text-xs"
                                >
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetails(order.id)}
                                  >
                                    <Eye size={14} className="mr-1" />
                                    <span className="hidden sm:inline">详情</span>
                                  </Button>
                                  <Button
                                    variant={cn(
                                      "ghost",
                                      (order as any).zgar_order?.payment_voucher_uploaded_at &&
                                        "text-green-600 hover:text-green-700 hover:bg-green-50"
                                    )}
                                    size="sm"
                                    onClick={() => handleUploadVoucher(order)}
                                  >
                                    <Upload size={14} className="mr-1" />
                                    <span className="hidden sm:inline">
                                      {(order as any).zgar_order?.payment_voucher_uploaded_at
                                        ? "编辑凭证"
                                        : "上传凭证"}
                                    </span>
                                  </Button>
                                  <Button
                                    variant={cn(
                                      "ghost",
                                      (order as any).zgar_order?.packing_requirement_uploaded_at &&
                                        "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    )}
                                    size="sm"
                                    onClick={() => handleUploadPacking(order)}
                                  >
                                    <Package size={14} className="mr-1" />
                                    <span className="hidden sm:inline">
                                      {(order as any).zgar_order?.packing_requirement_uploaded_at
                                        ? "编辑包装"
                                        : "包装要求"}
                                    </span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

                {/* 移动端卡片布局 */}
                <div className="md:hidden space-y-4">
                  {orderList.length === 0 ? (
                    <Card className="p-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ShoppingBag size={32} className="opacity-50" />
                        <span>暂无订单</span>
                      </div>
                    </Card>
                  ) : (
                    orderList.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onViewDetails={() => handleViewDetails(order.id)}
                        onUploadVoucher={() => handleUploadVoucher(order)}
                        onUploadPacking={() => handleUploadPacking(order)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination className="w-fit">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          className={cn(
                            currentPage === 1 && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          className={cn(
                            currentPage === totalPages && "pointer-events-none opacity-50"
                          )}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 模态框 */}
      <UploadVoucherModal
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          setSelectedOrderId(null);
          setSelectedOrderVouchers([]);
        }}
        orderId={selectedOrderId}
        initialVouchers={selectedOrderVouchers}
      />
      <UploadPackingModal
        show={showPackingModal}
        onHide={() => {
          setShowPackingModal(false);
          setSelectedOrderId(null);
          setSelectedOrderPackingFiles([]);
        }}
        orderId={selectedOrderId}
        initialFiles={selectedOrderPackingFiles}
      />
    </div>
  );
}