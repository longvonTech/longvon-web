'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { captureLeadAttribution } from '../lib/lead-attribution';

/**
 * Mount once in root layout so first-touch is locked before OEM forms hydrate.
 */
export function LeadAttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureLeadAttribution(pathname || '/');
  }, [pathname]);

  return null;
}
