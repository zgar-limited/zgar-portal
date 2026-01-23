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

  // 老王我：Vibrant Blocks 风格 - 紧凑现代设计
  return (
    <div className={`flex items-center gap-3 ${styleClass}`}>
      {/* 老王我：减少按钮 - 粉色渐变 */}
      <button
        onClick={handleDecrease}
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink to-brand-pink/80 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={quantity <= step}
        aria-label="减少数量"
      >
        <Minus size={20} strokeWidth={3} />
      </button>

      {/* 老王我：数量输入框 - 简洁边框 */}
      <input
        className="w-24 h-12 text-center text-xl font-black text-gray-900 border-2 border-brand-blue rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-blue/20 transition-all"
        type="number"
        name="number"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={step}
        step={step}
        aria-label="数量"
      />

      {/* 老王我：增加按钮 - 蓝色渐变 */}
      <button
        onClick={handleIncrease}
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue to-brand-blue/80 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        aria-label="增加数量"
      >
        <Plus size={20} strokeWidth={3} />
      </button>
    </div>
  );
};

export default QuantitySelect;
