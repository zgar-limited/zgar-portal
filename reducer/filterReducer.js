import { products } from "@/data/products";

// Initial state
export const initialState = {
  price: [0, 100],
  availability: "All",
  color: "All",
  size: "All",
  activeFilterOnSale: false,
  brands: [],
  categories: [],
  filtered: products,
  sortingOption: "Sort by (Default)",
  sorted: products,
  currentPage: 1,
  itemPerPage: 6,
};

// Helper function to check if a product matches all active filters
function matchesAllFilters(product, state) {
  if (
    state.brands.length &&
    !state.brands.every((b) => product.filterBrands?.includes(b))
  )
    return false;

  if (
    state.categories.length &&
    !state.categories.every((c) => product.filterCategory?.includes(c))
  )
    return false;

  if (
    state.availability !== "All" &&
    state.availability === "InStock" &&
    !product.inStock
  )
    return false;

  if (
    state.availability !== "All" &&
    state.availability === "outStock" &&
    product.inStock
  )
    return false;

  if (state.color !== "All" && !product.filterColor?.includes(state.color))
    return false;

  if (
    state.size !== "All" &&
    state.size !== "Free Size" &&
    !product.filterSizes?.includes(state.size)
  )
    return false;

  if (state.activeFilterOnSale && !product.oldPrice) return false;

  if (product.price < state.price[0] || product.price > state.price[1])
    return false;

  return true;
}

// Main reducer
export function reducer(state, action) {
  switch (action.type) {
    case "SET_PRICE":
      return { ...state, price: action.payload };

    case "SET_COLOR":
      return { ...state, color: action.payload };

    case "SET_SIZE":
      return { ...state, size: action.payload };

    case "SET_AVAILABILITY":
      return { ...state, availability: action.payload };

    case "SET_BRANDS":
      return { ...state, brands: action.payload };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "FILTER_PRODUCTS": {
      const productsToFilter = [...action.payload];
      const filtered = productsToFilter.filter((product) =>
        matchesAllFilters(product, state)
      );
      return { ...state, filtered, currentPage: 1 };
    }

    case "SET_SORTING_OPTION":
      return { ...state, sortingOption: action.payload };

    case "SORT_PRODUCTS": {
      const sorted = [...state.filtered];
      switch (state.sortingOption) {
        case "Price Ascending":
          sorted.sort((a, b) => a.price - b.price);
          break;
        case "Price Descending":
          sorted.sort((a, b) => b.price - a.price);
          break;
        case "Title Ascending":
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "Title Descending":
          sorted.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
      return { ...state, sorted, currentPage: 1 };
    }

    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };

    case "SET_ITEM_PER_PAGE":
      return { ...state, itemPerPage: action.payload, currentPage: 1 };

    case "TOGGLE_FILTER_ON_SALE":
      return { ...state, activeFilterOnSale: !state.activeFilterOnSale };

    case "CLEAR_FILTER":
      return {
        ...state,
        price: [0, 100],
        availability: "All",
        color: "All",
        size: "All",
        brands: [],
        categories: [],
        activeFilterOnSale: false,
      };

    default:
      return state;
  }
}

/**
 * Product Filter Reducer
 * ----------------------
 * A centralized reducer function and initial state configuration for managing product
 * filtering, sorting, and pagination in a client-side React application.
 *
 * ✅ Features:
 * - Filters products based on price, availability, color, size, brands, categories, and sale status
 * - Sorts filtered products by price or title (ascending/descending)
 * - Manages pagination with page and item count control
 * - Handles complex multi-filter matching via `matchesAllFilters` helper
 *
 * 🔧 Initial State Keys:
 * - price: [min, max] price range filter
 * - availability: "All" | "InStock" | "OutOfStock"
 * - color: selected color filter
 * - size: selected size filter
 * - brands: array of selected brands
 * - categories: array of selected categories
 * - activeFilterOnSale: boolean to filter sale-only products
 * - filtered: products that match current filters
 * - sorted: filtered products after sorting is applied
 * - sortingOption: active sort option
 * - currentPage: current page in pagination
 * - itemPerPage: number of items per page
 *
 * 🔁 Actions:
 * - SET_PRICE: Update price range
 * - SET_COLOR: Update selected color
 * - SET_SIZE: Update selected size
 * - SET_AVAILABILITY: Update stock availability filter
 * - SET_BRANDS: Update selected brands
 * - SET_CATEGORIES: Update selected categories
 * - FILTER_PRODUCTS: Apply all filters to product list
 * - SET_SORTING_OPTION: Set sort option ("Price Ascending", etc.)
 * - SORT_PRODUCTS: Sort the already-filtered products
 * - SET_CURRENT_PAGE: Change current pagination page
 * - SET_ITEM_PER_PAGE: Set item count per page
 * - TOGGLE_FILTER_ON_SALE: Toggle sale-only product filter
 * - CLEAR_FILTER: Reset all filters to initial values
 *
 * 🧩 Notes:
 * - Filtering logic is centralized in `matchesAllFilters` for reusability and clean code
 * - `FILTER_PRODUCTS` must always be followed by `SORT_PRODUCTS` to reflect new sort state
 * - Filter state is designed to be consumed by a UI reducer hook (`useReducer`) in React
 */
