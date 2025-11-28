"use client";

import { useShopContext } from "@/context/ShopContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment, useState, useEffect } from "react";
import { Offcanvas, Table, Button } from "react-bootstrap";
import { useContextElement } from "@/context/Context";

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
  } = useShopContext();

  const { addProductToCart, cartProducts } = useContextElement();
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);

  // Sync local state with cart when modal opens
  useEffect(() => {
    if (show) {
      const initialSelected: string[] = [];
      cartProducts.forEach((item: any) => {
        initialSelected.push(item.id);
      });
      setSelectedSkus(initialSelected);
    }
  }, [show, cartProducts]);

  const toggleSkuSelection = (skuId: string) => {
    setSelectedSkus(prev =>
      prev.includes(skuId) ? prev.filter(id => id !== skuId) : [...prev, skuId]
    );
  };

  const toggleProductSelection = (product: any) => {
    const allSkuIds = product.variants?.map((v: any) => v.id) || [];
    const allSelected = allSkuIds.every((id: string) => selectedSkus.includes(id));

    if (allSelected) {
      // Deselect all
      setSelectedSkus(prev => prev.filter(id => !allSkuIds.includes(id)));
    } else {
      // Select all
      setSelectedSkus(prev => {
        const newSelected = [...prev];
        allSkuIds.forEach((id: string) => {
          if (!newSelected.includes(id)) newSelected.push(id);
        });
        return newSelected;
      });
    }
  };

  const handleSubmit = () => {
    // Process selected SKUs
    selectedSkus.forEach(skuId => {
      // Find product and sku details
      let foundProduct: any = null;
      let foundSku: any = null;

      for (const product of products || []) {
        const sku = product.variants?.find((v: any) => v.id === skuId);
        if (sku) {
          foundProduct = product;
          foundSku = sku;
          break;
        }
      }

      if (foundProduct && foundSku) {
        // Check if item is already in cart to preserve quantity, otherwise default to 50
        const existingItem = cartProducts.find((p: any) => p.id === skuId);
        const quantity = existingItem ? existingItem.quantity : 50;

        addProductToCart({
          id: foundSku.id,
          title: foundProduct.title,
          price: 0,
          quantity: quantity,
          sku: foundSku.sku,
          variantTitle: foundSku.title,
          options: foundSku.options,
          image: foundProduct.thumbnail,
        });
      }
    });
    onHide();
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="bottom" style={{ height: '90vh' }}>
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
                const isAllSelected = allSkuIds.length > 0 && allSkuIds.every((id: string) => selectedSkus.includes(id));
                const isIndeterminate = allSkuIds.some((id: string) => selectedSkus.includes(id)) && !isAllSelected;

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
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isAllSelected}
                          ref={input => {
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
                              <Table bordered striped size="sm" className="mb-0 bg-white" style={{ minWidth: '600px' }}>
                                <thead>
                                  <tr>
                                    <th className="text-center bg-white position-sticky start-0" style={{ left: 0, zIndex: 5, width: '40px' }}>
                                      选择
                                    </th>
                                    <th className="text-center bg-white position-sticky" style={{ left: '40px', zIndex: 5 }}>名称</th>
                                    <th className="text-center">Feature</th>
                                    <th className="text-center">价格</th>
                                    <th className="text-center">库存</th>
                                    <th className="text-center">单位</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {product.variants?.map((sku: any) => {
                                    const isSelected = selectedSkus.includes(sku.id);
                                    
                                    return (
                                    <tr className="text-center" key={sku.id}>
                                      <td className="bg-white position-sticky start-0" style={{ left: 0, zIndex: 5 }}>
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={isSelected}
                                          onChange={() => toggleSkuSelection(sku.id)}
                                        />
                                      </td>
                                      <td className="bg-white position-sticky" style={{ left: '40px', zIndex: 5 }}>{sku.title}</td>
                                      <td>
                                        {sku.options
                                          .map((option: any) => option.value)
                                          .join(",")}
                                      </td>
                                      <td>$0</td>
                                      <td>
                                        {
                                          inventory[product.id]?.rows.find(
                                            (row: any) =>
                                              row.material_number === sku.sku
                                          )?.valid_qty || 0
                                        }
                                      </td>
                                      <td className="text-center">pcs</td>
                                    </tr>
                                  )})}
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
            <Button variant="outline-secondary" onClick={onHide} className="rounded-0">Cancel</Button>
            <Button variant="dark" onClick={handleSubmit} className="rounded-0">Confirm Selection</Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ProductsSelectModal;
