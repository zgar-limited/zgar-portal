"use client";

import { medusaSDK } from "@/utils/medusa";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CSSProperties, useState, Fragment } from "react";

type SKU = {
  id: number;
  skuCode: string;
  price: number;
  stock: number;
  attributes: string;
};

type Product = {
  id: number;
  title: string;
  category: string;
  status: string;
  skus: SKU[];
};

// Mock Data
const mockProducts: Product[] = [
  {
    id: 1,
    title: "T-Shirt Basic",
    category: "Clothing",
    status: "Active",
    skus: [
      {
        id: 101,
        skuCode: "TS-W-S",
        price: 19.99,
        stock: 100,
        attributes: "White, S",
      },
      {
        id: 102,
        skuCode: "TS-W-M",
        price: 19.99,
        stock: 80,
        attributes: "White, M",
      },
      {
        id: 103,
        skuCode: "TS-B-S",
        price: 19.99,
        stock: 50,
        attributes: "Black, S",
      },
    ],
  },
  {
    id: 2,
    title: "Running Shoes",
    category: "Footwear",
    status: "Active",
    skus: [
      {
        id: 201,
        skuCode: "RS-42",
        price: 89.99,
        stock: 20,
        attributes: "Size 42",
      },
      {
        id: 202,
        skuCode: "RS-43",
        price: 89.99,
        stock: 15,
        attributes: "Size 43",
      },
    ],
  },
  {
    id: 3,
    title: "Summer Hat",
    category: "Accessories",
    status: "Out of Stock",
    skus: [
      {
        id: 301,
        skuCode: "SH-01",
        price: 15.0,
        stock: 0,
        attributes: "One Size",
      },
    ],
  },
];

type Props = {};

const ProductsSelectModal = (props: Props) => {
  const [expandedProductIds, setExpandedProductIds] = useState<string[]>([]);

  const productsRes = useQuery({
    queryKey: ["productsRes"],
    queryFn: async () => {
      const productsRes = await medusaSDK.store.product.list({ limit: 99, });
      return productsRes;
    },    
  });
  
  

  const toggleProduct = (productId: string) => {
    setExpandedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div
      className="h-full offcanvas offcanvas-bottom"
      id="productsSelectModel"
      style={
        {
          "--bs-offcanvas-height": "90vh",
        } as CSSProperties
      }
    >
      <div className="offcanvas-header">
        <h2 className="offcanvas-title">Select Products</h2>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: "50px" }}></th>
                <th scope="col">Product Name</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {productsRes.data?.products?.map((product) => {
                const isExpanded = expandedProductIds.includes(product.id);
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
                        {/* <i className={`icon ${isExpanded ? 'icon-minus' : 'icon-plus'}`}></i>
                        <span style={{ fontWeight: 'bold' }}>{isExpanded ? '-' : '+'}</span> */}
                      </td>
                      <td className="fw-bold">{product.title}</td>
                      <td>{product.thumbnail}</td>
                      <td>
                        {/* <span
                          className={`badge ${
                            product.status === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {product.status}
                        </span> */}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle selection logic here
                          }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>

                    {/* Nested SKU Table Row */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0 bg-light">
                          <div className="p-3">
                            <h6 className="mb-2 text-muted">SKU Details:</h6>
                            <table className="table mb-0 bg-white table-sm table-bordered">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Attributes</th>
                                  <th>Price</th>
                                  <th>Stock</th>
                                  <th className="text-end">Select SKU</th>
                                </tr>
                              </thead>
                              <tbody>
                                {product.variants?.map((sku) => (
                                  <tr key={sku.id}>
                                    <td>{sku.title}</td>
                                    <td>{sku.options.map(option => option.value).join(",")}</td>
                                    <td>$0</td>
                                    <td>0</td>
                                    <td className="text-end">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id={`sku-${sku.id}`}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsSelectModal;
