"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pencil } from "lucide-react";
import Sidebar from "./Sidebar";
import { orders } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

export default function MyAccount() {
  const { customer } = useAuth();

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
                          {customer?.first_name} {customer?.last_name}
                        </h5>
                        <p className="mb-2 text-muted text-small">
                          {customer?.email}
                        </p>
                        <div className="gap-2 mb-3 d-flex align-items-center">
                          <span className="badge bg-primary-subtle text-primary rounded-pill">
                            Member
                          </span>
                        </div>
                        <p className="mb-0 text-muted text-small">
                          Member since{" "}
                          {customer?.created_at
                            ? new Date(customer.created_at).toLocaleDateString()
                            : ""}
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
                <div className="p-3 bg-white account-box-shadow table-responsive rounded-4">
                  <table className="table mb-0 align-middle table-hover w-100">
                    <thead className="bg-light">
                      <tr>
                        <th className="p-3 border-bottom-0 text-muted text-small text-uppercase">Order ID</th>
                        <th className="p-3 border-bottom-0 text-muted text-small text-uppercase">Product Details</th>
                        <th className="p-3 border-bottom-0 text-muted text-small text-uppercase">Total</th>
                        <th className="p-3 border-bottom-0 text-muted text-small text-uppercase">Status</th>
                        <th className="p-3 border-bottom-0 text-muted text-small text-uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index} className="border-bottom-0">
                          <td className="p-3">
                            <span className="fw-bold text-dark">
                              {order.code}
                            </span>
                            <div className="mt-1 text-muted text-small">
                              Oct 24, 2023
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="gap-3 d-flex align-items-center">
                              <div
                                className="flex-shrink-0 border rounded position-relative"
                                style={{ width: "50px", height: "50px" }}
                              >
                                <Image
                                  src={order.imgSrc}
                                  alt={order.alt}
                                  fill
                                  className="rounded object-fit-cover"
                                />
                              </div>
                              <div>
                                <h6
                                  className="mb-1 text-truncate"
                                  style={{ maxWidth: "180px" }}
                                >
                                  <Link
                                    href={`/product-detail/${order.id}`}
                                    className="text-dark"
                                  >
                                    {order.title}
                                  </Link>
                                </h6>
                                <div className="text-small text-muted">
                                  Size: {order.size} | Qty: 1
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="fw-bold">
                              ${order.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`badge  px-3 py-2 ${
                                order.status === "Completed"
                                  ? "bg-success-subtle text-success"
                                  : order.status === "Pending"
                                  ? "bg-warning-subtle text-warning"
                                  : order.status === "Canceled"
                                  ? "bg-danger-subtle text-danger"
                                  : "bg-info-subtle text-info"
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="gap-2 d-flex">
                              <Link
                                href={`/account-orders/${order.id}`}
                                className=" tf-btn btn-outline-dark type-very-small rounded-pill hover-effect"
                              >
                                View
                              </Link>
                              {order.status === "Completed" && (
                                <button className=" tf-btn btn-fill type-very-small rounded-pill hover-effect">
                                  Reorder
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
