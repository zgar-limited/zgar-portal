"use client";
import React, { useState } from "react";
import { StoreProduct } from "@medusajs/types";

interface ProductTabsProps {
  product: StoreProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("desc");

  const tabStyle = (tab: string) => `
    btn btn-link text-decoration-none px-4 py-2 rounded-pill transition-all
    ${activeTab === tab 
        ? "bg-dark text-white fw-bold shadow-sm" 
        : "text-muted hover-bg-light"}
  `;

  return (
    <div className="pt-5 mt-5 border-top">
      {/* Tab Navigation - Centered Pills */}
      <div className="gap-2 pb-2 mb-5 overflow-auto d-flex justify-content-center">
        <button onClick={() => setActiveTab("desc")} className={tabStyle("desc")}>
            Description
        </button>
        <button onClick={() => setActiveTab("details")} className={tabStyle("details")}>
            Details & Specs
        </button>
        <button onClick={() => setActiveTab("shipping")} className={tabStyle("shipping")}>
            Shipping & Returns
        </button>
      </div>

      {/* Tab Content */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
            {activeTab === "desc" && (
                <div className="animate-fade-in">
                    {/* <h3 className="mb-3 h4 fw-bold">About this product</h3> */}
                    {product.description ? (
                        <p className="leading-relaxed text-secondary fs-5">
                            {product.description}
                        </p>
                    ) : (
                        <p className="text-center text-muted fst-italic">No description available.</p>
                    )}
                </div>
            )}

            {activeTab === "details" && (
                <div className="animate-fade-in">
                    {/* Rich Text / Custom Info Section */}
                    {product.metadata?.details ? (
                        <div className="rich-text-content" dangerouslySetInnerHTML={{ __html: product.metadata.details as string }} />
                    ) : (
                        <div className="py-4 text-center">
                            <p className="mb-4 text-muted">
                                Detailed specifications and custom information about this product.
                            </p>
                            {/* Placeholder content to show design */}
                            <div className="row text-start g-4">
                                <div className="col-md-6">
                                    <h5 className="h6 fw-bold">Material</h5>
                                    <p className="text-secondary small">100% Cotton, Organic</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="h6 fw-bold">Weight</h5>
                                    <p className="text-secondary small">250g</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="h6 fw-bold">Dimensions</h5>
                                    <p className="text-secondary small">20 x 15 x 5 cm</p>
                                </div>
                                <div className="col-md-6">
                                    <h5 className="h6 fw-bold">Origin</h5>
                                    <p className="text-secondary small">Made in Italy</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "shipping" && (
                <div className="animate-fade-in">
                    <div className="gap-4 d-flex flex-column">
                        <div>
                            <h4 className="mb-2 h6 fw-bold">Delivery</h4>
                            <p className="text-secondary small">
                                We ship to over 100 countries worldwide. Orders are typically processed within 2-3 business days.
                                Standard shipping takes 5-7 days, while express options are available.
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-2 h6 fw-bold">Returns</h4>
                            <p className="text-secondary small">
                                We accept returns within 30 days of delivery. The item must be unused and in its original packaging.
                                Contact our support team to initiate a return.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <style jsx>{`
        .transition-all { transition: all 0.3s ease; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}