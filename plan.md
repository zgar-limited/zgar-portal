# 登录页面样式调整计划

## 目标
修改登录页面 (`components/other-pages/Login.tsx`) 的布局，使其：
1.  **PC 端**：限制最大宽度，避免过于宽大，并保持居中。
2.  **移动端**：保持自适应宽度，确保显示内容不会太小。

## 分析
当前 `Login.tsx` 结构如下：
```jsx
<section className="flat-spacing">
  <div className="container">
    <div className=""> {/* 目标容器 */}
        <h1 className="heading">Login</h1>
        <form ...>
           ...
        </form>
    </div>
    ...
  </div>
</section>
```
目前该容器没有宽度限制，在宽屏下会占满 `container` 的宽度（或者由父级决定），导致表单在 PC 上看起来过宽。

## 修改方案
直接在 `components/other-pages/Login.tsx` 中修改包裹表单的 `div` 元素。

**文件**: `components/other-pages/Login.tsx`

**变更**:
找到第 17 行的 `<div>`，添加内联样式以限制宽度并居中。

```jsx
// 修改前
<div className="">

// 修改后
<div className="" style={{ maxWidth: "500px", margin: "0 auto", width: "100%" }}>
```

*   `maxWidth: "500px"`: 限制 PC 端最大宽度。
*   `margin: "0 auto"`: 确保容器在页面中间。
*   `width: "100%"`: 确保在屏幕小于 500px 时（移动端），容器能占满可用空间，不会变得太窄。

## 验证
1.  在 PC 浏览器中查看，确认表单宽度被限制且居中。
2.  使用开发者工具模拟移动端设备，确认表单宽度自适应且显示正常。