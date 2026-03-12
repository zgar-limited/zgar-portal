# 动画系统文档 (US-017)

## 概述

Zgar Portal 使用 GSAP 和 Framer Motion 两个动画库，提供丰富的交互动画效果。项目封装了多个自定义 Hooks 便于复用。

## GSAP 动画

### 基础动画函数

所有 GSAP 动画函数位于 `hooks/useGsapAnimation.ts`：

#### 淡入动画 (fadeAnimation)

```typescript
import { fadeAnimation } from '@/hooks/useGsapAnimation';

// 元素添加 .tp_fade_anim 类
<div className="tp_fade_anim">内容</div>

// 自定义参数
<div
  className="tp_fade_anim"
  data-fade-offset="40"
  data-duration="0.75"
  data-fade-from="bottom"
  data-on-scroll="1"
  data-delay="0.15"
  data-ease="power2.out"
>
  内容
</div>
```

**参数**:
- `data-fade-offset`: 偏移距离（px）
- `data-duration`: 动画时长（秒）
- `data-fade-from`: 方向（top/bottom/left/right）
- `data-on-scroll`: 是否滚动触发（0/1）
- `data-delay`: 延迟时间（秒）
- `data-ease`: 缓动函数

#### 揭示动画 (revalEffectAnimation)

```typescript
import { revalEffectAnimation } from '@/hooks/useGsapAnimation';

// 元素添加 .tp_reveal_anim 类
<h2 className="tp_reveal_anim">揭示文字</h2>

// 自定义参数
<h2
  className="tp_reveal_anim"
  data-duration="1.5"
  data-on-scroll="1"
  data-stagger="0.02"
  data-delay="0.05"
>
  揭示文字
</h2>
```

#### 字符动画 (charAnimation)

```typescript
import { charAnimation } from '@/hooks/useGsapAnimation';

// 元素添加 .tp-char-animation 类
<h1 className="tp-char-animation">逐字显示</h1>
```

#### 文本段落动画 (animationParagraph)

```typescript
import { animationParagraph } from '@/hooks/useGsapAnimation';

// 元素添加 .tp_text_anim 类
<div className="tp_text_anim">
  <p>段落文字逐行动画</p>
</div>
```

#### 视差滚动 (textRightScrollAnimation)

```typescript
import { textRightScrollAnimation } from '@/hooks/useGsapAnimation';

// 元素添加 .tp-text-right-scroll 类
<div className="title-box">
  <span className="tp-text-right-scroll">视差滚动文字</span>
</div>
```

#### Pin 动画

```typescript
// 面板 Pin
import { panelAnimation } from '@/hooks/useGsapAnimation';

// Hero Pin
import { heroAnimation } from '@/hooks/useGsapAnimation';

// 服务面板 Pin
import { servicePanelAnimation } from '@/hooks/useGsapAnimation';

// Funfact Pin
import { funfactPanelAnimation } from '@/hooks/useGsapAnimation';
```

#### 图片动画

```typescript
// 图片缩放
import { zoomInAnimation } from '@/hooks/useGsapAnimation';
// 使用 .anim-zoomin 类

// 图片揭示
import { imageRevealAnimation } from '@/hooks/useGsapAnimation';
// 使用 .tp_img_reveal 类
```

#### 产品横幅动画

```typescript
import { productBannerAnimation } from '@/hooks/useGsapAnimation';

// 产品页面横幅固定效果
```

### 高级 GSAP 动画

#### SplitText 动画

```typescript
// 文本反转动画
import { textInvertAnim1, textInvertAnim2, textInvertAnim3 } from '@/hooks/useGsapAnimation';

// 文本透视动画
import { textPerspectiveAnimation } from '@/hooks/useGsapAnimation';
// 使用 .tp-text-perspective 类

// 分割文本动画
import { splitTextAnimation } from '@/hooks/useGsapAnimation';
// 使用 .tp-split-text 类
```

#### 滚动动画

```typescript
// 滚动移动文字
import { scrollMovingText } from '@/hooks/useGsapAnimation';
// 使用 .moving-text 类

// 上下滚动视差
import { scrollAnimation } from '@/hooks/useGsapAnimation';
// 使用 .tp-top-bottom-scroll 类

// 透视滑块动画
import { perspectiveAnim } from '@/hooks/useGsapAnimation';
// 使用 .tp-perspective-slider 类
```

## Framer Motion 动画

### 基础使用

```typescript
"use client";

import { motion } from "framer-motion";

export function FadeIn({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
```

### 常用动画变体

```typescript
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const scaleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};
```

### 列表动画

```typescript
import { motion, AnimatePresence } from "framer-motion";

export function List({ items }) {
  return (
    <AnimatePresence>
      {items.map((item) => (
        <motion.li
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {item.text}
        </motion.li>
      ))}
    </AnimatePresence>
  );
}
```

## 自定义动画 Hooks

### useGsapAnimation

```typescript
import { useGsapAnimation } from '@/hooks/useGsapAnimation';

export function MyComponent() {
  useGsapAnimation(() => {
    fadeAnimation();
    revalEffectAnimation();
  }, []);

  return <div>...</div>;
}
```

### 其他 GSAP Hooks

```typescript
// 粘性头部
import { useStickyHeader } from '@/hooks/useStickyHeader';

// 自动播放视频
import { useAutoPlayVideo } from '@/hooks/useAutoPlayVideo';

// Tab 指示器
import { useTabIndicator } from '@/hooks/useTabIndicator';

// 悬停效果
import { useHoverEffect } from '@/hooks/useHoverEffect';

// 滑动投影
import { useSkewSlider } from '@/hooks/useSkewSlider';
```

## Tailwind 动画类

项目预配置了两个 Tailwind 动画类：

```css
/* 浮动动画 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* 淡入动画 */
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
```

### 使用示例

```jsx
// 浮动效果
<div className="animate-float">
  浮动元素
</div>

// 淡入效果
<div className="animate-fade-in">
  淡入元素
</div>
```

## 性能优化

### 使用 will-change

```css
.optimized-element {
  will-change: transform, opacity;
}
```

### 避免布局抖动

```typescript
// ❌ 不好 - 触发布局
element.style.height = element.scrollHeight + 'px';

// ✅ 好 - 使用 transform
element.style.transform = `translateY(${value}px)`;
```

### 使用 requestAnimationFrame

```typescript
function animate() {
  requestAnimationFrame(() => {
    // 动画逻辑
  });
}
```

## 最佳实践

1. **克制使用**: 只在需要的地方添加动画，不要过度动画化
2. **性能优先**: 优先使用 transform 和 opacity，避免布局属性
3. **可访问性**: 尊重用户的 `prefers-reduced-motion` 设置
4. **测试**: 在低端设备上测试动画性能

## 相关文档

- [品牌色彩文档](./colors.md)
- [总体架构文档](../README.md)
