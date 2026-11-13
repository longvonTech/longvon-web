import type { ReactNode } from 'react';

/**
 * English section layout.
 * Document language is set on `<html>` by the root layout from the request path
 * (SSR). Do not restore client-only lang mutation here.
 */
export default function EnglishGeoLayout({ children }: { children: ReactNode }) {
  return children;
}
