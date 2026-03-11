# Zgar Portal 路由表

> ⚠️ **手动维护文档**：新增或修改路由时，请同步更新此文件。
>
> 生成时间: 2026/3/5 18:11:57

## 路由概览

- 总路由数: 60
- 静态路由: 30
- 动态路由: 30

## 所有路由

| 路由路径 | 文件位置 | 页面类型 | 说明 |
|---------|---------|---------|------|
| / | `/app/[locale]/(layout)/(store)/page.tsx` | 静态 | - |
| /404 | `/app/[locale]/(layout)/(other-pages)/404/page.jsx` | 静态 | - |
| /about-us | `/app/[locale]/(layout)/(other-pages)/about-us/page.tsx` | 静态 | - |
| /account-addresses | `/app/[locale]/(layout)/(dashboard)/account-addresses/page.tsx` | 静态 | - |
| /account-orders | `/app/[locale]/(layout)/(dashboard)/account-orders/page.tsx` | 静态 | - |
| /account-page | `/app/[locale]/(layout)/(dashboard)/account-page/page.tsx` | 静态 | 老王我：account-page 页面显示账户概览 + 导航卡片 + 任务列表 |
| /account-setting | `/app/[locale]/(layout)/(dashboard)/account-setting/page.jsx` | 静态 | - |
| /account-transactions | `/app/[locale]/(layout)/(dashboard)/account-transactions/page.tsx` | 静态 | 老王我：交易记录页面 - 显示余额和积分交易流水 |
| /blog-detail | `/app/[locale]/(layout)/(blogs)/blog-detail/page.jsx` | 静态 | - |
| /blog-grid | `/app/[locale]/(layout)/(blogs)/blog-grid/page.jsx` | 静态 | - |
| /blog-list | `/app/[locale]/(layout)/(blogs)/blog-list/page.tsx` | 静态 | - |
| /blog-list-2 | `/app/[locale]/(layout)/(blogs)/blog-list-2/page.jsx` | 静态 | - |
| /care | `/app/[locale]/(layout)/(intro)/care/page.tsx` | 静态 | - |
| /checkout | `/app/[locale]/(layout)/(other-pages)/checkout/page.jsx` | 静态 | - |
| /club | `/app/[locale]/(layout)/(member)/club/page.tsx` | 静态 | Zgar Club 积分商城页面 |
| /compare | `/app/[locale]/(layout)/(other-pages)/compare/page.jsx` | 静态 | - |
| /contact-us | `/app/[locale]/(layout)/(other-pages)/contact-us/page.tsx` | 静态 | - |
| /faq | `/app/[locale]/(layout)/(other-pages)/faq/page.jsx` | 静态 | - |
| /invoice | `/app/[locale]/(layout)/(other-pages)/invoice/page.jsx` | 静态 | - |
| /login | `/app/[locale]/(layout)/(other-pages)/login/page.tsx` | 静态 | - |
| /partner | `/app/[locale]/(layout)/(intro)/partner/page.tsx` | 静态 | - |
| /register | `/app/[locale]/(layout)/(other-pages)/register/page.jsx` | 静态 | - |
| /reset-password | `/app/[locale]/(layout)/(other-pages)/reset-password/page.tsx` | 静态 | - |
| /shop | `/app/[locale]/(layout)/(store)/shop/page.tsx` | 静态 | - |
| /store-list | `/app/[locale]/(layout)/(other-pages)/store-list/page.jsx` | 静态 | - |
| /track-order | `/app/[locale]/(layout)/(other-pages)/track-order/page.jsx` | 静态 | - |
| /update-password | `/app/[locale]/(layout)/(other-pages)/update-password/page.tsx` | 静态 | - |
| /verify | `/app/[locale]/(layout)/verify/page.tsx` | 静态 | Verify 页面 - 完全复刻 zgar.com 防伪验证页面 |
| /verify-guide | `/app/[locale]/(layout)/(verify)/verify-guide/page.tsx` | 静态 | 防伪查询页面 |
| /view-cart | `/app/[locale]/(layout)/(other-pages)/view-cart/page.tsx` | 静态 | - |
| /account-orders-detail/[id] | `/app/[locale]/(layout)/(dashboard)/account-orders-detail/[id]/page.tsx` | 动态 | 老王我改成使用带自定义字段的服务端函数 |
| /product-available/[id] | `/app/[locale]/(layout)/(product-detail)/product-available/[id]/page.jsx` | 动态 | - |
| /product-bottom-thumbnail/[id] | `/app/[locale]/(layout)/(product-detail)/product-bottom-thumbnail/[id]/page.jsx` | 动态 | - |
| /product-buy-the-look/[id] | `/app/[locale]/(layout)/(product-detail)/product-buy-the-look/[id]/page.jsx` | 动态 | - |
| /product-buyx-gety/[id] | `/app/[locale]/(layout)/(product-detail)/product-buyx-gety/[id]/page.jsx` | 动态 | - |
| /product-countdown-timer/[id] | `/app/[locale]/(layout)/(product-detail)/product-countdown-timer/[id]/page.jsx` | 动态 | - |
| /product-description-accordion/[id] | `/app/[locale]/(layout)/(product-detail)/product-description-accordion/[id]/page.jsx` | 动态 | - |
| /product-description-list/[id] | `/app/[locale]/(layout)/(product-detail)/product-description-list/[id]/page.jsx` | 动态 | - |
| /product-description-vertical/[id] | `/app/[locale]/(layout)/(product-detail)/product-description-vertical/[id]/page.jsx` | 动态 | - |
| /product-frequently-bought-together/[id] | `/app/[locale]/(layout)/(product-detail)/product-frequently-bought-together/[id]/page.jsx` | 动态 | - |
| /product-grid-2/[id] | `/app/[locale]/(layout)/(product-detail)/product-grid-2/[id]/page.jsx` | 动态 | - |
| /product-grid/[id] | `/app/[locale]/(layout)/(product-detail)/product-grid/[id]/page.jsx` | 动态 | - |
| /product-group/[id] | `/app/[locale]/(layout)/(product-detail)/product-group/[id]/page.jsx` | 动态 | - |
| /product-information/[id] | `/app/[locale]/(layout)/(product-detail)/product-information/[id]/page.jsx` | 动态 | - |
| /product-left-thumbnail/[id] | `/app/[locale]/(layout)/(product-detail)/product-left-thumbnail/[id]/page.jsx` | 动态 | - |
| /product-often-purchased-together/[id] | `/app/[locale]/(layout)/(product-detail)/product-often-purchased-together/[id]/page.jsx` | 动态 | - |
| /product-options-customizer/[id] | `/app/[locale]/(layout)/(product-detail)/product-options-customizer/[id]/page.jsx` | 动态 | - |
| /product-out-of-stock/[id] | `/app/[locale]/(layout)/(product-detail)/product-out-of-stock/[id]/page.jsx` | 动态 | - |
| /product-right-thumbnail/[id] | `/app/[locale]/(layout)/(product-detail)/product-right-thumbnail/[id]/page.jsx` | 动态 | - |
| /product-stacked/[id] | `/app/[locale]/(layout)/(product-detail)/product-stacked/[id]/page.jsx` | 动态 | - |
| /product-swatch-dropdown-color/[id] | `/app/[locale]/(layout)/(product-detail)/product-swatch-dropdown-color/[id]/page.jsx` | 动态 | - |
| /product-swatch-dropdown/[id] | `/app/[locale]/(layout)/(product-detail)/product-swatch-dropdown/[id]/page.jsx` | 动态 | - |
| /product-swatch-image-square/[id] | `/app/[locale]/(layout)/(product-detail)/product-swatch-image-square/[id]/page.jsx` | 动态 | - |
| /product-swatch-image/[id] | `/app/[locale]/(layout)/(product-detail)/product-swatch-image/[id]/page.jsx` | 动态 | - |
| /product-video/[id] | `/app/[locale]/(layout)/(product-detail)/product-video/[id]/page.jsx` | 动态 | - |
| /product-volume-discount-thumbnail/[id] | `/app/[locale]/(layout)/(product-detail)/product-volume-discount-thumbnail/[id]/page.jsx` | 动态 | - |
| /product-volume-discount/[id] | `/app/[locale]/(layout)/(product-detail)/product-volume-discount/[id]/page.jsx` | 动态 | - |
| /products/[id] | `/app/[locale]/(layout)/(store)/products/[id]/page.tsx` | 动态 | - |
| /qr/[qr] | `/app/[locale]/(layout)/qr/[qr]/page.tsx` | 动态 | - |
| /care/article/[slug] | `/app/[locale]/(layout)/(intro)/care/article/[slug]/page.tsx` | 动态 | - |

