"use client";

import React from "react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { HttpTypes } from "@medusajs/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useState } from "react";
import UploadVoucherModal from "../modals/UploadVoucherModal";
import UploadPackingModal from "../modals/UploadPackingModal";

const OrderStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  ARCHIVED: "archived",
  CANCELED: "canceled",
  REQUIRES_ACTION: "requires_action",
};

const AuditStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

interface OrderDetailsProps {
  order: HttpTypes.StoreOrder;
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  const router = useRouter();
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const orderId = order.id;

  const zgarOrder = (order as any).zgar_order || {};

  const getOrderStatusVariant = (status: string) => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return "default";
      case OrderStatus.PENDING:
        return "secondary";
      case OrderStatus.CANCELED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getAuditStatusVariant = (status: string) => {
    switch (status) {
      case AuditStatus.APPROVED:
        return "default";
      case AuditStatus.PENDING:
        return "secondary";
      case AuditStatus.REJECTED:
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      href="/account-orders"
                      className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Order #{order.display_id}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getOrderStatusVariant(order.status)} className="px-3 py-1">
                      {order.status.toUpperCase()}
                    </Badge>
                    {zgarOrder.audit_status && (
                      <Badge variant={getAuditStatusVariant(zgarOrder.audit_status)} className="px-3 py-1">
                        Audit: {zgarOrder.audit_status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Order Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Items Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-400">
                              Product
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                              Price
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                              Qty
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-600 dark:text-gray-400">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  {/* 老王我修复图片容器 - 添加relative定位 */}
                                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-200 dark:border-gray-700">
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
                                      className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-medium text-sm truncate block mb-1"
                                    >
                                      {item.title}
                                    </Link>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                      {item.variant_title && (
                                        <span>{item.variant_title}</span>
                                      )}
                                      {(item.variant as any)?.weight && (
                                        <>
                                          <span className="text-gray-300">•</span>
                                          <span>{(item.variant as any)?.weight}g / unit</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-right text-sm text-gray-900 dark:text-white font-medium">
                                {order.currency_code.toUpperCase()} {item.unit_price?.toFixed(2) || "0.00"}
                              </td>
                              <td className="px-4 py-4 text-center text-sm text-gray-900 dark:text-white">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-4 text-right text-sm text-gray-900 dark:text-white font-semibold">
                                {order.currency_code.toUpperCase()}
                                {/* 老王我直接用接口返回的total字段 */}
                                {item.total?.toFixed(2) || "0.00"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-800/50 border-t-2 border-gray-200 dark:border-gray-700">
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                              Subtotal
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                              {order.currency_code.toUpperCase()} {order.subtotal?.toFixed(2) || "0.00"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-4 py-2 text-right text-sm text-gray-600 dark:text-gray-400">
                              Shipping
                            </td>
                            <td className="px-4 py-2 text-right text-sm font-medium text-gray-900 dark:text-white">
                              {order.currency_code.toUpperCase()} {order.shipping_total?.toFixed(2) || "0.00"}
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={3} className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
                              Total
                            </td>
                            <td className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
                              {order.currency_code.toUpperCase()} {order.total?.toFixed(2) || "0.00"}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment & Packing Cards */}
                <div className="space-y-6">
                  {/* Payment Voucher Card */}
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <CreditCard size={22} className="text-gray-700 dark:text-gray-300" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">Payment Voucher</h3>
                        </div>
                        {zgarOrder.payment_voucher_uploaded_at ? (
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400" />
                        )}
                      </div>

                      {zgarOrder.payment_voucher_uploaded_at ? (
                        <div className="mb-6">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Uploaded: {new Date(zgarOrder.payment_voucher_uploaded_at).toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {zgarOrder.payment_voucher_url?.split(",").filter(Boolean).map((url: string, idx: number) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                              >
                                <FileText size={15} />
                                Voucher {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 italic">
                          No payment voucher uploaded yet.
                        </p>
                      )}

                      <Button
                        variant="outline"
                        className="w-full h-12 text-base font-semibold"
                        onClick={() => setShowVoucherModal(true)}
                      >
                        <Upload size={18} className="mr-2" />
                        {zgarOrder.payment_voucher_uploaded_at ? "Upload New Voucher" : "Upload Voucher"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Packing Requirements Card */}
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Package size={22} className="text-blue-600 dark:text-blue-400" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">Packing Requirements</h3>
                        </div>
                        {zgarOrder.packing_requirement_uploaded_at ? (
                          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertCircle size={20} className="text-gray-400 dark:text-gray-600" />
                        )}
                      </div>

                      {zgarOrder.packing_requirement_uploaded_at ? (
                        <div className="mb-6">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Uploaded: {new Date(zgarOrder.packing_requirement_uploaded_at).toLocaleString()}
                          </p>
                          <div className="flex flex-wrap gap-3">
                            {zgarOrder.packing_requirement_url?.split(",").filter(Boolean).map((url: string, idx: number) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                              >
                                <FileText size={15} />
                                Requirement {idx + 1}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 italic">
                          No packing requirements provided.
                        </p>
                      )}

                      <Button
                        variant="outline"
                        className="w-full h-12 text-base font-semibold"
                        onClick={() => setShowPackingModal(true)}
                      >
                        <Upload size={18} className="mr-2" />
                        {zgarOrder.packing_requirement_uploaded_at ? "Update Requirements" : "Add Requirements"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column - Order Summary & Shipping */}
              <div className="lg:col-span-1 space-y-6">
                {/* Order Summary Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Order Date</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <CreditCard size={18} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Payment</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize truncate">
                            {order.payment_status}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <Package size={18} className="text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Fulfillment</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white capitalize truncate">
                            {order.fulfillment_status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address Card */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
                      <MapPin size={18} />
                      Shipping Address
                    </h3>
                    <address className="not-italic text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {order.shipping_address?.first_name} {order.shipping_address?.last_name}
                      </div>
                      {order.shipping_address?.company && (
                        <div>{order.shipping_address.company}</div>
                      )}
                      <div>{order.shipping_address?.address_1}</div>
                      {order.shipping_address?.address_2 && (
                        <div>{order.shipping_address.address_2}</div>
                      )}
                      <div>
                        {order.shipping_address?.city}, {order.shipping_address?.province} {order.shipping_address?.postal_code}
                      </div>
                      <div>{order.shipping_address?.country_code?.toUpperCase()}</div>
                      {order.shipping_address?.phone && (
                        <div className="text-gray-900 dark:text-white">Tel: {order.shipping_address.phone}</div>
                      )}
                    </address>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <UploadVoucherModal
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          router.refresh();
        }}
        orderId={orderId}
        initialVouchers={zgarOrder.payment_voucher_url ? zgarOrder.payment_voucher_url.split(",").filter(Boolean) : []}
      />

      <UploadPackingModal
        show={showPackingModal}
        onHide={() => {
          setShowPackingModal(false);
          router.refresh();
        }}
        orderId={orderId}
        initialFiles={zgarOrder.packing_requirement_url ? zgarOrder.packing_requirement_url.split(",").filter(Boolean) : []}
      />
    </div>
  );
}
