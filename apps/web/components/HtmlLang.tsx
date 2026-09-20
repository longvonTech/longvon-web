'use client';

import { useEffect } from 'react';

/** Sets <html lang> for locale sections under a single root layout. */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev || 'zh-CN';
    };
  }, [lang]);
  return null;
}
