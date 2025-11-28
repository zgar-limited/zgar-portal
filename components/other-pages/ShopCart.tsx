"use client";
import Image from "next/image";
import React, { useState } from "react";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import QuantitySelect from "../common/QuantitySelect";
import { ChevronDown, PackagePlus, ShoppingCart, X } from "lucide-react";

import ProductsSelectModal from "../modals/ProductsSelectModal";
import { useQuery } from "@tanstack/react-query";
import { medusaSDK } from "@/utils/medusa";
import { Container, Row, Col, Table, Card, Button, Form } from "react-bootstrap";
import { ShopProvider } from "@/context/ShopContext";

export default function ShopCart() {
  return (
    <ShopProvider>
      <ShopCartContent />
    </ShopProvider>
  );
}

function ShopCartContent() {
  const { cartProducts, totalPrice, removeProductFromCart, updateQuantity } =
    useContextElement();

  const [showModal, setShowModal] = useState(false);

  return (
    <section className="flat-spacing-2">
      <Container>
        <Row>
          <Col xxl={9} xl={8}>
            <Form onSubmit={(e) => e.preventDefault()}>
              <div className="table-responsive">
                <Table hover className="align-middle tf-table-page-cart">
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
                          <div className="gap-3 cart_product d-flex align-items-center">
                            <Link
                              href={`/product-detail/${product.id}`}
                              className="img-prd"
                            >
                              <Image
                                className="rounded lazyload"
                                src={"https://picsum.photos/100/100"}
                                alt="T Shirt"
                                width={80}
                                height={80}
                              />
                            </Link>
                            <div className="infor-prd">
                              <h6 className="mb-1 prd_name">
                                <Button
                                  variant="link"
                                  className="gap-1 p-0 text-decoration-none text-dark fw-bold d-flex align-items-center text-start"
                                  onClick={() => setShowModal(true)}
                                >
                                  {product.variantTitle ? `${product.title} - ${product.variantTitle} - ${product.options?.map((o: any) => o.value).join(', ')}` : product.title}
                                  <ChevronDown size={16} />
                                </Button>
                              </h6>
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
                            step={50}
                          />
                        </td>
                        <td className="cart_total h6 each-subtotal-price fw-bold">
                          {(product.quantity * product.price).toFixed(2)}
                        </td>
                        <td
                          className="cart_remove remove link"
                        >
                          <X className="cursor-pointer text-danger" onClick={() => removeProductFromCart(product.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="mt-4 d-flex flex-column align-items-center">
                {cartProducts.length === 0 && (
                  <p className="mb-3 text-main">Your cart is empty</p>
                )}
                <Button variant="outline-dark" className="gap-2 d-flex align-items-center" onClick={() => setShowModal(true)}>
                  <PackagePlus size={18} />
                  <span className="mb-0 h6">Add Products</span>
                </Button>
              </div>
            </Form>
          </Col>
          <Col xxl={3} xl={4}>
            <Card className="border-0 shadow-sm bg-light sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h4 className="mb-4 title fw-semibold">Order Summary</h4>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">Subtotal</h6>
                  <span className="total fw-bold">-${totalPrice.toFixed(2)}</span>
                </div>

                <hr className="my-3" />

                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total</h5>
                  <span className="mb-0 total h5 text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="gap-2 d-grid">
                  <Link href={`/checkout`} className="btn btn-dark w-100">
                    Process to checkout
                  </Link>
                  <Link
                    href={`/shop-default`}
                    className="btn btn-outline-dark w-100"
                  >
                    Continue shopping
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ProductsSelectModal show={showModal} onHide={() => setShowModal(false)} />
    </section>
  );
}
