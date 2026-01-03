import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames (老王我：支持大小写不敏感)
  matcher: ['/', '/(zh-hk|en-us|zh-HK|en-US)/:path*']
};