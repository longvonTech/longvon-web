import type { Metadata } from 'next';
import type { ReactNode } from 'react';

/** Consumer membership dashboard is a MATEYOU surface, not a LONGVON OEM page. */
export const metadata: Metadata = {
  title: { absolute: '我的健康中心 | MATEYOU' },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
