"use client";
import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { StoreProduct } from "@medusajs/types";
import { Filter } from "lucide-react";

interface ProductGridProps {
  initialProducts: StoreProduct[];
}

export default function ProductGrid({ initialProducts = [] }: ProductGridProps) {
  const [sortOption, setSortOption] = useState("default");
  
  // Minimal client-side sorting/filtering if needed, primarily relying on initial fetch for now
  const displayedProducts = useMemo(() => {
    let sorted = [...initialProducts];
    if (sortOption === "price-asc") {
        sorted.sort((a: any, b: any) => (a.variants?.[0]?.prices?.[0]?.amount || 0) - (b.variants?.[0]?.prices?.[0]?.amount || 0));
    } else if (sortOption === "price-desc") {
        sorted.sort((a: any, b: any) => (b.variants?.[0]?.prices?.[0]?.amount || 0) - (a.variants?.[0]?.prices?.[0]?.amount || 0));
    }
    return sorted;
  }, [initialProducts, sortOption]);

  return (
    <section className="py-5">
      <div className="container">
        {/* Control Bar */}
        <div className="flex-wrap gap-3 mb-4 d-flex justify-content-between align-items-center">
          {/* <div className="gap-2 d-flex align-items-center">
            <button className="gap-2 px-4 btn btn-outline-dark d-flex align-items-center rounded-pill">
              <Filter size={18} />
              <span>Filter</span>
            </button>
            <span className="text-muted small ms-2">{displayedProducts.length} Products</span>
          </div> */}

          <div className="gap-2 d-flex align-items-center">
             <span className="text-muted small d-none d-sm-inline">Sort by:</span>
             <div className="dropdown">
                <button className="gap-1 btn btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {sortOption === 'default' ? 'Featured' : sortOption === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                </button>
                <ul className="border-0 shadow-xs dropdown-menu dropdown-menu-end">
                  <li><button className="dropdown-item" onClick={() => setSortOption('default')}>Featured</button></li>
                  <li><button className="dropdown-item" onClick={() => setSortOption('price-asc')}>Price: Low to High</button></li>
                  <li><button className="dropdown-item" onClick={() => setSortOption('price-desc')}>Price: High to Low</button></li>
                </ul>
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-3 g-md-4">
          {displayedProducts.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        {displayedProducts.length === 0 && (
            <div className="py-5 text-center">
                <p className="text-muted">No products found.</p>
            </div>
        )}
      </div>
    </section>
  );
}