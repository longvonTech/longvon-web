import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** Consumer assessment flows keep the MATEYOU brand in document titles. */
export const metadata: Metadata = {
  title: { absolute: '健康风险评估 | MATEYOU' },
};

export default function AssessmentLayout({ children }: { children: ReactNode }) {
  return children;
}
