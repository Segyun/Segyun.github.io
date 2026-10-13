export const languages = {
  ko: '한국어',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ko';

export const ui = {
  ko: {
    'site.title': 'Segyun',
    'nav.home': '홈',
    'nav.blog': '블로그',
    'nav.projects': '프로젝트',
    'nav.about': '소개',
    'home.blog_title': '블로그',
    'home.projects_title': '프로젝트',
    'home.view_all': '전체보기',
    'blog.title': '블로그',
    'blog.back': '전체 글 목록으로 돌아가기',
    'blog.empty': '아직 등록된 글이 없습니다.',
    'projects.title': '프로젝트',
    'projects.back': '전체 프로젝트로 돌아가기',
    'projects.repo': 'GitHub 저장소',
    'projects.demo': '라이브 데모',
    'projects.empty': '등록된 프로젝트가 없습니다.',
    'about.title': '소개 | Segyun',
    'about.description': 'Segyun 소개',
  },
  en: {
    'site.title': 'Segyun',
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'home.blog_title': 'Blog',
    'home.projects_title': 'Projects',
    'home.view_all': 'View all',
    'blog.title': 'Blog',
    'blog.back': 'Back to all posts',
    'blog.empty': 'No posts published yet in English.',
    'projects.title': 'Projects',
    'projects.back': 'Back to all projects',
    'projects.repo': 'GitHub',
    'projects.demo': 'Live Demo',
    'projects.empty': 'No projects published yet in English.',
    'about.title': 'About | Segyun',
    'about.description': 'About Segyun',
  },
} as const;

export type TranslationKey = keyof (typeof ui)[typeof defaultLang];

export function useTranslations(lang: Lang = defaultLang) {
  return function t(key: TranslationKey): string {
    return ui[lang]?.[key] ?? ui[defaultLang][key];
  };
}

export function formatDate(date: Date, lang: Lang = defaultLang): string {
  return date.toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
