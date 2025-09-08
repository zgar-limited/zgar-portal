export const setPrice = (dispatch, value) => {
  dispatch({ type: "SET_PRICE", payload: value });
};

export const setColor = (dispatch, value, color) => {
  const payload = value === color ? "All" : value;
  dispatch({ type: "SET_COLOR", payload });
};

export const setSize = (dispatch, value, size) => {
  const payload = value === size ? "All" : value;
  dispatch({ type: "SET_SIZE", payload });
};

export const setAvailability = (dispatch, value, availability) => {
  const payload = value === availability ? "All" : value;
  dispatch({ type: "SET_AVAILABILITY", payload });
};

export const setBrands = (dispatch, newBrand, brands) => {
  const updated = brands.includes(newBrand)
    ? brands.filter((b) => b !== newBrand)
    : [...brands, newBrand];
  dispatch({ type: "SET_BRANDS", payload: updated });
};

export const removeBrand = (dispatch, brandToRemove, brands) => {
  const updated = brands.filter((b) => b !== brandToRemove);
  dispatch({ type: "SET_BRANDS", payload: updated });
};

export const setCategories = (dispatch, newItem, categories) => {
  const updated = categories.includes(newItem)
    ? categories.filter((c) => c !== newItem)
    : [...categories, newItem];
  dispatch({ type: "SET_CATEGORIES", payload: updated });
};

export const removeCategories = (dispatch, categoryToRemove, categories) => {
  const updated = categories.filter((c) => c !== categoryToRemove);
  dispatch({ type: "SET_CATEGORIES", payload: updated });
};

export const setSortingOption = (dispatch, value) => {
  dispatch({ type: "SET_SORTING_OPTION", payload: value });
};

export const toggleFilterWithOnSale = (dispatch) => {
  dispatch({ type: "TOGGLE_FILTER_ON_SALE" });
};

export const setCurrentPage = (dispatch, value) => {
  dispatch({ type: "SET_CURRENT_PAGE", payload: value });
};

export const setItemPerPage = (dispatch, value) => {
  dispatch({ type: "SET_CURRENT_PAGE", payload: 1 });
  dispatch({ type: "SET_ITEM_PER_PAGE", payload: value });
};

export const clearFilter = (dispatch) => {
  dispatch({ type: "CLEAR_FILTER" });
};

/**
 * Product Filter Action Helpers
 * -----------------------------
 * A collection of dispatcher helper functions that simplify dispatching actions
 * for a product filtering reducer in a React `useReducer` setup.
 *
 * ✅ Purpose:
 * - Simplifies and abstracts dispatch logic
 * - Handles toggle behavior for filters (e.g., select/deselect color or brand)
 * - Keeps reducer dispatches consistent and maintainable
 *
 * 🔧 Functions:
 *
 * @function setPrice
 * @desc Sets the price range filter
 * @param {Function} dispatch - Reducer dispatch function
 * @param {[number, number]} value - Price range [min, max]
 *
 * @function setColor
 * @desc Toggles color filter (sets to "All" if re-selected)
 * @param {Function} dispatch
 * @param {string} value - Selected color
 * @param {string} color - Current color
 *
 * @function setSize
 * @desc Toggles size filter (sets to "All" if re-selected)
 * @param {Function} dispatch
 * @param {string} value - Selected size
 * @param {string} size - Current size
 *
 * @function setAvailability
 * @desc Toggles availability filter between "InStock", "OutOfStock", "All"
 * @param {Function} dispatch
 * @param {string} value - New availability option
 * @param {string} availability - Current value
 *
 * @function setBrands
 * @desc Toggles brand selection; supports multiple selection
 * @param {Function} dispatch
 * @param {string} newBrand - Brand to add/remove
 * @param {string[]} brands - Current selected brands
 *
 * @function removeBrand
 * @desc Removes a specific brand from selected brands
 * @param {Function} dispatch
 * @param {string} brandToRemove
 * @param {string[]} brands
 *
 * @function setCategories
 * @desc Toggles category selection; supports multiple selection
 * @param {Function} dispatch
 * @param {string} newItem - Category to add/remove
 * @param {string[]} categories
 *
 * @function removeCategories
 * @desc Removes a specific category from selection
 * @param {Function} dispatch
 * @param {string} categoryToRemove
 * @param {string[]} categories
 *
 * @function setSortingOption
 * @desc Sets the current sorting option
 * @param {Function} dispatch
 * @param {string} value - Sorting option string
 *
 * @function toggleFilterWithOnSale
 * @desc Toggles the "on sale only" filter flag
 * @param {Function} dispatch
 *
 * @function setCurrentPage
 * @desc Sets the active page for pagination
 * @param {Function} dispatch
 * @param {number} value - Page number
 *
 * @function setItemPerPage
 * @desc Sets item count per page and resets page to 1
 * @param {Function} dispatch
 * @param {number} value - Items per page
 *
 * @function clearFilter
 * @desc Resets all filters to their default values
 * @param {Function} dispatch
 *
 * 🧩 Notes:
 * - These helpers should be used inside React components that call `useReducer`
 * - Keeps UI logic clean and centralizes state update logic
 */
