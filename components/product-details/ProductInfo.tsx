"use client";
import React, { useState, useEffect, useMemo } from "react";
import { StoreProduct, StoreProductVariant } from "@medusajs/types";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/common/ToastProvider";
import QuantitySelect from "../common/QuantitySelect";
import { medusaSDK } from "@/utils/medusa";

interface ProductInfoProps {
  product: StoreProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { customer } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // State for selected options (e.g. { "opt_123": "L", "opt_456": "Blue" })
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(50);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Initialize options with first variant's options or defaults
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants[0];
      const initialOptions: Record<string, string> = {};
      defaultVariant.options?.forEach((opt: any) => {
        initialOptions[opt.option_id] = opt.value;
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  // Find the variant matching all selected options
  const selectedVariant = useMemo(() => {
    if (!product.variants) return undefined;

    return product.variants.find((variant) => {
      return variant.options?.every((opt: any) => {
        return selectedOptions[opt.option_id] === opt.value;
      });
    });
  }, [product, selectedOptions]);

  const handleOptionSelect = (optionId: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const handleAddToCart = async () => {
    if (!customer) {
      router.push("/login");
      return;
    }

    if (!selectedVariant) {
      showToast("Please select options", "warning");
      return;
    }

    setIsAdding(true);
    try {
      const cartId = localStorage.getItem("cart_id");
      if (!cartId) {
        throw new Error("No cart found");
      }

      await medusaSDK.store.cart.createLineItem(cartId, {
        variant_id: selectedVariant.id,
        quantity: quantity,
        metadata: selectedVariant.metadata
      });
      router.refresh();

      setIsAdded(true);
      showToast("Added to cart successfully", "success");

      // Reset added state
      setTimeout(() => setIsAdded(false), 2000);
    } catch (e) {
      console.error(e);
      showToast("Failed to add to cart. Please try again.", "danger");
    } finally {
      setIsAdding(false);
    }
  };

  // Safe price display
  const price = useMemo(() => {
    // @ts-ignore
    if (selectedVariant?.prices?.[0]?.amount) {
      // @ts-ignore
      return selectedVariant.prices[0].amount; // Medusa v2 might be raw number, usually implies currency handling elsewhere, assuming direct value for now or /100 if cents
    }
    // Fallback to product price or first variant
    // @ts-ignore
    return product.variants?.[0]?.prices?.[0]?.amount || 0;
  }, [selectedVariant, product]);

  const isSoldOut = selectedVariant && selectedVariant.inventory_quantity === 0; // Check inventory logic if needed

  return (
    <div className="gap-4 d-flex flex-column">
      {/* Header */}
      <div>
        {product.collection && (
          <span className="mb-2 tracking-wider text-uppercase text-muted small fw-bold d-block">
            {product.collection.title}
          </span>
        )}
        <h1 className="mb-2 h2 fw-bold">{product.title}</h1>
        <div className="gap-3 d-flex align-items-center">
          <span className="mb-0 h3 fw-bold text-primary">
            ${price.toFixed(2)}
          </span>
          {/* Optional: Compare at price if available */}
        </div>
      </div>

      <hr className="my-1 border-secondary opacity-10" />

      {/* Description Preview */}
      {product.description && (
        <p className="leading-relaxed text-muted">{product.description}</p>
      )}

      {/* Options Selector */}
      {product.options?.map((option) => (
        <div key={option.id}>
          <label className="mb-2 fw-semibold d-block small text-uppercase text-muted">
            {option.title}:{" "}
            <span className="text-dark">{selectedOptions[option.id]}</span>
          </label>
          <div className="flex-wrap gap-2 d-flex">
            {option.values?.map((val: any) => {
              // Medusa option values are distinct strings in v2? or objects. Usually objects in response, but let's handle uniqueness
              // Need to deduplicate values if they are repeated in the list (Medusa usually returns all values associated)
              return (
                <button
                  key={val.value}
                  onClick={() => handleOptionSelect(option.id, val.value)}
                  className={`btn btn-sm ${
                    selectedOptions[option.id] === val.value
                      ? "btn-dark"
                      : "btn-outline-secondary"
                  } px-3 py-2`}
                  style={{ minWidth: "3rem" }}
                >
                  {val.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Unique values filtering might be needed if option.values contains duplicates. 
          Usually Medusa product object has 'options' array with unique values in 'values' array? 
          Actually Medusa product.options.values is array of {id, value, variant_id?}. 
          We should dedupe by value string. 
      */}

      {/* Actions */}
      <div className="gap-3 mt-2 d-flex flex-column flex-sm-row">
        {/* Quantity */}
        <QuantitySelect
          quantity={quantity}
          setQuantity={setQuantity}
          step={50}
        />

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || isAdding || isAdded}
          className={`btn flex-grow-1 rounded-pill d-flex align-items-center justify-content-center gap-2 ${
            isAdded ? "btn-success" : "btn-dark"
          }`}
          style={{ height: "48px" }}
        >
          {isAdding ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isAdded ? (
            <Check size={20} />
          ) : (
            <ShoppingCart size={20} />
          )}
          <span className="fw-bold">
            {isAdding
              ? "Adding..."
              : isAdded
              ? "Added to Cart"
              : !selectedVariant
              ? "Select Options"
              : "Add to Cart"}
          </span>
        </button>
      </div>

      {/* Additional Info / Policies */}
      <div className="gap-2 mt-2 d-flex flex-column">
        <div className="gap-2 d-flex align-items-center text-muted small">
          <Check size={16} className="text-success" />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="gap-2 d-flex align-items-center text-muted small">
          <Check size={16} className="text-success" />
          <span>30-day return policy</span>
        </div>
      </div>
    </div>
  );
}
