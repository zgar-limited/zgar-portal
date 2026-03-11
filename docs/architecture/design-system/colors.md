# 品牌色彩文档 (US-016)

## 概述

Zgar Portal 采用简洁的双品牌色设计系统，只有两个主色（粉色和蓝色），配合渐变效果，形成统一且专业的视觉风格。

## 品牌色

### 粉色 (Brand Pink)

粉色代表温暖、活力，是 Zgar 品牌的主要强调色。

```css
/* 主粉色 */
--brand-pink: #f496d3;
```

### 蓝色 (Brand Blue)

蓝色代表专业、可靠，是 Zgar 品牌的主要功能色。

```css
/* 主蓝色 */
--brand-blue: #0047c7;
```

## 渐变系统

### 主品牌渐变

从蓝色到粉色的 90 度水平渐变，是系统的主要渐变。

```css
background: linear-gradient(90deg, rgba(0, 71, 199, 1) 15%, rgba(244, 150, 211, 1) 85%);
```

### 反向渐变

从粉色到蓝色的 90 度水平渐变。

```css
background: linear-gradient(90deg, rgba(244, 150, 211, 1) 15%, rgba(0, 71, 199, 1) 85%);
```

### 垂直渐变

从蓝色到粉色的垂直渐变。

```css
background: linear-gradient(180deg, rgba(0, 71, 199, 1) 0%, rgba(244, 150, 211, 1) 100%);
```

## Tailwind CSS 类

项目预配置了以下 Tailwind CSS 类，可以直接使用：

### 背景色

```jsx
// 粉色背景
<div className="bg-brand-pink">粉色背景</div>

// 蓝色背景
<div className="bg-brand-blue">蓝色背景</div>

// 品牌渐变背景
<div className="bg-gradient-brand">渐变背景</div>
```

### 文字色

```jsx
// 粉色文字
<p className="text-brand-pink">粉色文字</p>

// 蓝色文字
<p className="text-brand-blue">蓝色文字</p>

// 渐变文字（需要配合 bg-clip-text）
<p className="text-transparent bg-clip-text bg-gradient-brand">
  渐变文字
</p>
```

### 边框

```jsx
// 粉色边框
<div className="border-2 border-brand-pink">粉色边框</div>

// 蓝色边框
<div className="border-2 border-brand-blue">蓝色边框</div>
```

### 渐变文字

```jsx
// 使用渐变作为文字颜色
<h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-brand">
  ZGAR Portal
</h1>
```

## 完整色阶

### Brand Blue 色阶

```css
--brand-blue-50:  #f0f7ff;
--brand-blue-100: #e0eeff;
--brand-blue-200: #b9dcff;
--brand-blue-300: #7cc4ff;
--brand-blue-400: #369eff;
--brand-blue-500: #0047c7;  /* 主色 */
--brand-blue-600: #0039a0;
--brand-blue-700: #002b77;
--brand-blue-800: #001d4e;
--brand-blue-900: #000f26;
```

### Brand Pink 色阶

```css
--brand-pink-50:  #fff1f7;
--brand-pink-100: #ffe4ef;
--brand-pink-200: #ffc9db;
--brand-pink-300: #ffa4c7;
--brand-pink-400: #ff7aa8;
--brand-pink-500: #f496d3;  /* 主色 */
--brand-pink-600: #e67dc2;
--brand-pink-700: #c455a4;
--brand-pink-800: #9c4483;
--brand-pink-900: #7a3966;
```

## 设计原则

1. **简洁**: 只用粉色和蓝色两个主色，不要引入更多颜色
2. **渐变**: 粉蓝之间用渐变连接，创造流动感
3. **对比**: 使用足够对比度确保可读性
4. **克制**: 动画和效果要克制，不要过度设计

## 使用场景

### 按钮

```jsx
// 主按钮 - 渐变
<button className="px-6 py-3 bg-gradient-brand text-white rounded-2xl font-semibold hover:shadow-lg transition-all">
  立即购买
</button>

// 次按钮 - 粉色
<button className="px-6 py-3 bg-brand-pink text-white rounded-2xl font-semibold hover:opacity-90 transition-all">
  加入购物车
</button>

// 辅助按钮 - 蓝色
<button className="px-6 py-3 bg-brand-blue text-white rounded-2xl font-semibold hover:opacity-90 transition-all">
  了解更多
</button>
```

### 徽章/标签

```jsx
// NEW 徽章 - 渐变
<div className="bg-gradient-brand text-white px-3 py-1 rounded-full text-xs font-bold">
  NEW
</div>

// HOT 徽章 - 粉色
<div className="bg-brand-pink text-white px-3 py-1 rounded-full text-xs font-bold">
  HOT
</div>
```

### 卡片

```jsx
// 默认卡片 - 白色背景
<div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all">
  内容
</div>

// 特色卡片 - 粉色边框
<div className="bg-white rounded-3xl shadow-lg border-2 border-brand-pink hover:shadow-xl transition-all">
  特色产品
</div>
```

### 链接

```jsx
// 默认链接 - 蓝色
<a href="#" className="text-brand-blue hover:underline">
  链接文字
</a>

// 强调链接 - 粉色
<a href="#" className="text-brand-pink hover:underline font-semibold">
  重要链接
</a>
```

## 渐变使用指南

### 何时使用渐变

1. **主按钮**: CTA 按钮使用品牌渐变
2. **标题**: 重要标题使用渐变文字
3. **背景**: Hero 区域使用渐变背景
4. **分隔线**: 使用渐变作为分隔装饰

### 何时不用渐变

1. **文本内容**: 正文不使用渐变，影响可读性
2. **表单元素**: 输入框、选择框不使用渐变
3. **小元素**: 图标、小标签不使用渐变

## 悬停状态

```jsx
// 按钮 hover - 透明度变化
<button className="bg-brand-pink hover:opacity-90 transition-opacity">
  按钮
</button>

// 卡片 hover - 阴影变化
<div className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
  内容
</div>

// 链接 hover - 下划线
<a className="text-brand-blue hover:underline">
  链接
</a>
```

## 相关文档

- [动画系统文档](./animations.md)
- [总体架构文档](../README.md)
