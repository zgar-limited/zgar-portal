"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pencil } from "lucide-react";
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { medusaSDK } from "@/utils/medusa";
import { Eye } from "lucide-react";

export default function MyAccount() {
  const wallet = {
    balance: 1250.0,
    points: 350,
    coupons: 5,
    currency: "$",
  };

  const tasks = [
    {
      id: 1,
      title: "Complete Profile",
      description: "Fill in all your personal details",
      status: "Pending",
      progress: 70,
      reward: "50 Points",
    },
    {
      id: 2,
      title: "First Order",
      description: "Place your first order over $100",
      status: "Completed",
      progress: 100,
      reward: "100 Points",
    },
    {
      id: 3,
      title: "Subscribe Newsletter",
      description: "Get updates on latest products",
      status: "Pending",
      progress: 0,
      reward: "20 Points",
    },
  ];

  const redemptionItems = [
    {
      id: 1,
      title: "$10 Discount Coupon",
      cost: 100,
      image: "/images/products/product-1.jpg",
    },
    {
      id: 2,
      title: "Free Shipping Voucher",
      cost: 50,
      image: "/images/products/product-2.jpg",
    },
    {
      id: 3,
      title: "$25 Gift Card",
      cost: 250,
      image: "/images/products/product-3.jpg",
    },
    {
      id: 4,
      title: "Premium Support",
      cost: 500,
      image: "/images/products/product-4.jpg",
    },
  ];

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await medusaSDK.store.order.list({
        fields: "+items.title,+items.thumbnail,+items.quantity,+items.unit_price,+items.variant_title",
        limit: 5, // Show recent 5 orders
        offset: 0,
      });
      return res;
    },
    enabled: true,
  });

  const orders = ordersData?.orders || [];

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 d-none d-xl-block">
            <Sidebar />
          </div>
          <div className="col-xl-9">
            <div className="my-account-content">
              {/* 1. User Info & Wallet Section */}
              <div className="mb-5">
                <div className="row g-4">
                  {/* User Info */}
                  <div className="col-md-4">
                    <div className="p-4 bg-white border-0 account-box-shadow rounded-4 h-100 d-flex flex-column position-relative">
                      <button
                        className="top-0 gap-1 p-0 m-3 position-absolute end-0 btn btn-link text-muted text-decoration-none d-flex align-items-center"
                        style={{ fontSize: "0.875rem" }}
                      >
                        <Pencil size={14} />
                        <span>Edit</span>
                      </button>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">
                          Guest User
                        </h5>
                        <p className="mb-2 text-muted text-small">
                          guest@example.com
                        </p>
                        <div className="gap-2 mb-3 d-flex align-items-center">
                          <span className="badge bg-primary-subtle text-primary rounded-pill">
                            Member
                          </span>
                        </div>
                        <p className="mb-0 text-muted text-small">
                          Member since today
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="col-md-4">
                    <div className="p-4 bg-white border-0 account-box-shadow rounded-4 h-100 d-flex flex-column">
                      <div className="mb-2 text-muted text-small text-uppercase fw-bold">
                        Balance
                      </div>
                      <h3 className="mb-0 text-primary">
                        {wallet.currency}
                        {wallet.balance.toFixed(2)}
                      </h3>
                      <div className="pt-3 mt-auto">
                        <Link
                          href="/account-wallet"
                          className="text-decoration-underline text-small fw-semibold"
                        >
                          View History
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-md-4">
                    <div className="p-4 bg-white border-0 account-box-shadow rounded-4 h-100 d-flex flex-column">
                      <div className="mb-2 text-muted text-small text-uppercase fw-bold">
                        Points
                      </div>
                      <h3 className="mb-0 text-warning">{wallet.points}</h3>
                      <div className="mt-2 text-small text-muted">
                        Points available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Redemption Center */}
              <div className="mb-5">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <h4 className="mb-0">Redemption Center</h4>
                  <Link href="/rewards" className="tf-btn-link">
                    View All <i className="icon-arrow-right" />
                  </Link>
                </div>
                <Swiper
                  dir="ltr"
                  className="swiper tf-swiper swiper-shadow-fix"
                  spaceBetween={16}
                  breakpoints={{
                    0: { slidesPerView: 2, spaceBetween: 16 },
                    768: { slidesPerView: 3, spaceBetween: 24 },
                    1200: { slidesPerView: 4, spaceBetween: 24 },
                  }}
                  modules={[Pagination]}
                  pagination={{ clickable: true, el: ".spd-redemption" }}
                >
                  {redemptionItems.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div className="overflow-hidden border-0 account-box-shadow card h-100 rounded-4">
                        <div className="position-relative aspect-ratio-1x1">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-fit-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h6 className="mb-2 text-truncate" title={item.title}>
                            {item.title}
                          </h6>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-warning fw-bold text-small">
                              {item.cost} Pts
                            </span>
                            <button className="h-auto px-3 py-1 tf-btn btn-sm btn-fill rounded-pill fs-12 hover-effect">
                              Redeem
                            </button>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                  <div className="mt-4 sw-dot-default tf-sw-pagination spd-redemption" />
                </Swiper>
              </div>

              {/* 4. Task Center */}
              <div className="mb-5">
                <h4 className="mb-4">Task Center</h4>
                <div className="overflow-hidden bg-white border-0 account-box-shadow rounded-4">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`p-4 d-flex flex-column flex-md-row align-items-center gap-4 ${
                        index !== tasks.length - 1 ? "border-bottom" : ""
                      }`}
                    >
                      <div className="text-center flex-grow-1 text-md-start">
                        <h6 className="mb-1">{task.title}</h6>
                        <p className="mb-2 text-muted text-small">
                          {task.description}
                        </p>
                        <div
                          className="progress"
                          style={{ height: "6px", maxWidth: "200px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${task.progress}%` }}
                            aria-valuenow={task.progress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          ></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="mb-2 badge bg-warning-subtle text-warning d-block">
                          +{task.reward}
                        </span>
                      </div>
                      <div>
                        {task.status === "Completed" ? (
                          <button
                            className="tf-btn type-very-small btn-outline-success rounded-pill"
                            disabled
                          >
                            Completed
                          </button>
                        ) : (
                          <button className="tf-btn type-very-small btn-fill rounded-pill hover-effect">
                            Go to Task
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Orders Table */}
              <div className="mb-5">
                <h4 className="mb-4">Recent Orders</h4>
                <div
                  className="overflow-hidden bg-white rounded-3"
                  style={{
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="table-responsive">
                    <table className="table mb-0 align-middle" style={{ fontSize: "0.8125rem" }}>
                      <colgroup>
                        <col style={{ width: "8%", minWidth: "70px" }} />
                        <col style={{ width: "37%", minWidth: "250px" }} />
                        <col style={{ width: "12%", minWidth: "90px" }} />
                        <col style={{ width: "10%", minWidth: "80px" }} />
                        <col style={{ width: "33%", minWidth: "240px" }} />
                      </colgroup>
                      <thead className="bg-light">
                        <tr>
                          <th className="py-2 ps-3 border-bottom-0 text-muted text-uppercase small fw-bold" style={{ letterSpacing: "0.5px" }}>Order</th>
                          <th className="py-2 border-bottom-0 text-muted text-uppercase small fw-bold" style={{ letterSpacing: "0.5px" }}>Products</th>
                          <th className="py-2 border-bottom-0 text-muted text-uppercase small fw-bold text-end" style={{ letterSpacing: "0.5px" }}>Total</th>
                          <th className="py-2 text-center border-bottom-0 text-muted text-uppercase small fw-bold" style={{ letterSpacing: "0.5px" }}>Status</th>
                          <th className="py-2 pe-3 border-bottom-0 text-muted text-uppercase small fw-bold text-end" style={{ letterSpacing: "0.5px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={5} className="py-5 text-center text-muted">
                              Loading orders...
                            </td>
                          </tr>
                        ) : orders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-5 text-center text-muted">
                              No recent orders found.
                            </td>
                          </tr>
                        ) : (
                          orders.map((order) => (
                            <tr key={order.id} style={{ transition: "background-color 0.2s" }}>
                              <td className="py-2 fw-medium ps-3">
                                #{order.display_id}
                              </td>
                              <td className="py-2">
                                {order.items?.slice(0, 1).map((item) => (
                                  <div
                                    key={item.id}
                                    className="gap-2 mb-1 d-flex align-items-center"
                                  >
                                    <div
                                      className="flex-shrink-0"
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
                                        src={item.thumbnail || "https://placehold.co/100"}
                                        alt={item.title}
                                        fill
                                        className="object-fit-cover"
                                        sizes="36px"
                                      />
                                    </div>
                                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
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
                                          <span className="px-1 border badge bg-light text-secondary fw-normal" style={{ fontSize: "0.65rem" }}>
                                            {item.variant_title}
                                          </span>
                                        )}
                                        <span style={{ fontSize: "0.7rem" }}>
                                          x{item.quantity}
                                          {order.items.length > 1 && ` + ${order.items.length - 1} more`}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </td>
                              <td className="py-2 fw-medium text-end font-monospace">
                                {order.currency_code?.toUpperCase()} {(order.total / 100).toFixed(2)}
                              </td>
                              <td className="py-2 text-center">
                                <span
                                  className={`badge px-2 py-0.5 shadow-sm fw-normal rounded-pill ${
                                    order.status === "completed"
                                      ? "bg-success text-white"
                                      : order.status === "pending"
                                      ? "bg-warning text-dark"
                                      : "bg-danger text-white"
                                  }`}
                                  style={{
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.3px",
                                  }}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-2 pe-3">
                                <div className="d-flex justify-content-end">
                                  <Link
                                    href={`/account-orders-detail/${order.id}`}
                                    className="gap-1 px-2 py-0.5 border-0 btn btn-outline-secondary btn-sm d-inline-flex align-items-center bg-light text-dark"
                                    style={{
                                      fontSize: "0.75rem",
                                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                    }}
                                  >
                                    <Eye size={13} />
                                    <span className="d-none d-xl-inline">View</span>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link href="/account-orders" className="tf-btn btn-line">
                    View All Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
