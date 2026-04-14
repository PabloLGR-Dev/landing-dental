import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // En Next 15, requestLocale es una promesa, hay que esperarla
  let locale = await requestLocale;
  
  // Si no hay idioma, usamos español
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    // Subimos dos niveles (../../) porque ahora estamos dentro de src/i18n/
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});