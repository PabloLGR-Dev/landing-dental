import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default createMiddleware(routing);
 
export const config = {
  // El matcher perfecto que no bloquea la app
  matcher: ['/', '/(es|en)/:path*']
};