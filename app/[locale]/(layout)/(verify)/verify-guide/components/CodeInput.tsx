/**
 * 6位数字输入框组件
 *
 * 用于输入防伪验证码后6位
 * 支持自动聚焦、删除键回退、粘贴等功能
 */

'use client';

import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// TypeScript 类型定义
// ============================================

interface CodeInputProps {
  /** 输入完成回调 */
  onComplete: (code: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义类名 */
  className?: string;
}

// ============================================
// 组件实现
// ============================================

/**
 * 6位数字输入框组件
 *
 * @example
 * ```tsx
 * <CodeInput
 *   onComplete={(code) => console.log('完整验证码:', code)}
 *   disabled={isLoading}
 * />
 * ```
 */
export function CodeInput({ onComplete, disabled = false, className }: CodeInputProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /**
   * 处理输入变化
   */
  const handleChange = (index: number, value: string) => {
    // 只允许输入数字
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // 自动聚焦下一个框
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // 检查是否已输入满6位
    if (newCode.every((digit) => digit !== '')) {
      const fullCode = newCode.join('');
      onComplete(fullCode);
    }
  };

  /**
   * 处理键盘事件
   */
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 删除键回退
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /**
   * 处理粘贴事件
   */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    // 检查是否为6位数字
    if (!/^\d{1,6}$/.test(pastedData)) {
      return;
    }

    // 分配到各个输入框
    const digits = pastedData.split('');
    const newCode = [...code];

    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setCode(newCode);

    // 聚焦到下一个空框
    const nextEmptyIndex = newCode.findIndex((d) => d === '');
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
      inputRefs.current[nextEmptyIndex]?.focus();
    }

    // 检查是否已输入满6位
    if (newCode.every((digit) => digit !== '')) {
      const fullCode = newCode.join('');
      onComplete(fullCode);
    }
  };

  /**
   * 处理聚焦
   */
  const handleFocus = (index: number) => {
    // 选中当前框的内容，方便直接覆盖
    inputRefs.current[index]?.select();
  };

  return (
    <div className={cn('flex gap-3 justify-center', className)}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={code[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={cn(
            // 尺寸
            'w-12 h-14 sm:w-14 sm:h-16',
            // 文字
            'text-center text-2xl sm:text-3xl font-semibold',
            // 边框和圆角
            'border-2 rounded-xl',
            // 过渡效果
            'transition-all duration-200',
            // 禁用状态
            'disabled:cursor-not-allowed disabled:opacity-50',
            // 焦点和填充状态
            code[index]
              ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
              : 'border-gray-200 hover:border-brand-pink/50',
            // 焦点状态
            'focus:outline-none focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/20'
          )}
          aria-label={`验证码第${index + 1}位`}
        />
      ))}
    </div>
  );
}
