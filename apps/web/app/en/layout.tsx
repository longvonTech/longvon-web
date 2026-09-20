import type { ReactNode } from 'react';
import { HtmlLang } from '../../components/HtmlLang';

/**
 * English GEO section layout.
 * Root html remains zh-CN; HtmlLang sets documentElement.lang=en for this subtree.
 */
export default function EnglishGeoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HtmlLang lang="en" />
      {children}
    </>
  );
}
