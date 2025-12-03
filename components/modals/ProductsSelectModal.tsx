"use client";

import { useShopContext } from "@/context/ShopContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { Offcanvas, Table, Button, Spinner } from "react-bootstrap";
import QuantitySelect from "@/components/common/QuantitySelect";

type Props = {
  show: boolean;
  onHide: () => void;
};

const ProductsSelectModal = ({ show, onHide }: Props) => {
  const {
    products,
    expandedProductIds,
    toggleProduct,
    inventory,
    skuDetails,
    getSkuDetails,
    addToCart,
    removeFromCart,
    updateCartItem,
    cartProducts,
  } = useShopContext();

  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

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
    setSubmitting(true);
    try {
      const cartMap = new Map(cartProducts.map((p: any) => [p.variantId, p]));
      const promises: Promise<any>[] = [];

      // 1. Handle Additions and Updates
      for (const skuId of selectedSkus) {
        const quantity = quantities[skuId] || 50;
        const existingItem = cartMap.get(skuId);

        

        if (existingItem) {
          // Update if quantity changed
          if (existingItem.quantity !== quantity) {
            promises.push(updateCartItem(existingItem.id, quantity));
          }
        } else {
          // Add new item
          promises.push(addToCart({ variant_id: skuId, quantity }));
        }
      }

      // 2. Handle Removals (items in cart but not in selectedSkus)
      for (const item of cartProducts) {
        if (item.variantId && !selectedSkus.includes(item.variantId)) {
          promises.push(removeFromCart(item.id));
        }
      }

      await Promise.all(promises);
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
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Select Products</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        <div className="table-responsive flex-grow-1">
          <Table hover className="align-middle">
            <thead className="table-light sticky-top" style={{ zIndex: 10 }}>
              <tr>
                <th scope="col" style={{ width: "50px" }}></th>
                <th scope="col" style={{ width: "40px" }}>
                  {/* Header Checkbox could go here if we wanted select all products */}
                </th>
                <th scope="col" colSpan={3}>
                  Product Name
                </th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => {
                const isExpanded = expandedProductIds.includes(product.id);
                const allSkuIds = product.variants?.map((v: any) => v.id) || [];
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
                      className="cursor-pointer"
                      onClick={() => toggleProduct(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="text-center">
                        {isExpanded ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </td>
                      <td
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                          }}
                          onChange={() => toggleProductSelection(product)}
                        />
                      </td>
                      <td className="fw-bold">{product.title}</td>
                    </tr>

                    {/* Nested SKU Table Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0 bg-light">
                          <div className="p-3">
                            <h6 className="mb-2 text-muted">选项:</h6>
                            <div className="table-responsive">
                              <Table
                                bordered
                                striped
                                size="sm"
                                className="mb-0 bg-white"
                                style={{ minWidth: "600px" }}
                              >
                                <thead>
                                  <tr>
                                    <th
                                      className="text-center bg-white position-sticky start-0"
                                      style={{
                                        left: 0,
                                        zIndex: 5,
                                        width: "40px",
                                      }}
                                    >
                                      Select
                                    </th>
                                    <th
                                      className="text-center bg-white position-sticky"
                                      style={{ left: "40px", zIndex: 5 }}
                                    >
                                      名称
                                    </th>
                                    <th className="text-center">Feature</th>
                                    <th className="text-center">价格</th>
                                    <th className="text-center">库存</th>
                                    <th className="text-center">Quantity</th>
                                    <th className="text-center">单位</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.variants?.map((sku: any) => {
                                    const isSelected = selectedSkus.includes(
                                      sku.id
                                    );
                                    const quantity = quantities[sku.id] || 50;

                                    return (
                                      <tr className="text-center" key={sku.id}>
                                        <td
                                          className="bg-white position-sticky start-0"
                                          style={{ left: 0, zIndex: 5 }}
                                        >
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={isSelected}
                                            onChange={() =>
                                              toggleSkuSelection(sku.id)
                                            }
                                          />
                                        </td>
                                        <td
                                          className="bg-white position-sticky"
                                          style={{ left: "40px", zIndex: 5 }}
                                        >
                                          {sku.title}
                                        </td>
                                        <td>
                                          {sku.options
                                            .map((option: any) => option.value)
                                            .join(",")}
                                        </td>
                                        <td>$0</td>
                                        <td>
                                          {inventory[product.id]?.rows.find(
                                            (row: any) =>
                                              row.material_number === sku.sku
                                          )?.valid_qty || 0}
                                        </td>
                                        <td style={{ width: "150px" }}>
                                          <QuantitySelect
                                            quantity={quantity}
                                            setQuantity={(val: number) =>
                                              updateQuantity(sku.id, val)
                                            }
                                            step={50}
                                          />
                                        </td>
                                        <td className="text-center">pcs</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="gap-2 pt-3 mt-3 d-flex justify-content-end border-top">
          <Button
            variant="outline-secondary"
            onClick={onHide}
            className="rounded-0"
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="dark"
            onClick={handleSubmit}
            className="gap-2 rounded-0 d-flex align-items-center"
            disabled={submitting}
          >
            {submitting && <Spinner size="sm" animation="border" />}
            Confirm Selection
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ProductsSelectModal;
