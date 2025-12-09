"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { medusaSDK } from "@/utils/medusa";
import { Table, Button, Badge, Pagination, Spinner } from "react-bootstrap";
import { Eye, Upload, Package, ShoppingBag } from "lucide-react";
import UploadVoucherModal from "../modals/UploadVoucherModal";
import UploadPackingModal from "../modals/UploadPackingModal";
import { StoreOrderListResponse } from "@medusajs/types";

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderVouchers, setSelectedOrderVouchers] = useState<string[]>(
    []
  );
  const [selectedOrderPackingFiles, setSelectedOrderPackingFiles] = useState<
    string[]
  >([]);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", offset, limit],
    queryFn: async () => {
      const res = await medusaSDK.store.order.list({
        fields:
          "+items.title,+items.thumbnail,+items.quantity,+items.unit_price,+items.variant_title,+items.product_id,+payment_voucher_uploaded_at,+payment_voucher_url,+packing_requirement_uploaded_at,+packing_requirement_url,zgar_order.*",
        limit: limit,
        offset: offset,
        order: "-created_at",
      });
      return res;
    },
    enabled: true,
  });

  const orders = ordersData?.orders || [];
  const count = ordersData?.count || 0;
  const totalPages = Math.ceil(count / limit);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 d-none d-xl-block">
            <Sidebar />
          </div>
          <div className="col-xl-9">
            <div className="my-account-content">
              <h2 className="mb-4 account-title type-semibold">My Order</h2>

              <div
                className="overflow-hidden bg-white rounded-3"
                style={{
                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <div className="table-responsive">
                  <Table
                    hover
                    className="mb-0 align-middle"
                    style={{ fontSize: "0.8125rem" }}
                  >
                    <colgroup>
                      <col style={{ width: "8%", minWidth: "70px" }} />
                      <col style={{ width: "37%", minWidth: "250px" }} />
                      <col style={{ width: "12%", minWidth: "90px" }} />
                      <col style={{ width: "10%", minWidth: "80px" }} />
                      <col style={{ width: "33%", minWidth: "240px" }} />
                    </colgroup>
                    <thead className="bg-light">
                      <tr>
                        <th
                          className="py-2 ps-3 border-bottom-0 text-muted text-uppercase small fw-bold"
                          style={{ letterSpacing: "0.5px" }}
                        >
                          Order
                        </th>
                        <th
                          className="py-2 border-bottom-0 text-muted text-uppercase small fw-bold"
                          style={{ letterSpacing: "0.5px" }}
                        >
                          Products
                        </th>
                        <th
                          className="py-2 border-bottom-0 text-muted text-uppercase small fw-bold text-end"
                          style={{ letterSpacing: "0.5px" }}
                        >
                          Total
                        </th>
                        <th
                          className="py-2 text-center border-bottom-0 text-muted text-uppercase small fw-bold"
                          style={{ letterSpacing: "0.5px" }}
                        >
                          Status
                        </th>
                        <th
                          className="py-2 pe-3 border-bottom-0 text-muted text-uppercase small fw-bold text-end"
                          style={{ letterSpacing: "0.5px" }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-5 text-center text-muted"
                          >
                            <div className="gap-2 d-flex flex-column align-items-center">
                              <Spinner
                                animation="border"
                                size="sm"
                                variant="secondary"
                              />
                              <span>Loading orders...</span>
                            </div>
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-5 text-center text-muted"
                          >
                            <div className="gap-2 d-flex flex-column align-items-center">
                              <ShoppingBag
                                size={32}
                                className="opacity-50 text-muted"
                              />
                              <span>No orders found.</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr
                            key={order.id}
                            style={{ transition: "background-color 0.2s" }}
                          >
                            <td className="py-2 fw-medium ps-3">
                              #{order.display_id}
                            </td>
                            <td className="py-2">
                              {order.items?.map((item) => (
                                <div
                                  key={item.id}
                                  className="gap-2 mb-1 d-flex align-items-center last:mb-0"
                                >
                                  <Link
                                    href={`/product-detail/${
                                      item.product_id ||
                                      item.variant?.product_id ||
                                      ""
                                    }`}
                                    className="flex-shrink-0"
                                  >
                                    <div
                                      style={{
                                        width: "36px",
                                        height: "36px",
                                        position: "relative",
                                        overflow: "hidden",
                                        borderRadius: "6px",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                        border: "1px solid rgba(0,0,0,0.05)",
                                      }}
                                    >
                                      <Image
                                        className="lazyload object-fit-cover"
                                        src={
                                          item.thumbnail ||
                                          "https://placehold.co/100"
                                        }
                                        alt={item.title}
                                        fill
                                        sizes="36px"
                                      />
                                    </div>
                                  </Link>
                                  <div
                                    className="flex-grow-1"
                                    style={{ minWidth: 0 }}
                                  >
                                    <h6
                                      className="mb-0 text-truncate"
                                      style={{
                                        fontSize: "0.8125rem",
                                        maxWidth: "220px",
                                        lineHeight: "1.2",
                                      }}
                                    >
                                      <Link
                                        href={`/product-detail/${
                                          item.product_id ||
                                          item.variant?.product_id ||
                                          ""
                                        }`}
                                        className="text-dark text-decoration-none hover-primary"
                                      >
                                        {item.title}
                                      </Link>
                                    </h6>
                                    <div className="gap-1 mt-0 text-muted small d-flex align-items-center">
                                      {item.variant_title && (
                                        <span
                                          className="px-1 border badge bg-light text-secondary fw-normal"
                                          style={{ fontSize: "0.65rem" }}
                                        >
                                          {item.variant_title}
                                        </span>
                                      )}
                                      <span style={{ fontSize: "0.7rem" }}>
                                        x{item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </td>
                            <td className="py-2 fw-medium text-end font-monospace">
                              {order.currency_code?.toUpperCase()}{" "}
                              {(order.total / 100).toFixed(2)}
                            </td>
                            <td className="py-2 text-center">
                              <Badge
                                bg={
                                  order.status === "completed"
                                    ? "success"
                                    : order.status === "pending"
                                    ? "warning"
                                    : "danger"
                                }
                                className="px-2 py-0.5 shadow-sm fw-normal rounded-pill"
                                style={{
                                  fontSize: "0.7rem",
                                  letterSpacing: "0.3px",
                                }}
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-2 pe-3">
                              <div className="gap-1 d-flex justify-content-end">
                                <Link
                                  href={`/account-orders-detail/${order.id}`}
                                  className="btn btn-outline-secondary btn-sm gap-1 px-2 py-0.5 border-0 d-inline-flex align-items-center bg-light text-dark"
                                  title="View Details"
                                  style={{
                                    fontSize: "0.75rem",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  <Eye size={13} />
                                  <span className="d-none d-xl-inline">
                                    View
                                  </span>
                                </Link>
                                <Button
                                  variant={
                                    (order as any).zgar_order
                                      ?.payment_voucher_uploaded_at
                                      ? "outline-success"
                                      : "outline-primary"
                                  }
                                  size="sm"
                                  className={`gap-1 px-2 py-0.5 border-0 d-inline-flex align-items-center ${
                                    (order as any).zgar_order
                                      ?.payment_voucher_uploaded_at
                                      ? "bg-success-subtle text-success"
                                      : "bg-primary-subtle text-primary"
                                  }`}
                                  title={
                                    (order as any).zgar_order
                                      ?.payment_voucher_uploaded_at
                                      ? "Edit Payment Voucher"
                                      : "Upload Payment Voucher"
                                  }
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    const vouchers =
                                      (order as any).zgar_order?.payment_voucher_url;
                                    let voucherList: string[] = [];
                                    if (typeof vouchers === "string") {
                                      voucherList = vouchers
                                        .split(",")
                                        .map((v: string) => v.trim())
                                        .filter(Boolean);
                                    }
                                    setSelectedOrderVouchers(voucherList);
                                    setShowVoucherModal(true);
                                  }}
                                  style={{
                                    fontSize: "0.75rem",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  <Upload size={13} />
                                  <span className="d-none d-xl-inline">
                                    {(order as any).zgar_order
                                      ?.payment_voucher_uploaded_at
                                      ? "Edit Voucher"
                                      : "Voucher"}
                                  </span>
                                </Button>
                                <Button
                                  variant={
                                    (order as any).zgar_order
                                      ?.packing_requirement_uploaded_at
                                      ? "outline-info"
                                      : "outline-secondary"
                                  }
                                  size="sm"
                                  className={`gap-1 px-2 py-0.5 border-0 d-inline-flex align-items-center ${
                                    (order as any).zgar_order
                                      ?.packing_requirement_uploaded_at
                                      ? "bg-info-subtle text-info-emphasis"
                                      : "bg-light text-secondary"
                                  }`}
                                  title={
                                    (order as any).zgar_order
                                      ?.packing_requirement_uploaded_at
                                      ? "Edit Packing Requirements"
                                      : "Upload Packing Requirements"
                                  }
                                  onClick={() => {
                                    setSelectedOrderId(order.id);
                                    const files =
                                      (order as any).zgar_order
                                        ?.packing_requirement_url ||
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
                                  }}
                                  style={{
                                    fontSize: "0.75rem",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                  }}
                                >
                                  <Package size={13} />
                                  <span className="d-none d-xl-inline">
                                    {(order as any).zgar_order
                                      ?.packing_requirement_uploaded_at
                                      ? "Edit Packing"
                                      : "Packing"}
                                  </span>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 d-flex justify-content-center">
                  <div className="p-1 bg-white border shadow-sm rounded-pill">
                    <Pagination className="gap-1 mb-0">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-circle"
                        style={{ border: "none" }}
                      />
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Pagination.Item
                            key={page}
                            active={page === currentPage}
                            onClick={() => handlePageChange(page)}
                            className="rounded-circle"
                          >
                            {page}
                          </Pagination.Item>
                        )
                      )}
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="rounded-circle"
                        style={{ border: "none" }}
                      />
                    </Pagination>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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
    </section>
  );
}
