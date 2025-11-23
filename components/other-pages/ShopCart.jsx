"use client";
import Image from "next/image";
import React from "react";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import QuantitySelect from "../common/QuantitySelect";
import { ChevronDown, PackagePlus, ShoppingCart, X } from "lucide-react";

import ProductsSelectModal from "../modals/ProductsSelectModal";

export default function ShopCart() {
  const { cartProducts, totalPrice, removeProductFromCart, updateQuantity } =
    useContextElement();
  return (
    <div className="flat-spacing each-list-prd">
      <div className="container">
        <div className="row">
          <div className="col-xxl-9 col-xl-8">
            <form onSubmit={(e) => e.preventDefault()}>
              <table className="tf-table-page-cart">
                <thead>
                  <tr>
                    <th className="h6">Product</th>
                    <th className="h6">Price</th>
                    <th className="h6">Quantity</th>
                    <th className="h6">Total price</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cartProducts.map((product, i) => (
                    <tr key={i} className="tf-cart_item">
                      <td>
                        <div className="cart_product">
                          <Link
                            href={`/product-detail/${product.id}`}
                            className="img-prd"
                          >
                            <Image
                              className="lazyload"
                              src={"https://picsum.photos/100/100"}
                              alt="T Shirt"
                              width={100}
                              height={100}
                            />
                          </Link>
                          <div className="infor-prd">
                            <h6 className="prd_name">
                              <button
                                data-bs-toggle="offcanvas"
                                data-bs-target="#productsSelectModel"
                                className="flex items-center link text-start"
                              >
                                {product.title}
                                <ChevronDown className=" size-5" />
                              </button>
                            </h6>
                            <div className="prd_select text-small">
                              Size:
                              <div className="size-select">
                                <select className="bg-white">
                                  <option>XS1</option>
                                  <option>S</option>
                                  <option>M</option>
                                  <option>L</option>
                                  <option>XL</option>
                                  <option>2XL</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="cart_price h6 each-price">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="cart_quantity">
                        <QuantitySelect
                          quantity={product.quantity}
                          setQuantity={(value) =>
                            updateQuantity(product.id, value)
                          }
                        />
                      </td>
                      <td className="cart_total h6 each-subtotal-price">
                        {(product.quantity * product.price).toFixed(2)}
                      </td>
                      <td
                        className="cart_remove remove link"
                        data-cart-title="Remove"
                      >
                        <X onClick={() => removeProductFromCart(product.id)} />
                        {/* <i
                            className="icon icon-close "
                            onClick={() => removeProductFromCart(product.id)}
                          /> */}
                      </td>
                    </tr>
                  ))}
                  {/* <tr className="tf-cart_item ">
                    <td colSpan={5}>
                      
                    </td>
                  </tr> */}
                </tbody>
              </table>
              <div className="flex flex-col items-center flat-spacing">
                {cartProducts.length === 0 && (
                  <p className="text-main flat-spacing">Your cart is empty</p>
                )}
                <button className="tf-btn type-very-small style-2">
                  <PackagePlus size={16} />
                  <span className="h6">Add Products</span>
                </button>
              </div>
            </form>
          </div>
          <div className="col-xxl-3 col-xl-4">
            <div className="fl-sidebar-cart bg-white-smoke sticky-top">
              <div className="box-order-summary">
                <h4 className="title fw-semibold">Order Summary</h4>
                <div className="subtotal h6 text-button d-flex justify-content-between align-items-center">
                  <h6 className="fw-bold">Subtotal</h6>
                  <span className="total">-${totalPrice.toFixed(2)}</span>
                </div>

                <h5 className="total-order d-flex justify-content-between align-items-center">
                  <span>Total</span>
                  <span className="total each-total-price">
                    ${totalPrice.toFixed(2)}
                  </span>
                </h5>
                <div className="list-ver">
                  <Link href={`/checkout`} className="tf-btn w-100 animate-btn">
                    Process to checkout
                    <i className="icon icon-arrow-right" />
                  </Link>
                  <Link
                    href={`/shop-default`}
                    className="tf-btn btn-white animate-btn animate-dark w-100"
                  >
                    Continue shopping
                    <i className="icon icon-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductsSelectModal />
    </div>
  );
}
