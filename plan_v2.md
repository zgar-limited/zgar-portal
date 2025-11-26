# 登录/注册页面重构计划 (v2)

## 目标
1.  **集成注册功能**：在 `Login.tsx` 中添加注册表单，支持用户在登录和注册之间切换。
2.  **注册表单增强**：注册时要求输入手机号，并包含国家/地区代码选择器。
3.  **UI/UX 优化**：
    -   使用 Tab 切换或条件渲染来管理登录/注册状态。
    -   优化表单布局和样式，使其更美观、现代。
    -   保持 PC 端宽度限制和移动端自适应。

## 组件设计

### 1. 新增 `CountryCodeSelect` 组件
创建一个新的组件 `components/common/CountryCodeSelect.jsx`，用于选择电话号码的国家/地区代码。
-   **数据源**：内置常用国家代码列表 (如 +86, +1, +44 等)。
-   **样式**：参考 `CurrencySelect.jsx`，使用下拉菜单形式。
-   **功能**：选择后回调父组件，传递选中的代码。

### 2. 重构 `Login.tsx`
将 `Login.tsx` 改造成包含登录和注册双重功能的组件。

#### 状态管理
-   `isLogin`: boolean，控制显示登录还是注册表单。
-   `formData`: object，存储表单数据 (email, password, phone, countryCode 等)。

#### 结构规划
```jsx
<section className="flat-spacing">
  <div className="container">
    <div className="login-register-wrapper" style={{ maxWidth: "500px", margin: "0 auto", width: "100%" }}>
      
      {/* 顶部切换 Tab */}
      <div className="tabs-header" style={{ display: "flex", marginBottom: "30px", borderBottom: "1px solid #e5e5e5" }}>
        <button 
          className={`tab-btn ${isLogin ? 'active' : ''}`} 
          onClick={() => setIsLogin(true)}
          style={{ flex: 1, padding: "15px", background: "none", border: "none", borderBottom: isLogin ? "2px solid black" : "none", fontWeight: isLogin ? "bold" : "normal" }}
        >
          Login
        </button>
        <button 
          className={`tab-btn ${!isLogin ? 'active' : ''}`} 
          onClick={() => setIsLogin(false)}
          style={{ flex: 1, padding: "15px", background: "none", border: "none", borderBottom: !isLogin ? "2px solid black" : "none", fontWeight: !isLogin ? "bold" : "normal" }}
        >
          Register
        </button>
      </div>

      {/* 表单区域 */}
      <div className="form-content">
        {isLogin ? (
          <LoginForm /> 
        ) : (
          <RegisterForm />
        )}
      </div>

    </div>
  </div>
</section>
```

#### 注册表单 (`RegisterForm`) 细节
-   **Email**: 输入框
-   **Password**: 输入框 (带显示/隐藏切换)
-   **Phone**: 
    -   组合输入框：左侧为 `CountryCodeSelect`，右侧为手机号输入框。
    -   样式：使用 Flex 布局，确保对齐。
-   **Submit Button**: "Register"

## 样式优化 (审美提升)
-   **间距**：增加表单项之间的间距，使布局更透气。
-   **圆角**：统一使用圆角 (如 8px 或 12px)，看起来更柔和。
-   **阴影**：给主容器添加轻微的阴影 (`box-shadow`)，增加层次感。
-   **交互**：输入框聚焦时的高亮颜色优化。

## 执行步骤
1.  创建 `components/common/CountryCodeSelect.jsx`。
2.  修改 `components/other-pages/Login.tsx`：
    -   引入 `useState` 管理 Tab 状态。
    -   实现 Tab 切换 UI。
    -   将原有登录表单封装或直接保留在 Login 分支。
    -   实现注册表单，集成 `CountryCodeSelect`。
    -   应用新的样式优化。