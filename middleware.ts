import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import {routing} from './i18n/routing';

// ============================================================================
// 认证配置 - 受保护的路由列表
// ============================================================================
const PROTECTED_ROUTES = [
  // 用户仪表盘路由（支持所有语言前缀）
  '/account-page',
  '/account-orders',
  '/account-orders-detail',
  '/account-addresses',
  '/account-setting',
];

// 公开路由（即使已登录也可以访问）
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/reset-password',
  '/update-password',
];

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检查路径是否匹配受保护路由
 * @param pathname - 请求路径（已移除 locale 前缀）
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => {
    // 精确匹配或前缀匹配
    if (pathname === route) return true;
    if (pathname.startsWith(route + '/')) return true;
    if (pathname.startsWith('/' + route)) return true;
    return false;
  });
}

/**
 * 检查路径是否是公开路由
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (pathname === route) return true;
    if (pathname.startsWith(route + '/')) return true;
    if (pathname.startsWith('/' + route)) return true;
    return false;
  });
}

/**
 * 从请求中提取 JWT token
 */
function getAuthToken(request: NextRequest): string | undefined {
  // 从 cookie 中读取 _medusa_jwt
  return request.cookies.get('_medusa_jwt')?.value;
}

/**
 * 移除 locale 前缀，获取实际的路径
 */
function getPathnameWithoutLocale(pathname: string, locales: string[]): string {
  // 尝试移除 locale 前缀（例如：/en-us/account-page -> /account-page）
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(`/${locale}`.length) || '/';
    }
  }
  return pathname;
}

/**
 * 从路径中提取 locale
 */
function getLocaleFromPathname(pathname: string, locales: string[]): string {
  const localeMatch = pathname.match(`^\/(${locales.join('|')})`);
  return localeMatch ? localeMatch[1] : routing.defaultLocale;
}

// ============================================================================
// next-intl middleware 实例
// ============================================================================
const intlMiddleware = createMiddleware(routing);

// ============================================================================
// 主 Middleware 函数
// ============================================================================
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. 跳过静态文件和 API 路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_static') ||
    pathname.includes('.') // 静态资源文件
  ) {
    return intlMiddleware(request);
  }

  // 2. 移除 locale 前缀，获取实际路径
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname, routing.locales);

  // 3. 检查是否需要认证保护
  const isProtected = isProtectedRoute(pathnameWithoutLocale);
  const isPublic = isPublicRoute(pathnameWithoutLocale);
  const token = getAuthToken(request);
  const isAuthenticated = !!token;

  // 4. 处理受保护路由
  if (isProtected && !isAuthenticated) {
    // 未登录用户访问受保护页面 → 重定向到登录页
    const url = request.nextUrl.clone();

    // 构建登录页 URL（保留当前语言）
    const currentLocale = getLocaleFromPathname(pathname, routing.locales);

    // 设置登录页路径
    url.pathname = `/${currentLocale}/login`;

    // 保存原始 URL 用于登录后返回
    url.searchParams.set('returnUrl', pathname);

    return NextResponse.redirect(url);
  }

  // 5. 处理已登录用户访问登录/注册页面
  if (isPublic && isAuthenticated) {
    // 已登录用户访问登录页 → 重定向到账户页
    const url = request.nextUrl.clone();

    // 保留当前 locale
    const currentLocale = getLocaleFromPathname(pathname, routing.locales);

    // 重定向到账户页面
    url.pathname = `/${currentLocale}/account-page`;

    return NextResponse.redirect(url);
  }

  // 6. 其他情况交给 next-intl middleware 处理
  return intlMiddleware(request);
}

// ============================================================================
// Middleware 配置
// ============================================================================
export const config = {
  // 老王我：匹配所有路径，因为现在所有 locale 都显示在 URL 中
  // Skip next-intl 内部路径和静态文件
  matcher: [
    // 匹配所有路径，排除以下：
    // 1. _next (Next.js 内部)
    // 2. api (API 路由)
    // 3. _static (静态文件)
    // 4. 图片、字体等静态资源
    '/((?!api|_next|_static|.*\\..*).*)'
  ]
};
