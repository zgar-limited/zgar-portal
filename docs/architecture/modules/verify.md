# 验证模块文档 (US-013)

## 概述

验证模块提供防伪码验证和积分码验证功能，支持A类防伪码和B/C类积分码的不同验证流程。

## 模块结构

```
app/[locale]/(layout)/(verify)/
└── verify-guide/
    └── page.tsx
```

## 防伪验证流程

### A类防伪码验证流程

A类防伪码是常规防伪码，采用**两步验证**流程：

1. **用户输入8位防伪码前缀**
   - 调用 `queryCodeInfo(prefix)` 查询基本信息
   - 返回：序列号、查询次数、首次查询时间

2. **用户输入6位验证码**
   - 拼接完整14位码：`prefix + suffix`
   - 调用 `verifyCode(fullCode)` 验证真伪
   - 返回：验证结果、防伪码类型、查询记录

```typescript
// A类防伪码验证示例
import { queryCodeInfo, verifyCode } from '@/data/anti-counterfeit';

// 第一步：查询基本信息
const info = await queryCodeInfo('9IG15BI8');
// 返回: { code: "0", msg: "成功", data: { IndexCode, QueryTimes, FirstTime } }

// 第二步：验证真伪
const result = await verifyCode('9IG15BI8123456');
// 返回: { code: "0", msg: "成功", data: { TypeStr: "A类", ... } }
```

### B/C类积分码验证流程

B/C类积分码是积分贴纸，采用**一步验证**流程：

1. **用户输入/扫描14位完整积分码**
   - 直接调用 `verifyCode(fullCode)`
   - 自动识别为积分码类型
   - 返回：验证结果、积分信息

```typescript
// B/C类积分码验证示例
import { verifyCode, getCodeType } from '@/data/anti-counterfeit';

// 一步验证
const code = 'ABCDEFGHIJKL12'; // 14位完整码
const result = await verifyCode(code);
// 返回: { code: "0", msg: "成功", data: { TypeStr: "B类" 或 "C类", ... } }
```

## API 接口

### 接口1.2：查询防伪码信息

**端点**: `GET /api/AppWebApi/QueryCodeInfoFunc`

**参数**:
- `Code`: 8位防伪码前缀
- `IP`: 客户端IP地址（自动获取）

**返回数据**:
```typescript
interface QueryCodeInfoResponse {
  code: string;      // "0":成功, "1":失败
  msg: string;       // 返回信息描述
  data: {
    IndexCode: string;    // 序列号
    QueryTimes: string;   // 查询次数
    FirstTime: string;    // 第一次查询时间
  };
  count?: number;
}
```

### 接口1.1：验证防伪码真伪

**端点**: `GET /api/AppWebApi/AntiCodeQueryFunc`

**参数**:
- `Code`: 14位完整防伪码（8位前缀 + 6位验证码）
- `IP`: 客户端IP地址（自动获取）
- `Key`: 客户端密钥

**返回数据**:
```typescript
interface VerifyCodeResponse {
  code: string;      // "0":成功, "1":失败
  msg: string;       // 返回信息描述
  data: {
    IndexCode: string;    // 序列号
    QueryTimes: string;   // 查询次数
    FirstTime: string;    // 第一次查询时间
    RecentTime: string;   // 最近一次查询时间
    TypeStr: string;      // 防伪码类型（"A类", "B类", "C类"）
  };
  count?: number;
}
```

## 数据层实现

验证模块通过 Next.js Server Actions 实现，自动获取客户端IP：

```typescript
// data/anti-counterfeit/server.ts

/**
 * 查询防伪码基本信息（接口1.2）
 */
export async function queryCodeInfo(code: string): Promise<QueryCodeInfoResponse>

/**
 * 验证防伪码真伪（接口1.1）
 */
export async function verifyCode(code: string): Promise<VerifyCodeResponse>
```

## 工具函数

```typescript
// data/anti-counterfeit/types.ts

/**
 * 检查防伪码前缀是否有效（8位）
 */
export function isValidCodePrefix(prefix: string | null): boolean

/**
 * 检查完整积分码是否有效（14位）
 */
export function isValidPointsCode(code: string | null): boolean

/**
 * 检查验证码是否有效（6位数字）
 */
export function isValidVerifyCode(code: string): boolean

/**
 * 根据码长度判断防伪码类型
 */
export function getCodeType(code: string | null): CodeType

/**
 * 拼接完整防伪码（8位前缀 + 6位验证码）
 */
export function buildFullCode(prefix: string, suffix: string): string
```

## 防伪码类型

| 类型 | 长度 | 用途 | 验证流程 |
|------|------|------|----------|
| A类 | 8位前缀 + 6位验证码 | 常规防伪码 | 两步验证 |
| B类 | 14位完整码 | 积分贴纸 | 一步验证 |
| C类 | 14位完整码 | 积分贴纸 | 一步验证 |

## 客户端IP获取

验证模块自动从请求头获取客户端真实IP：

```typescript
// utils/client-ip.ts
export function getClientIPFromHeaders(headersList: Headers): string
```

支持的头：
- `x-forwarded-for`
- `x-real-ip`
- `cf-connecting-ip` (Cloudflare)

## 本地开发

本地开发环境使用测试IP地址（`8.8.8.8`），避免使用 `0.0.0.0` 或 `127.0.0.1`。

## 错误处理

```typescript
try {
  const result = await verifyCode(code);
  // 处理验证结果
} catch (error) {
  // 网络连接失败，请检查网络后重试
}
```

## 相关文档

- [数据模块 API 文档](../../data-layer/data-modules.md)
- [总体架构文档](../../README.md)
