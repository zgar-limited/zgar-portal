"use client";
import React from "react";
import Image from "next/image";
import { Link } from '@/i18n/routing';
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { medusaSDK } from "@/utils/medusa";
import { useParams } from "next/navigation";
import { Spinner, Badge, Button, Card, Row, Col } from "react-bootstrap";
import {
  ChevronLeft,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
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

export default function OrderDetails() {
  const params = useParams();
  const orderId = params.id as string;
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showPackingModal, setShowPackingModal] = useState(false);

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await medusaSDK.store.order.retrieve(orderId, {
        fields:
          "+items.title,+items.thumbnail,+items.quantity,+items.unit_price,+items.variant_title,+items.product_id,+items.variant.weight,+items.variant.options,+payment_voucher_uploaded_at,+payment_voucher_url,+packing_requirement_uploaded_at,+packing_requirement_url,zgar_order.*,+shipping_address.*,+billing_address.*",
      });
      return res.order;
    },
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div
        className="py-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="secondary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order not found</h3>
        <Link href="/account-orders" className="mt-3 btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  const zgarOrder = (order as any).zgar_order || {};

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 d-none d-xl-block">
            <Sidebar />
          </div>
          <div className="col-xl-9">
            <div className="my-account-content">
              {/* Header */}
              <div className="mb-4 d-flex justify-content-between align-items-center">
                <div className="gap-3 d-flex align-items-center">
                  <Link
                    href="/account-orders"
                    className="text-muted hover-primary"
                  >
                    <ChevronLeft size={24} />
                  </Link>
                  <h2 className="mb-0 account-title type-semibold">
                    Order #{order.display_id}
                  </h2>
                </div>
                <div className="gap-2 d-flex">
                  <Badge
                    bg={
                      order.status === OrderStatus.COMPLETED
                        ? "success"
                        : order.status === OrderStatus.PENDING
                        ? "warning"
                        : "danger"
                    }
                    className="px-3 py-2 fw-normal rounded-pill"
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                  {zgarOrder.audit_status && (
                    <Badge
                      bg={
                        zgarOrder.audit_status === AuditStatus.APPROVED
                          ? "success"
                          : zgarOrder.audit_status === AuditStatus.PENDING
                          ? "info"
                          : "danger"
                      }
                      className="px-3 py-2 fw-normal rounded-pill"
                    >
                      Audit: {zgarOrder.audit_status.toUpperCase()}
                    </Badge>
                  )}
                </div>
              </div>

              <Row className="g-4">
                {/* Main Content Area */}
                <Col lg={8}>
                  {/* Order Items */}
                  <Card className="mb-4 border-0 shadow-xs rounded-4">
                    <Card.Header className="py-3 bg-white border-bottom-0">
                      <h5 className="mb-0 fw-bold">Order Items</h5>
                    </Card.Header>
                    <div className="table-responsive">
                      <table className="table mb-0 align-middle">
                        <thead className="bg-light">
                          <tr>
                            <th className="py-3 ps-4 border-bottom-0">
                              Product
                            </th>
                            <th className="py-3 text-end border-bottom-0">
                              Price
                            </th>
                            <th className="py-3 text-center border-bottom-0">
                              Qty
                            </th>
                            <th className="py-3 pe-4 text-end border-bottom-0">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.id}>
                              <td className="ps-4">
                                <div className="gap-3 d-flex align-items-center">
                                  <div
                                    className="shrink-0 overflow-hidden border rounded-sm position-relative"
                                    style={{ width: "60px", height: "60px" }}
                                  >
                                    <Image
                                      src={
                                        item.thumbnail ||
                                        "https://placehold.co/100"
                                      }
                                      alt={item.title}
                                      fill
                                      className="object-fit-cover"
                                    />
                                  </div>
                                  <div>
                                    <h6
                                      className="mb-1 text-truncate"
                                      style={{ maxWidth: "200px" }}
                                    >
                                      <Link
                                        href={`/product-detail/${
                                          item.variant?.product_id || ""
                                        }`}
                                        className="text-dark text-decoration-none"
                                      >
                                        {item.title}
                                      </Link>
                                    </h6>
                                    <div className="text-muted small">
                                      {item.variant_title && (
                                        <span className="me-2">
                                          {item.variant_title}
                                        </span>
                                      )}
                                      <span className="text-secondary">
                                        {(item.variant as any)?.weight}g / unit
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="text-end">
                                {order.currency_code.toUpperCase()}{" "}
                                {(item.unit_price / 100).toFixed(2)}
                              </td>
                              <td className="text-center">{item.quantity}</td>
                              <td className="pe-4 text-end fw-semibold">
                                {order.currency_code.toUpperCase()}{" "}
                                {(
                                  (item.unit_price * item.quantity) /
                                  100
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-top">
                          <tr>
                            <td
                              colSpan={3}
                              className="pt-3 pb-1 border-0 text-end text-muted"
                            >
                              Subtotal
                            </td>
                            <td className="pt-3 pb-1 border-0 text-end pe-4 fw-medium">
                              {order.currency_code.toUpperCase()}{" "}
                              {(order.subtotal / 100).toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              colSpan={3}
                              className="py-1 border-0 text-end text-muted"
                            >
                              Shipping
                            </td>
                            <td className="py-1 border-0 text-end pe-4 fw-medium">
                              {order.currency_code.toUpperCase()}{" "}
                              {(order.shipping_total / 100).toFixed(2)}
                            </td>
                          </tr>

                          <tr>
                            <td
                              colSpan={3}
                              className="pt-1 pb-3 border-0 text-end fw-bold fs-5"
                            >
                              Total
                            </td>
                            <td className="pt-1 pb-3 border-0 text-end pe-4 fw-bold fs-5 text-primary">
                              {order.currency_code.toUpperCase()}{" "}
                              {(order.total / 100).toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </Card>

                  {/* Payment & Packing */}
                  <Row className="g-4">
                    <Col md={6}>
                      <Card className="border-0 shadow-xs h-100 rounded-4">
                        <Card.Body>
                          <div className="mb-3 d-flex justify-content-between align-items-start">
                            <div className="gap-2 d-flex align-items-center">
                              <CreditCard size={20} className="text-primary" />
                              <h6 className="mb-0 fw-bold">Payment Voucher</h6>
                            </div>
                            {zgarOrder.payment_voucher_uploaded_at ? (
                              <CheckCircle size={18} className="text-success" />
                            ) : (
                              <AlertCircle size={18} className="text-warning" />
                            )}
                          </div>

                          {zgarOrder.payment_voucher_uploaded_at ? (
                            <div className="mb-3">
                              <p className="mb-2 small text-muted">
                                Uploaded:{" "}
                                {new Date(
                                  zgarOrder.payment_voucher_uploaded_at
                                ).toLocaleString()}
                              </p>
                              <div className="flex-wrap gap-2 d-flex">
                                {zgarOrder.payment_voucher_url
                                  ?.split(",")
                                  .map((url: string, idx: number) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="gap-2 border btn btn-sm btn-outline-light text-dark d-flex align-items-center"
                                    >
                                      <FileText size={14} /> Voucher {idx + 1}
                                    </a>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <p className="mb-3 text-muted small fst-italic">
                              No payment voucher uploaded yet.
                            </p>
                          )}

                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="gap-2 w-100 d-flex align-items-center justify-content-center"
                            onClick={() => setShowVoucherModal(true)}
                          >
                            <Upload size={14} />
                            {zgarOrder.payment_voucher_uploaded_at
                              ? "Upload New Voucher"
                              : "Upload Voucher"}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card className="border-0 shadow-xs h-100 rounded-4">
                        <Card.Body>
                          <div className="mb-3 d-flex justify-content-between align-items-start">
                            <div className="gap-2 d-flex align-items-center">
                              <Package size={20} className="text-info" />
                              <h6 className="mb-0 fw-bold">
                                Packing Requirements
                              </h6>
                            </div>
                            {zgarOrder.packing_requirement_uploaded_at ? (
                              <CheckCircle size={18} className="text-success" />
                            ) : (
                              <AlertCircle
                                size={18}
                                className="text-secondary"
                              />
                            )}
                          </div>

                          {zgarOrder.packing_requirement_uploaded_at ? (
                            <div className="mb-3">
                              <p className="mb-2 small text-muted">
                                Uploaded:{" "}
                                {new Date(
                                  zgarOrder.packing_requirement_uploaded_at
                                ).toLocaleString()}
                              </p>
                              <div className="flex-wrap gap-2 d-flex">
                                {zgarOrder.packing_requirement_url
                                  ?.split(",")
                                  .map((url: string, idx: number) => (
                                    <a
                                      key={idx}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="gap-2 border btn btn-sm btn-outline-light text-dark d-flex align-items-center"
                                    >
                                      <FileText size={14} /> Requirement{" "}
                                      {idx + 1}
                                    </a>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <p className="mb-3 text-muted small fst-italic">
                              No packing requirements provided.
                            </p>
                          )}

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="gap-2 w-100 d-flex align-items-center justify-content-center"
                            onClick={() => setShowPackingModal(true)}
                          >
                            <Upload size={14} />
                            {zgarOrder.packing_requirement_uploaded_at
                              ? "Update Requirements"
                              : "Add Requirements"}
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                {/* Sidebar Info */}
                <Col lg={4}>
                  <div className="gap-3 d-flex flex-column">
                    {/* Order Summary */}
                    <Card className="border-0 shadow-xs rounded-4">
                      <Card.Body>
                        <h6 className="mb-3 fw-bold">Order Summary</h6>
                        <div className="gap-3 d-flex flex-column">
                          <div className="gap-3 d-flex align-items-center">
                            <div className="p-2 bg-light rounded-circle">
                              <Calendar size={18} className="text-muted" />
                            </div>
                            <div>
                              <div className="small text-muted">Order Date</div>
                              <div className="fw-medium">
                                {new Date(order.created_at).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="gap-3 d-flex align-items-center">
                            <div className="p-2 bg-light rounded-circle">
                              <CreditCard size={18} className="text-muted" />
                            </div>
                            <div>
                              <div className="small text-muted">Payment</div>
                              <div className="fw-medium text-capitalize">
                                {order.payment_status}
                              </div>
                            </div>
                          </div>
                          <div className="gap-3 d-flex align-items-center">
                            <div className="p-2 bg-light rounded-circle">
                              <Package size={18} className="text-muted" />
                            </div>
                            <div>
                              <div className="small text-muted">
                                Fulfillment
                              </div>
                              <div className="fw-medium text-capitalize">
                                {order.fulfillment_status}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>

                    {/* Shipping Address */}
                    <Card className="border-0 shadow-xs rounded-4">
                      <Card.Body>
                        <h6 className="gap-2 mb-3 fw-bold d-flex align-items-center">
                          <MapPin size={18} /> Shipping Address
                        </h6>
                        <address className="mb-0 fst-normal text-muted small">
                          <strong className="mb-1 text-dark d-block">
                            {order.shipping_address?.first_name}{" "}
                            {order.shipping_address?.last_name}
                          </strong>
                          {order.shipping_address?.company && (
                            <span className="mb-1 d-block">
                              {order.shipping_address.company}
                            </span>
                          )}
                          <span className="d-block">
                            {order.shipping_address?.address_1}
                          </span>
                          {order.shipping_address?.address_2 && (
                            <span className="d-block">
                              {order.shipping_address.address_2}
                            </span>
                          )}
                          <span className="d-block">
                            {order.shipping_address?.city},{" "}
                            {order.shipping_address?.province}{" "}
                            {order.shipping_address?.postal_code}
                          </span>
                          <span className="mb-2 d-block">
                            {order.shipping_address?.country_code?.toUpperCase()}
                          </span>
                          {order.shipping_address?.phone && (
                            <span className="d-block text-dark">
                              Tel: {order.shipping_address.phone}
                            </span>
                          )}
                        </address>
                      </Card.Body>
                    </Card>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>

      <UploadVoucherModal
        show={showVoucherModal}
        onHide={() => {
          setShowVoucherModal(false);
          refetch();
        }}
        orderId={orderId}
        initialVouchers={
          zgarOrder.payment_voucher_url
            ? zgarOrder.payment_voucher_url.split(",").filter(Boolean)
            : []
        }
      />

      <UploadPackingModal
        show={showPackingModal}
        onHide={() => {
          setShowPackingModal(false);
          refetch();
        }}
        orderId={orderId}
        initialFiles={
          zgarOrder.packing_requirement_url
            ? zgarOrder.packing_requirement_url.split(",").filter(Boolean)
            : []
        }
      />
    </section>
  );
}
