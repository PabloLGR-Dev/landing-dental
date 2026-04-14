import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es'
});
 
// ¡Esto reemplaza a next/navigation para evitar los errores rojos!
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);