"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Sidebar from "./Sidebar";
import { orders } from "@/data/products";

export default function MyAccount() {
  // Mock data for the new sections
  const userInfo = {
    name: "Themesflat",
    email: "support@ochaka.com",
    level: "Gold Member",
    avatar: "/images/avatar/avatar-4.jpg",
    joinDate: "2023-01-15",
  };

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
              {/* 1. User Info Section */}
              <div className="mb_40">
                <h4 className="mb_20">User Info</h4>
                <div className="gap-4 p-4 bg-white border rounded-3 d-flex flex-column flex-md-row align-items-center">
                  <div className="text-center flex-grow-1 text-md-start">
                    <h5 className="mb-1">{userInfo.name}</h5>
                    <p className="mb-2 text-muted">{userInfo.email}</p>
                    <div className="gap-3 d-flex justify-content-center justify-content-md-start">
                      <span className="px-3 py-2 badge bg-primary-subtle text-primary rounded-pill">
                        {userInfo.level}
                      </span>
                      <span className="text-muted align-self-center text-small">
                        Member since {userInfo.joinDate}
                      </span>
                    </div>
                  </div>
                  <div className="gap-2 d-flex">
                    <button className="tf-btn btn-outline-dark btn-sm radius-3">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Wallet Section */}
              <div className="mb_40">
                <h4 className="mb_20">My Wallet</h4>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="p-4 text-center bg-white border rounded-3 h-100 text-md-start">
                      <div className="mb-2 text-muted text-small text-uppercase fw-bold">
                        Balance
                      </div>
                      <h3 className="mb-0 text-primary">
                        {wallet.currency}
                        {wallet.balance.toFixed(2)}
                      </h3>
                      <Link
                        href="/account-wallet"
                        className="mt-2 text-decoration-underline text-small d-inline-block"
                      >
                        View History
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4 text-center bg-white border rounded-3 h-100 text-md-start">
                      <div className="mb-2 text-muted text-small text-uppercase fw-bold">
                        Points
                      </div>
                      <h3 className="mb-0 text-warning">{wallet.points}</h3>
                      <div className="mt-2 text-small text-muted">
                        Points available
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-4 text-center bg-white border rounded-3 h-100 text-md-start">
                      <div className="mb-2 text-muted text-small text-uppercase fw-bold">
                        Coupons
                      </div>
                      <h3 className="mb-0 text-success">{wallet.coupons}</h3>
                      <div className="mt-2 text-small text-muted">
                        Active coupons
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Redemption Center */}
              <div className="mb_40">
                <div className="d-flex justify-content-between align-items-center mb_20">
                  <h4 className="mb-0">Redemption Center</h4>
                  <Link href="/rewards" className="tf-btn-link">
                    View All <i className="icon-arrow-right" />
                  </Link>
                </div>
                <div className="row row-cols-2 row-cols-md-4 g-3">
                  {redemptionItems.map((item) => (
                    <div key={item.id} className="col">
                      <div className="overflow-hidden border card h-100 rounded-3">
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
                            <button className="h-auto px-2 py-1 tf-btn btn-sm btn-fill radius-3 fs-12">
                              Redeem
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Task Center */}
              <div className="mb_40">
                <h4 className="mb_20">Task Center</h4>
                <div className="overflow-hidden bg-white border rounded-3">
                  {tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`p-3 d-flex flex-column flex-md-row align-items-center gap-3 ${
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
                            className="tf-btn btn-outline-success btn-sm radius-3"
                            disabled
                          >
                            Completed
                          </button>
                        ) : (
                          <button className="tf-btn btn-fill btn-sm radius-3">
                            Go to Task
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Orders Table */}
              <div>
                <h4 className="mb_20">Recent Orders</h4>
                <div className="overflow-auto">
                  <table className="table-my_order order_recent w-100">
                    <thead>
                      <tr className="bg-light">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Product Details</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="p-3 align-middle">
                            <span className="fw-bold text-dark">
                              {order.code}
                            </span>
                            <div className="mt-1 text-muted text-small">
                              Oct 24, 2023
                            </div>
                          </td>
                          <td className="p-3 align-middle">
                            <div className="gap-3 d-flex align-items-center">
                              <div
                                className="flex-shrink-0 border rounded position-relative"
                                style={{ width: "60px", height: "60px" }}
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
                                  style={{ maxWidth: "200px" }}
                                >
                                  <Link
                                    href={`/product-detail/${order.id}`}
                                    className="text-dark"
                                  >
                                    {order.title}
                                  </Link>
                                </h6>
                                <div className="text-small text-muted">
                                  SKU: {order.id}00{index} <br />
                                  Size: {order.size} | Qty: 1
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 align-middle">
                            <span className="fw-bold">
                              ${order.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-3 align-middle">
                            <span
                              className={`badge rounded-pill px-3 py-2 ${
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
                          <td className="p-3 align-middle">
                            <div className="gap-2 d-flex">
                              <Link
                                href={`/account-orders/${order.id}`}
                                className="px-3 tf-btn btn-outline-dark btn-sm radius-3"
                              >
                                View
                              </Link>
                              {order.status === "Completed" && (
                                <button className="px-3 tf-btn btn-fill btn-sm radius-3">
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