## 路由组详情

### layout / store

包含 3 个路由:

- **/** - 无描述
- **/shop** - 无描述
- **/products/[id]** - 无描述

### layout / other-pages

包含 14 个路由:

- **/404** - 无描述
- **/about-us** - 无描述
- **/checkout** - 无描述
- **/compare** - 无描述
- **/contact-us** - 无描述
- **/faq** - 无描述
- **/invoice** - 无描述
- **/login** - 无描述
- **/register** - 无描述
- **/reset-password** - 无描述
- **/store-list** - 无描述
- **/track-order** - 无描述
- **/update-password** - 无描述
- **/view-cart** - 无描述

### layout / dashboard

包含 6 个路由:

- **/account-addresses** - 无描述
- **/account-orders** - 无描述
- **/account-page** - 老王我：account-page 页面显示账户概览 + 导航卡片 + 任务列表
- **/account-setting** - 无描述
- **/account-transactions** - 老王我：交易记录页面 - 显示余额和积分交易流水
- **/account-orders-detail/[id]** - 老王我改成使用带自定义字段的服务端函数

### layout / blogs

包含 4 个路由:

- **/blog-detail** - 无描述
- **/blog-grid** - 无描述
- **/blog-list** - 无描述
- **/blog-list-2** - 无描述

### layout / intro

