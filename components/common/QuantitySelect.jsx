"use client";
import { Minus, Plus } from "lucide-react";
import React from "react";

const QuantitySelect = ({
  quantity = 1,
  setQuantity = () => {},
  styleClass = "",
}) => {
  const handleDecrease = () => {
    if (setQuantity) {
      setQuantity(quantity > 1 ? quantity - 1 : quantity);
    }
  };

  const handleIncrease = () => {
    if (setQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && setQuantity) {
      setQuantity(value);
    }
  };

  return (
    <div className={`wg-quantity ${styleClass}`}>
      <button className="btn-quantity btn-decrease" onClick={handleDecrease}>
        <Minus></Minus>
      </button>
      <input
        className="quantity-product"
        // type="number"
        name="number"
        value={quantity}
        onChange={handleChange}
      />
      <button
        className="btn-quantity btn-increase"
        onClick={handleIncrease}
        role="button"
        tabIndex={0}
      >
        <Plus />
        {/* <i className="icon icon-plus" /> */}
      </button>
    </div>
  );
};

export default QuantitySelect;
