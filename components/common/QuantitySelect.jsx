"use client";
import { Minus, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";

const QuantitySelect = ({
  quantity = 1,
  setQuantity = (val) => {},
  styleClass = "",
  step = 1,
}) => {
  const [inputValue, setInputValue] = useState(quantity);

  useEffect(() => {
    setInputValue(quantity);
  }, [quantity]);

  const handleDecrease = () => {
    if (setQuantity) {
      // 老王我：修复减少逻辑，允许减少到最小值（step）
      setQuantity(quantity > step ? quantity - step : step);
    }
  };

  const handleIncrease = () => {
    if (setQuantity) {
      setQuantity(quantity + step);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleBlur = (e) => {
    let value = parseInt(e.target.value, 10);
    
    if (isNaN(value) || value <= 0) {
      // Reset to current valid quantity if input is invalid
      setInputValue(quantity);
      return;
    }

    if (step > 1) {
      const remainder = value % step;
      if (remainder !== 0) {
        if (remainder < step / 2) {
          value = value - remainder;
        } else {
          value = value + (step - remainder);
        }
      }
    }
    
    // Ensure minimum value is at least step (or 1 if step is not set/invalid)
    const minVal = step > 0 ? step : 1;
    if (value < minVal) value = minVal;

    setQuantity(value);
    setInputValue(value);
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
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
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
