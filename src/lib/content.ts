import type { CollectionEntry } from 'astro:content';
import type { Lang } from '@/i18n/ui';

export interface ParsedContentEntry<T> {
  baseSlug: string;
  lang: Lang;
  entry: T;
}

/**
 * Parses an entry id into base slug and language.
 *
 * Supports patterns:
 * - 'package/fluid-header/index.en' -> baseSlug: 'package/fluid-header', lang: 'en'
 * - 'package/fluid-header'          -> baseSlug: 'package/fluid-header', lang: 'ko'
 * - 'index.en'                      -> baseSlug: 'index', lang: 'en'
 * - 'index'                         -> baseSlug: 'index', lang: 'ko'
 * - 'post-name.en'                  -> baseSlug: 'post-name', lang: 'en'
 */
export function parseContentId(id: string): { baseSlug: string; lang: Lang } {
  if (id.endsWith('/indexen')) {
    return {
      baseSlug: id.slice(0, -8),
      lang: 'en',
    };
  }
  if (id.endsWith('/index.en')) {
    return {
      baseSlug: id.slice(0, -9),
      lang: 'en',
    };
  }
  if (id === 'indexen' || id === 'index.en') {
    return {
      baseSlug: 'index',
      lang: 'en',
    };
  }
  if (id.endsWith('.en')) {
    return {
      baseSlug: id.slice(0, -3),
      lang: 'en',
    };
  }
  return {
    baseSlug: id,
    lang: 'ko',
  };
}

/**
 * Filters a collection of entries for a specific language.
 */
export function filterEntriesByLang<T extends { id: string }>(
  entries: T[],
  targetLang: Lang
): Array<{ baseSlug: string; entry: T }> {
  const result: Array<{ baseSlug: string; entry: T }> = [];

  for (const entry of entries) {
    const { baseSlug, lang } = parseContentId(entry.id);
    if (lang === targetLang) {
      result.push({ baseSlug, entry });
    }
  }

  return result;
}
