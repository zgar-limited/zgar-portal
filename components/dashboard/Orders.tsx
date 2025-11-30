"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Sidebar from "./Sidebar";
import { useQuery } from "@tanstack/react-query";
import { medusaSDK } from "@/utils/medusa";
import { useAuth } from "@/context/AuthContext";

export default function Orders() {
  const { customer } = useAuth();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", customer?.id],
    queryFn: async () => {
      if (!customer?.id) return { orders: [] };

      const res = await medusaSDK.store.order.list({
        fields:
          "+items.title,+items.thumbnail,+items.quantity,+items.unit_price,+items.variant_title",
        limit: 20,
        offset: 0,
      });
      return res;
    },
    enabled: !!customer?.id,
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
              <h2 className="account-title type-semibold">My Order</h2>
              <div className="overflow-auto">
                <table className="table-my_order">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Products</th>
                      <th>Pricing</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          Loading orders...
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center">
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, index) => (
                        <tr key={order.id} className="tb-order-item">
                          <td className="tb-order_code">#{order.display_id}</td>
                          <td>
                            {order.items?.map((item, i) => (
                              <div
                                key={item.id}
                                className="mb-2 tb-order_product"
                              >
                                <Link
                                  href={`/product-detail/${
                                    item.variant?.product_id || ""
                                  }`} // Assuming variant has product_id or link to product
                                  className="img-prd"
                                >
                                  <Image
                                    className="lazyload"
                                    src={
                                      item.thumbnail ||
                                      "https://placehold.co/100"
                                    }
                                    alt={item.title}
                                    width={1044}
                                    height={1392}
                                  />
                                </Link>
                                <div className="infor-prd">
                                  <h6>
                                    <Link
                                      href={`/product-detail/${
                                        item.variant?.product_id || ""
                                      }`}
                                      className="prd_name link"
                                    >
                                      {item.title}
                                    </Link>
                                  </h6>
                                  <p className="prd_select text-small">
                                    {item.variant_title && (
                                      <span>{item.variant_title}</span>
                                    )}
                                    <span className="ms-2">
                                      Qty: {item.quantity}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </td>
                          <td className="tb-order_price">
                            {/* Assuming currency_code is available, else default to symbol */}
                            {order.currency_code?.toUpperCase()}{" "}
                            {(order.total / 100).toFixed(2)}
                          </td>
                          <td>
                            <div
                              className={`tb-order_status ${
                                order.status === "completed"
                                  ? "success"
                                  : order.status === "pending"
                                  ? "warning"
                                  : "danger"
                              }`}
                            >
                              {order.status}
                            </div>
                          </td>
                          <td>
                            <Link
                              href={`/account-orders-detail/${order.id}`}
                              className="btn-view"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination - hidden if not implemented fully */}
              {/* <div className="mt-4 wd-full wg-pagination"> ... </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
