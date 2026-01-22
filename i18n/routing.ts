import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['zh-cn', 'en-us', 'zh-hk'],

  // Used when no locale matches
  defaultLocale: 'zh-cn',

  // 老王我：SEO 最佳实践 - 所有 locale 都显示在 URL 中
  // 'always' = 所有 locale 都显示（SEO 最友好）✅
  // 'as-needed' = 默认 locale 不显示，其他 locale 显示
  // 'never' = 所有 locale 都不显示（SEO 不推荐）
  localePrefix: 'always'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);