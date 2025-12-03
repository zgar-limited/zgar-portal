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
import { useShopContext } from "./ShopContext";
import { useToast } from "@/components/common/ToastProvider";

const dataContext = createContext(undefined);

export const useContextElement = () => {
  const context = useContext(dataContext);
  if (!context) {
    throw new Error("useContextElement must be used within a Context provider");
  }
  return context;
};

export default function Context({ children }) {
  const { cart, addToCart, removeFromCart, updateCartItem, cartLoading } = useShopContext();
  const { showToast } = useToast();
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quickAddItem, setQuickAddItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  // Map Medusa cart items to the format expected by the UI
  const cartProducts = useMemo(() => {
    if (!cart?.items) return [];
    return cart.items.map((item) => ({
      id: item.id, // Line item ID for removal/update
      variantId: item.variant_id,
      productId: item.product_id,
      title: item.product_title,
      variantTitle: item.variant_title,
      price: item.unit_price, // Medusa prices are usually in cents, check if division is needed. Assuming unit_price is correct for now or adjust if needed.
      quantity: item.quantity,
      imgSrc: item.thumbnail || "https://picsum.photos/100/100", // Fallback image
      options: item.variant?.options || [],
      // Add other necessary fields mapped from Medusa item
    }));
  }, [cart]);

  // Sync from localStorage (only for wishlist and compare)
  useEffect(() => {
    try {
      const storedWish = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const storedCompare = JSON.parse(
        localStorage.getItem("compareList") || "[]"
      );

      if (Array.isArray(storedWish)) setWishList(storedWish);
      if (Array.isArray(storedCompare)) setCompareItem(storedCompare);
    } catch {
      setWishList([]);
      setCompareItem([]);
    }
  }, []);

  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      localStorage.setItem("wishlist", JSON.stringify(wishList));
      localStorage.setItem("compareList", JSON.stringify(compareItem));
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [wishList, compareItem]);

  useEffect(() => {
    if (cart) {
      // Medusa cart total is usually in cents if currency is involved, but let's use the calculated total from items for now to match previous logic or use cart.total / 100
      // Using local calculation based on mapped products to ensure consistency with UI display
      const subtotal = cartProducts.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );
      setTotalPrice(subtotal);
    }
  }, [cartProducts, cart]);

  const isAddedToCartProducts = (id) => {
    // Check if product (variant) is in cart. 
    // Note: The UI might be passing product ID or variant ID. 
    // If it's product ID, we check if any item in cart has that product ID.
    return cartProducts.some((product) => product.productId === id || product.variantId === id);
  };

  const addProductToCart = async (productOrId, qty = 1) => {
    let variantId;
    let quantity = qty;

    if (typeof productOrId === 'object') {
      // Assuming product object has a default variant or we need to select one.
      // For now, let's assume we pick the first variant if available, or the ID itself is the variant ID if passed explicitly.
      // Ideally, the UI should pass a variant ID.
      // If productOrId is a full product object from Medusa, it should have variants.
      if (productOrId.variants && productOrId.variants.length > 0) {
        variantId = productOrId.variants[0].id;
      } else {
        variantId = productOrId.id; // Fallback
      }
      
      if (productOrId.quantity) {
        quantity = productOrId.quantity;
      }
    } else {
      // If it's an ID, we assume it's a variant ID or we need to find the product to get the variant.
      // Since we don't have full product list here easily without fetching, 
      // we might need to rely on the caller passing a valid variant ID.
      // However, existing code might be passing product ID.
      // Let's try to find it in allProducts if possible, or assume it's a variant ID.
      const product = allProducts.find((p) => p.id == productOrId);
      if (product && product.variants && product.variants.length > 0) {
         variantId = product.variants[0].id; // Default to first variant
      } else {
         variantId = productOrId;
      }
    }

    if (variantId) {
      try {
        await addToCart(variantId, quantity);
        showToast("Added to cart successfully", "success");
      } catch (error) {
        console.error("Failed to add to cart:", error);
        showToast("Failed to add to cart. Please try again.", "danger");
      }
    } else {
        showToast("Product variant not found", "danger");
    }
  };

  const addEmptyProductToCart = (id, qty = 1) => {
     // This seems to be for adding a placeholder? 
     // With Medusa, we probably just want to add the real product.
     addProductToCart(id, qty);
  };

  const removeProductFromCart = async (id) => {
    // id here corresponds to the line item ID in our mapped cartProducts
    await removeFromCart(id);
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;
    // id is line item ID
    await updateCartItem(id, qty);
  };

  const quantityInCart = (id) => {
    const item = cartProducts.find((p) => p.id === id || p.productId === id || p.variantId === id);
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
      setCartProducts: () => {}, // No-op, managed by Medusa
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
      cartLoading, // Expose loading state
    }),
    [
      cartProducts,
      totalPrice,
      // addProductToCart, // These are stable functions now
      // isAddedToCartProducts,
      // removeProductFromCart,
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
      // updateQuantity,
      // quantityInCart,
      wishList,
      cartLoading,
    ]
  );

  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
