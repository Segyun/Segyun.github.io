import type { Lang } from './ui';

/**
 * Returns current locale based on pathname.
 */
export function getCurrentLocale(pathname: string): Lang {
  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return 'en';
  }
  return 'ko';
}

/**
 * Returns localized path for given lang.
 * 'ko' has no prefix (default), 'en' is prefixed with '/en'.
 */
export function getLocalizedPath(pathname: string, targetLang: Lang): string {
  // Normalize pathname to remove trailing slash if not root
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  if (targetLang === 'ko') {
    if (cleanPath === '/en') return '/';
    if (cleanPath.startsWith('/en/')) {
      return cleanPath.slice(3) || '/';
    }
    return cleanPath || '/';
  }

  // targetLang === 'en'
  if (cleanPath === '/en' || cleanPath.startsWith('/en/')) {
    return cleanPath;
  }
  if (cleanPath === '/' || cleanPath === '') {
    return '/en';
  }
  return `/en${cleanPath}`;
}

/**
 * Computes destination URL when switching languages on the current page.
 */
export function getSwitchLocaleUrl(currentPath: string, targetLang: Lang): string {
  return getLocalizedPath(currentPath, targetLang);
}