包含 3 个路由:

- **/care** - 无描述
- **/partner** - 无描述
- **/care/article/[slug]** - 无描述

### layout / member

包含 1 个路由:

- **/club** - Zgar Club 积分商城页面

### layout

包含 2 个路由:

- **/verify** - Verify 页面 - 完全复刻 zgar.com 防伪验证页面
- **/qr/[qr]** - 无描述

### layout / verify

包含 1 个路由:

- **/verify-guide** - 防伪查询页面

### layout / product-detail

包含 26 个路由:

- **/product-available/[id]** - 无描述
- **/product-bottom-thumbnail/[id]** - 无描述
- **/product-buy-the-look/[id]** - 无描述
- **/product-buyx-gety/[id]** - 无描述
- **/product-countdown-timer/[id]** - 无描述
- **/product-description-accordion/[id]** - 无描述
- **/product-description-list/[id]** - 无描述
- **/product-description-vertical/[id]** - 无描述
- **/product-frequently-bought-together/[id]** - 无描述
- **/product-grid-2/[id]** - 无描述
- **/product-grid/[id]** - 无描述
- **/product-group/[id]** - 无描述
- **/product-information/[id]** - 无描述
- **/product-left-thumbnail/[id]** - 无描述
- **/product-often-purchased-together/[id]** - 无描述
- **/product-options-customizer/[id]** - 无描述
- **/product-out-of-stock/[id]** - 无描述
- **/product-right-thumbnail/[id]** - 无描述
- **/product-stacked/[id]** - 无描述
- **/product-swatch-dropdown-color/[id]** - 无描述
- **/product-swatch-dropdown/[id]** - 无描述
- **/product-swatch-image-square/[id]** - 无描述
- **/product-swatch-image/[id]** - 无描述
- **/product-video/[id]** - 无描述
- **/product-volume-discount-thumbnail/[id]** - 无描述
- **/product-volume-discount/[id]** - 无描述

