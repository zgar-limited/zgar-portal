"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import CountdownTimer from "../common/Countdown";
import { useContextElement } from "@/context/Context";
import Link from "next/link";
import QuantitySelect from "../common/QuantitySelect";
import {
  ChevronDown,
  PackagePlus,
  ShoppingCart,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductsSelectModal from "../modals/ProductsSelectModal";
import { useQuery } from "@tanstack/react-query";
import { medusaSDK } from "@/utils/medusa";
import {
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
  Form,
  Pagination,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useShopContext } from "@/context/ShopContext";
import { useRouter } from "next/navigation";
import {
  StoreCartResponse,
  StorePaymentCollectionResponse,
} from "@medusajs/types";

export default function ShopCart() {
  return <ShopCartContent />;
}

function ShopCartContent() {
  const {
    cartProducts,
    totalPrice,
    removeFromCart,
    updateCartItem,
    refreshCart,
    cartLoading,
    cart,
    getSkuDetails,
  } = useShopContext();

  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const itemsPerPage = 5;

  // Reset page when cart items change significantly (e.g. all deleted)
  useEffect(() => {
    const maxPage = Math.ceil(cartProducts.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (maxPage === 0) {
      setCurrentPage(1);
    }

    // Cleanup selected items that no longer exist
    setSelectedItems((prev) =>
      prev.filter((id) => cartProducts.some((p) => p.id === id))
    );
  }, [cartProducts, itemsPerPage]); // cartProducts dependency covers length changes and item removal

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedItems.length === 0) return;

    setIsDeleting(true);
    try {
      await Promise.all(selectedItems.map((id) => removeFromCart(id)));
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    setUpdatingItems((prev) => [...prev, id]);
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleUpdateQuantity = async (id: string, value: number) => {
    setUpdatingItems((prev) => [...prev, id]);
    try {
      await updateCartItem(id, value);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) return;

    setCheckoutLoading(true);

    try {
      // 1. Prepare items for the new cart
      const itemsToCheckout = cartProducts
        .filter((p) => selectedItems.includes(p.id))
        .map((p) => ({
          variant_id: p.variantId,
          quantity: p.quantity,
          metadata: p.metadata,
        }));

      // 2. Create temporary cart with selected items using fetch
      // const createCartRes: StoreCartResponse = await medusaSDK.client.fetch(
      //   "/store/carts",
      //   {
      //     method: "POST",
      //     body: {
      //       region_id: "reg_01K9M1A9NHMN4MXBACKAS5F4V1",
      //       sales_channel_id: "sc_01K9KAK0MDCMSWCXRV0WH70EQK",
      //       items: itemsToCheckout,
      //       // currency_code: "usd",
      //     },
      //   }
      // );
      // const createCartRes: StoreCartResponse =
      //   await medusaSDK.store.cart.create({
      //     sales_channel_id: "sc_01K9KAK0MDCMSWCXRV0WH70EQK",
      //     region_id: "reg_01K9M1A9NHMN4MXBACKAS5F4V1",
      //     items: itemsToCheckout.map(item => {
      //       return {...item,}
      //     })
      //   });

      // await medusaSDK.client.fetch("/store/custom/cart-add", {
      //   method:"POST",
      //   body: {
      //     cart_id: createCartRes.cart.id,
      //     items: itemsToCheckout,
      //   },
      // });

      // const tempCart = createCartRes.cart;

      // if (!tempCart) throw new Error("Failed to create checkout session");
      await medusaSDK.client.fetch("/store/custom/cart-complete", {
        method: "POST",
        body: {
          // cart_id: tempCart.id,
          // sales_channel_id: "sc_01K9KAK0MDCMSWCXRV0WH70EQK",
          items: itemsToCheckout,
          // currency_code: "usd",
        },
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      setToastMessage(error.message || "Failed to submit order");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="flat-spacing-2">
      <Container>
        <Row>
          <Col xxl={9} xl={8}>
            <Form onSubmit={(e) => e.preventDefault()}>
              <div className="table-responsive position-relative">
                {cartLoading && (
                  <div
                    className="top-0 bg-white bg-opacity-75 position-absolute start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ zIndex: 10 }}
                  >
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <Table hover className="align-middle tf-table-page-cart">
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>
                        <Form.Check
                          type="checkbox"
                          checked={
                            selectedItems.length === cartProducts.length &&
                            cartProducts.length > 0
                          }
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th className="h6">Product</th>
                      <th className="h6">Price</th>
                      <th className="h6">Quantity</th>
                      <th className="h6">Total price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((product, i) => (
                      <tr
                        key={i}
                        className={`tf-cart_item ${
                          updatingItems.includes(product.id) ? "opacity-50" : ""
                        }`}
                      >
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.includes(product.id)}
                            onChange={() => handleSelectItem(product.id)}
                            disabled={updatingItems.includes(product.id)}
                          />
                        </td>
                        <td>
                          <div className="cart_product">
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
                                  className="gap-1 p-0 text-decoration-none text-dark fw-bold d-flex align-items-center text-start text-wrap"
                                  onClick={() => setShowModal(true)}
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "normal",
                                    textAlign: "left",
                                  }}
                                >
                                  {product.variantTitle
                                    ? `${product.title} - ${
                                        product.variantTitle
                                      } - ${product.options
                                        ?.map((o: any) => o.value)
                                        .join(", ")}`
                                    : product.title}
                                  <ChevronDown
                                    size={16}
                                    className="flex-shrink-0"
                                  />
                                </Button>
                              </h6>
                              {/* Mobile Delete Button */}
                              <div
                                className={`d-md-none mobile-delete-btn ${
                                  updatingItems.includes(product.id)
                                    ? "pe-none"
                                    : "cursor-pointer"
                                }`}
                                onClick={() => handleRemoveItem(product.id)}
                              >
                                <Trash2 size={18} />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="cart_price h6 each-price">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="cart_quantity">
                          <div
                            className={
                              updatingItems.includes(product.id)
                                ? "pe-none"
                                : ""
                            }
                          >
                            <QuantitySelect
                              quantity={product.quantity}
                              setQuantity={(value) =>
                                handleUpdateQuantity(product.id, value)
                              }
                              step={50}
                            />
                          </div>
                        </td>
                        <td className="cart_total h6 each-subtotal-price fw-bold">
                          {(product.quantity * product.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="gap-3 mt-4 d-flex flex-column align-items-center">
                {cartProducts.length === 0 && (
                  <p className="mb-3 text-main">Your cart is empty</p>
                )}

                {totalPages > 1 && (
                  <div className="mb-3 pagination-wrapper">
                    <Pagination className="justify-content-center custom-pagination">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-nav-btn"
                      >
                        <ChevronLeft size={18} />
                      </Pagination.Prev>

                      {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Item
                          key={idx + 1}
                          active={idx + 1 === currentPage}
                          onClick={() => handlePageChange(idx + 1)}
                          className="pagination-item"
                        >
                          {idx + 1}
                        </Pagination.Item>
                      ))}

                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-nav-btn"
                      >
                        <ChevronRight size={18} />
                      </Pagination.Next>
                    </Pagination>
                  </div>
                )}

                <div className="gap-3 d-flex">
                  <Button
                    variant="outline-dark"
                    className="gap-2 d-flex align-items-center"
                    onClick={() => setShowModal(true)}
                  >
                    <PackagePlus size={18} />
                    <span className="mb-0 h6">Add Products</span>
                  </Button>

                  {selectedItems.length > 0 && (
                    <Button
                      variant="outline-danger"
                      className="gap-2 d-flex align-items-center"
                      onClick={handleBatchDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                      <span className="mb-0 h6">
                        Delete Selected ({selectedItems.length})
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </Col>
          <Col xxl={3} xl={4}>
            <Card
              className="border-0 shadow-sm bg-light sticky-top"
              style={{ top: "20px" }}
            >
              <Card.Body>
                <h4 className="mb-4 title fw-semibold">Order Summary</h4>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">Subtotal</h6>
                  <span className="total fw-bold">
                    -${totalPrice.toFixed(2)}
                  </span>
                </div>

                <hr className="my-3" />

                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Total</h5>
                  <span className="mb-0 total h5 text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="gap-2 d-grid">
                  <Button
                    variant="dark"
                    className="gap-2 w-100 d-flex justify-content-center align-items-center"
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0 || checkoutLoading}
                  >
                    {checkoutLoading && (
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    )}
                    Process to checkout
                  </Button>
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
      <ProductsSelectModal
        show={showModal}
        onHide={() => setShowModal(false)}
      />

      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 9999 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toastVariant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body
            className={toastVariant === "success" ? "text-white" : "text-white"}
          >
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </section>
  );
}
