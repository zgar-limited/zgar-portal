"use client";
import { allProducts } from "@/data/products";
import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useRef,
  useMemo,
} from "react";

const dataContext = createContext(undefined);

export const useContextElement = () => {
  const context = useContext(dataContext);
  if (!context) {
    throw new Error("useContextElement must be used within a Context provider");
  }
  return context;
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quickAddItem, setQuickAddItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Sync from localStorage
  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cartList") || "[]");
      const storedWish = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const storedCompare = JSON.parse(
        localStorage.getItem("compareList") || "[]"
      );

      if (Array.isArray(storedCart)) setCartProducts(storedCart);
      if (Array.isArray(storedWish)) setWishList(storedWish);
      if (Array.isArray(storedCompare)) setCompareItem(storedCompare);
    } catch {
      setCartProducts([]);
      setWishList([]);
      setCompareItem([]);
    }
  }, []);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem("cartList", JSON.stringify(cartProducts));
      localStorage.setItem("wishlist", JSON.stringify(wishList));
      localStorage.setItem("compareList", JSON.stringify(compareItem));
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [cartProducts, wishList, compareItem]);

  useEffect(() => {
    const subtotal = cartProducts.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id) => {
    return cartProducts.some((product) => product.id === id);
  };

  const addProductToCart = (productOrId, qty = 1) => {
    setCartProducts((prev) => {
      let id;
      let product;

      if (typeof productOrId === 'object') {
        id = productOrId.id;
        product = productOrId;
      } else {
        id = productOrId;
        product = allProducts.find((p) => p.id == id);
      }

      if (!product) return prev;

      const existingProductIndex = prev.findIndex((p) => p.id === id);
      
      if (existingProductIndex > -1) {
        // Update existing product quantity
        const newCart = [...prev];
        // If passed an object with quantity, use that, otherwise add qty
        const newQty = typeof productOrId === 'object' && productOrId.quantity
          ? productOrId.quantity
          : newCart[existingProductIndex].quantity + qty;
          
        newCart[existingProductIndex] = {
          ...newCart[existingProductIndex],
          quantity: newQty
        };
        return newCart;
      } else {
        // Add new product
        const item = {
          ...product,
          quantity: typeof productOrId === 'object' && productOrId.quantity ? productOrId.quantity : qty
        };
        return [...prev, item];
      }
    });
  };
  const addEmptyProductToCart = (id, qty = 1) => {
    setCartProducts((prev) => {
      const exists = prev.some((p) => p.id === id);
      if (exists) return prev;
      const product = allProducts.find((p) => p.id == id);
      if (!product) return prev;
      const item = { ...product, quantity: qty };
      return [...prev, item];
    });
  };
  const removeProductFromCart = (id) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCartProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const quantityInCart = (id) => {
    const item = cartProducts.find((p) => p.id === id);
    return item ? item.quantity : 0;
  };

  const addToWishlist = (product) => {
    setWishList((prev) =>
      prev.includes(product)
        ? prev.filter((i) => i !== product)
        : [...prev, product]
    );
  };

  const removeFromWishlist = (product) => {
    setWishList((prev) => prev.filter((i) => i !== product));
  };

  const addToCompareItem = (product) => {
    setCompareItem((prev) =>
      prev.includes(product) ? prev : [...prev, product]
    );
  };

  const removeFromCompareItem = (product) => {
    setCompareItem((prev) => prev.filter((i) => i !== product));
  };

  const isAddedtoWishlist = (product) => wishList.includes(product);
  const isAddedtoCompareItem = (product) => compareItem.includes(product);

  const contextElement = useMemo(
    () => ({
      cartProducts,
      setCartProducts,
      totalPrice,
      addProductToCart,
      isAddedToCartProducts,
      removeProductFromCart,
      removeFromWishlist,
      addToWishlist,
      isAddedtoWishlist,
      quickViewItem,
      setQuickViewItem,
      quickAddItem,
      setQuickAddItem,
      addToCompareItem,
      isAddedtoCompareItem,
      removeFromCompareItem,
      compareItem,
      setCompareItem,
      updateQuantity,
      quantityInCart,
      wishList,
    }),
    [
      cartProducts,
      setCartProducts,
      totalPrice,
      addProductToCart,
      isAddedToCartProducts,
      removeProductFromCart,
      removeFromWishlist,
      addToWishlist,
      isAddedtoWishlist,
      quickViewItem,
      setQuickViewItem,
      quickAddItem,
      setQuickAddItem,
      addToCompareItem,
      isAddedtoCompareItem,
      removeFromCompareItem,
      compareItem,
      setCompareItem,
      updateQuantity,
      quantityInCart,
      wishList,
    ]
  );

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
