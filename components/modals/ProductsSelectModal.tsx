"use client";

import { ChevronDown, ChevronUp, Search, Package } from "lucide-react";
import React, { Fragment, useState, useEffect } from "react";
import {
  Offcanvas,
  Table,
  Button,
  Spinner,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import QuantitySelect from "@/components/common/QuantitySelect";
import Image from "next/image";
import { medusaSDK } from "@/utils/medusa";
import { StoreCart, StoreProduct } from "@medusajs/types";
import { useRouter } from "next/navigation";

type Props = {
  show: boolean;
  onHide: () => void;
  cart: StoreCart | null;
  products: StoreProduct[];
};

const ProductsSelectModal = ({ show, onHide, cart, products }: Props) => {
  const router = useRouter();
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [inventory, setInventory] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = React.useMemo(() => {
    if (!searchQuery) return products;
    return products.filter((p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const cartProducts = React.useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.map((item: any) => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.product_id,
      title: item.product_title,
      variantTitle: item.variant_title,
      price: item.unit_price,
      quantity: item.quantity,
      imgSrc: item.thumbnail || "https://picsum.photos/100/100",
      options: item.variant?.options || [],
      metadata: item.metadata || {},
      weight: item.variant?.weight || 0,
    }));
  }, [cart]);

  const toggleProduct = (productId: string) => {
    setExpandedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Sync local state with cart when modal opens
  useEffect(() => {
    if (show) {
      const initialSelected: string[] = [];
      const initialQuantities: Record<string, number> = {};

      cartProducts.forEach((item: any) => {
        // Use variantId to check selection status as item.id is line item id
        if (item.variantId) {
          initialSelected.push(item.variantId);
          initialQuantities[item.variantId] = item.quantity;
        }
      });
      setSelectedSkus(initialSelected);
      setQuantities(initialQuantities);
    }
  }, [show, cartProducts]);

  const toggleSkuSelection = (skuId: string) => {
    setSelectedSkus((prev) => {
      const isSelected = prev.includes(skuId);
      if (!isSelected) {
        // When selecting, ensure there is a default quantity if none exists
        if (!quantities[skuId]) {
          setQuantities((q) => ({ ...q, [skuId]: 50 }));
        }
        return [...prev, skuId];
      }
      return prev.filter((id) => id !== skuId);
    });
  };

  const updateQuantity = (skuId: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [skuId]: qty }));
    // If quantity is set > 0 and not selected, should we select it?
    // Let's assume user explicitly selects via checkbox, but setting quantity is enough intent?
    // For now, let's keep selection explicit via checkbox to avoid confusion.
  };

  const toggleProductSelection = (product: any) => {
    const allSkuIds = product.variants?.map((v: any) => v.id) || [];
    const allSelected = allSkuIds.every((id: string) =>
      selectedSkus.includes(id)
    );

    if (allSelected) {
      // Deselect all
      setSelectedSkus((prev) => prev.filter((id) => !allSkuIds.includes(id)));
    } else {
      // Select all
      setSelectedSkus((prev) => {
        const newSelected = [...prev];
        allSkuIds.forEach((id: string) => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    }
  };

  const handleSubmit = async () => {
    if (!cart?.id) return;
    setSubmitting(true);
    try {
      const cartMap = new Map(cartProducts.map((p: any) => [p.variantId, p]));

      // 1. Identify items to Add, Update, and Delete
      const itemsToAdd: {
        variant_id: string;
        quantity: number;
        metadata?: Record<string, unknown>;
      }[] = [];
      const itemsToUpdate: {
        variant_id: string;
        quantity: number;
        metadata?: Record<string, unknown>;
      }[] = [];
      const itemsToDelete: string[] = [];

      // Check selected SKUs for additions and updates
      for (const skuId of selectedSkus) {
        const quantity = quantities[skuId] || 50;
        const existingItem = cartMap.get(skuId);

        if (existingItem) {
          // Update if quantity changed
          if (existingItem.quantity !== quantity) {
            itemsToUpdate.push({
              variant_id: existingItem.id,
              quantity,
            });
          }
        } else {
          // Add new item
          itemsToAdd.push({
            variant_id: skuId,
            quantity,
          });
        }
      }

      // Check for removals (items in cart but not in selectedSkus)
      for (const item of cartProducts) {
        if (item.variantId && !selectedSkus.includes(item.variantId)) {
          itemsToDelete.push(item.id);
        }
      }

      const promises: Promise<any>[] = [];

      // 2. Execute Batch Operations
      if (itemsToAdd.length > 0) {
        promises.push(
          medusaSDK.client.fetch(`/store/zgar/cart/add`, {
            method: "POST",
            body: {
              cart_id: cart.id,
              items: itemsToAdd.map((item) => ({
                variant_id: item.variant_id, // API expects 'id' for variant_id in add
                quantity: item.quantity,
                metadata: item.metadata,
              })),
            },
          })
        );
      }

      if (itemsToUpdate.length > 0) {
        promises.push(
          medusaSDK.client.fetch(`/store/zgar/cart/update`, {
            method: "POST",
            body: {
              cart_id: cart.id,
              items: itemsToUpdate,
            },
          })
        );
      }

      if (itemsToDelete.length > 0) {
        promises.push(
          medusaSDK.client.fetch(`/store/zgar/cart/delete`, {
            method: "POST",
            body: {
              cart_id: cart.id,
              items: itemsToDelete,
            },
          })
        );
      }

      await Promise.all(promises);

      // 3. Refresh and Close
      router.refresh();
      onHide();
    } catch (error) {
      console.error("Error updating cart:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="bottom"
      style={{ height: "90vh" }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title className="mb-0 h5">Select Products</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0 d-flex flex-column">
        <div className="p-3 border-bottom bg-light">
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search products by name..."
              className="shadow-none border-start-0 ps-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="table-responsive flex-grow-1">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light sticky-top" style={{ zIndex: 10 }}>
              <tr>
                <th
                  scope="col"
                  style={{ width: "50px" }}
                  className="text-center bg-light border-bottom-0"
                ></th>
                <th
                  scope="col"
                  style={{ width: "50px" }}
                  className="text-center bg-light border-bottom-0"
                >
                  {/* Select All could go here */}
                </th>
                <th
                  scope="col"
                  style={{ width: "80px" }}
                  className="bg-light border-bottom-0"
                >
                  Image
                </th>
                <th scope="col" className="bg-light border-bottom-0">
                  Product Information
                </th>
                <th
                  scope="col"
                  className="text-end bg-light border-bottom-0 pe-4"
                >
                  Variants
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-5 text-center text-muted">
                    <Package size={48} className="mb-3 opacity-50" />
                    <p className="mb-0">No products found</p>
                  </td>
                </tr>
              ) : (
                filteredProducts?.map((product) => {
                  const isExpanded = expandedProductIds.includes(product.id);
                  const allSkuIds =
                    product.variants?.map((v: any) => v.id) || [];
                  const isAllSelected =
                    allSkuIds.length > 0 &&
                    allSkuIds.every((id: string) => selectedSkus.includes(id));
                  const isIndeterminate =
                    allSkuIds.some((id: string) => selectedSkus.includes(id)) &&
                    !isAllSelected;

                  return (
                    <Fragment key={product.id}>
                      {/* Main Product Row */}
                      <tr
                        className={`cursor-pointer ${
                          isExpanded ? "bg-light" : ""
                        }`}
                        onClick={() => toggleProduct(product.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="text-center">
                          <div className="d-flex justify-content-center align-items-center h-100">
                            {isExpanded ? (
                              <ChevronUp size={18} className="text-primary" />
                            ) : (
                              <ChevronDown size={18} className="text-muted" />
                            )}
                          </div>
                        </td>
                        <td
                          className="text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="d-flex justify-content-center align-items-center h-100">
                            <Form.Check
                              type="checkbox"
                              checked={isAllSelected}
                              ref={(input: HTMLInputElement | null) => {
                                if (input)
                                  input.indeterminate = isIndeterminate;
                              }}
                              onChange={() => toggleProductSelection(product)}
                              className="cursor-pointer"
                            />
                          </div>
                        </td>
                        <td>
                          <div
                            className="overflow-hidden border rounded position-relative"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <Image
                              src={
                                product.thumbnail ||
                                "https://picsum.photos/100/100"
                              }
                              alt={product.title || "Product"}
                              fill
                              className="object-fit-cover"
                            />
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold text-dark">
                            {product.title}
                          </div>
                          <div className="small text-muted">
                            {product.variants?.length || 0} variants available
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <Badge bg="secondary" className="fw-normal">
                            {product.variants?.length} SKUs
                          </Badge>
                        </td>
                      </tr>

                      {/* Nested SKU Table Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="p-0">
                            <div className="p-3 bg-light border-bottom ps-5">
                              <div className="border-0 shadow-sm card">
                                <div className="table-responsive">
                                  <Table
                                    hover
                                    size="sm"
                                    className="mb-0 align-middle"
                                    style={{ minWidth: "600px" }}
                                  >
                                    <thead className="bg-white">
                                      <tr>
                                        <th
                                          className="py-3 text-center"
                                          style={{ width: "50px" }}
                                        >
                                          Select
                                        </th>
                                        <th className="py-3">Variant Name</th>
                                        <th className="py-3">Options</th>
                                        <th className="py-3 text-end">Price</th>
                                        <th className="py-3 text-center">
                                          Stock
                                        </th>
                                        <th
                                          className="py-3 text-center"
                                          style={{ width: "160px" }}
                                        >
                                          Quantity
                                        </th>
                                        <th className="py-3 text-center">
                                          Unit
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {product.variants?.map((sku: any) => {
                                        const isSelected =
                                          selectedSkus.includes(sku.id);
                                        const quantity =
                                          quantities[sku.id] || 50;
                                        // Try to get price
                                        const price = sku.calculated_price
                                          ?.calculated_amount
                                          ? `$${sku.calculated_price.calculated_amount.toFixed(
                                              2
                                            )}`
                                          : "N/A";

                                        return (
                                          <tr key={sku.id}>
                                            <td className="text-center">
                                              <div className="d-flex justify-content-center align-items-center h-100">
                                                <Form.Check
                                                  type="checkbox"
                                                  checked={isSelected}
                                                  onChange={() =>
                                                    toggleSkuSelection(sku.id)
                                                  }
                                                />
                                              </div>
                                            </td>
                                            <td className="fw-medium text-dark">
                                              {sku.title}
                                            </td>
                                            <td className="text-muted small">
                                              {sku.options
                                                ?.map(
                                                  (option: any) => option.value
                                                )
                                                .join(", ") || "-"}
                                            </td>
                                            <td className="text-end font-monospace">
                                              {price}
                                            </td>
                                            <td className="text-center">
                                              {inventory[product.id]?.rows.find(
                                                (row: any) =>
                                                  row.material_number ===
                                                  sku.sku
                                              )?.valid_qty || "-"}
                                            </td>
                                            <td>
                                              <div
                                                style={{
                                                  width: "140px",
                                                  margin: "0 auto",
                                                }}
                                              >
                                                <QuantitySelect
                                                  quantity={quantity}
                                                  setQuantity={(val: number) =>
                                                    updateQuantity(sku.id, val)
                                                  }
                                                  step={50}
                                                />
                                              </div>
                                            </td>
                                            <td className="text-center text-muted small">
                                              pcs
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        {selectedSkus.length > 0 && (
          <div className="gap-2 pt-3 pb-4 mt-3 d-flex justify-content-center border-top">
            <Button
              variant="outline-secondary"
              onClick={onHide}
              className="px-4 rounded-0"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="dark"
              onClick={handleSubmit}
              className="gap-2 px-4 rounded-0 d-flex align-items-center"
              disabled={submitting}
            >
              {submitting && <Spinner size="sm" animation="border" />}
              Confirm Selection ({selectedSkus.length})
            </Button>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ProductsSelectModal;
