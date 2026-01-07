import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

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