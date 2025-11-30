"use client";
import React, { useEffect, useReducer, useState } from "react";
import FilterMeta from "./FilterMeta";
import Pagination from "./Pagination";
import ProductCard1 from "../productCards/ProductCard1";
import { initialState, reducer } from "@/reducer/filterReducer";
import Sorting from "./Sorting";
import LayoutHandler2 from "./LayoutHandler2";
import FilterSidebar from "./FilterSidebar";
import { setCurrentPage } from "@/reducer/filterActions";
import ProductCardList from "../productCards/ProductCardList";
import { StoreProduct } from "@medusajs/types";
import { Filter } from "lucide-react";

type Props = {
  parentClass?: string;
  defaultActiveLayout?: number;
  maxLayout?: number;
  isFullLayout?: boolean;
  gridCardStyle?: number;
  initialProducts?: StoreProduct[];
};

export default function Products2({
  parentClass = "flat-spacing",
  defaultActiveLayout = 5, // Increased density
  maxLayout = 6,
  isFullLayout = false,
  gridCardStyle = 1,
  initialProducts = [],
}: Props) {
  const [activeLayout, setActiveLayout] = useState(defaultActiveLayout);
  // Reset initial state to avoid default dummy data interference if possible, or handle in useEffect
  // Initialize state with empty arrays to prevent hydration mismatch, but data will flow in via useEffect
  const [state, dispatch] = useReducer(reducer, { ...initialState, filtered: [], sorted: [] });
  const {
    availability,
    color,
    size,
    brands,
    categories,
    price,
    sortingOption,
    filtered,
    sorted,
    activeFilterOnSale,
  } = state;

  // Map Medusa products to the format expected by the filter reducer and cards
  // Note: Adjust mapping as per your specific UI requirements if fields differ
  const mappedProducts = React.useMemo(() => {
    return initialProducts.map((p: any) => ({
      id: p.id,
      title: p.title,
      price: (p.variants?.[0]?.prices?.[0]?.amount || 0) / 100, // Simplified price logic
      // Add necessary fields for filtering if missing
      inStock: true, // Force in stock for now to ensure display
      filterBrands: [],
      filterCategory: [],
      filterColor: [],
      filterSizes: [],
      imgSrc: p.thumbnail || "https://picsum.photos/300/400",
      imageHover: p.images?.[1]?.url || p.thumbnail || "https://picsum.photos/300/400",
      ...p
    }));
  }, [initialProducts]);

  useEffect(() => {
    // Always dispatch FILTER_PRODUCTS when mappedProducts changes, even if empty, to clear or set new data.
    // Also including sorting logic here implicitly because FILTER_PRODUCTS updates 'filtered',
    // which then triggers the SORT_PRODUCTS effect below.
    if (mappedProducts && mappedProducts.length > 0) {
         dispatch({ type: "FILTER_PRODUCTS", payload: mappedProducts });
    }
  }, [
    mappedProducts,
    price,
    availability,
    color,
    size,
    brands,
    categories,
    activeFilterOnSale,
  ]);

  useEffect(() => {
    dispatch({ type: "SORT_PRODUCTS" });
  }, [filtered, sortingOption]);

  const itemPerPage = activeLayout == 1 ? 12 : activeLayout * 4; // Increased density: more items per page
  const totalPages = Math.ceil(sorted.length / itemPerPage);
  const startIndex = (state.currentPage - 1) * itemPerPage;
  const endIndex = state.currentPage * itemPerPage;
  const pageContent = sorted.slice(startIndex, endIndex);

  return (
    <>
      <div className={parentClass}>
        <div className={isFullLayout ? "container-full" : "container"}>
          <div className="tf-shop-control">
            <div className="tf-control-filter">
              <button
                type="button"
                id="filterShop"
                data-bs-toggle="offcanvas"
                data-bs-target="#myOffcanvas"
                className="tf-btn-filter"
              >
                <Filter size={20} />
                <span className="text">Filter</span>
              </button>
            </div>
            <ul className="tf-control-layout">
              <LayoutHandler2
                activeLayout={activeLayout}
                setActiveLayout={(value) => {
                  setCurrentPage(dispatch, 1);
                  setActiveLayout(value);
                }}
                maxLayout={maxLayout}
              />
            </ul>
            <div className="tf-control-sorting">
              <p className="h6 d-none d-lg-block">Sort by:</p>
              <Sorting state={state} dispatch={dispatch} />
            </div>
          </div>
          <div className="wrapper-control-shop gridLayout-wrapper">
            {/* FilterMeta hidden for cleaner, simpler ToC look as requested, or keep minimal */}
            {/* <FilterMeta state={state} dispatch={dispatch} /> */}
            
            <div
              className="tf-list-layout wrapper-shop"
              style={activeLayout == 1 ? {} : { display: "none" }}
            >
              {/* List View */}
              {pageContent.map((product, i) => (
                <ProductCardList key={i} product={product} />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="wd-full wg-pagination">
                  <Pagination
                    setCurrentPage={(value) => {
                      setCurrentPage(dispatch, value);
                    }}
                    currentPage={state.currentPage}
                    totalPages={totalPages}
                    onPageChange={() => {}}
                  />
                </div>
              )}
            </div>
            <div
              className={`wrapper-shop tf-grid-layout tf-col-${activeLayout}`}
              style={{
                 ...(activeLayout != 1 ? {} : { display: "none" }),
                 gap: "10px", // Reduce gap for tighter layout
                 rowGap: "20px"
              }}
            >
              {/* Grid View */}
              {pageContent.map((product, i) => (
                <ProductCard1 style={gridCardStyle} key={i} product={product} />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="m-0 wd-full wg-pagination justify-content-center">
                  <Pagination
                    setCurrentPage={(value) => {
                      setCurrentPage(dispatch, value);
                    }}
                    currentPage={state.currentPage}
                    totalPages={totalPages}
                    onPageChange={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="offcanvas offcanvas-start canvas-filter" id="myOffcanvas">
        <FilterSidebar state={state} dispatch={dispatch} />
      </div>
    </>
  );
}
