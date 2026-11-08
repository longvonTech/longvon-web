import type { Metadata } from 'next';
import Script from 'next/script';
import { headers } from 'next/headers';
import { GlobalNav } from '../components/GlobalNav';
import { GlobalFooter } from '../components/GlobalFooter';
import { LeadAttributionCapture } from '../components/LeadAttributionCapture';
import { HTML_LANG_HEADER } from '../lib/i18n-routes';
import { getSiteUrl } from '../lib/site';
import './globals.css';

export const metadata: Metadata = {
  // Production builds must set NEXT_PUBLIC_SITE_URL; getSiteUrl() refuses localhost in production.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: '智能戒指制造商与 OEM/ODM | LONGVON 龙汾科技',
    template: '%s | LONGVON',
  },
  description:
    'LONGVON（龙汾科技）是智能戒指制造商及 OEM/ODM 技术方案提供商，提供硬件、固件、健康算法、App、SDK/API 与制造。MATEYOU 是 LONGVON 的消费级智能戒指产品品牌，不是制造商。',
  keywords: [
    'LONGVON',
    '龙汾科技',
    '智能戒指制造商',
    '智能戒指 OEM',
    '智能戒指 ODM',
    'MATEYOU',
    'Ring1C',
    '智能戒指',
  ],
  authors: [{ name: '龙汾科技', url: 'https://www.longvon.com' }],
  openGraph: {
    type: 'website',
    siteName: 'LONGVON',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    // 百度站点验证（实际值在部署时填入）
    'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION ?? '',
  },
};

const BAIDU_TONGJI_ID = process.env.NEXT_PUBLIC_BAIDU_TONGJI_ID;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const lang = headerList.get(HTML_LANG_HEADER) === 'en' ? 'en' : 'zh-CN';
  return (
    <html lang={lang}>
      <head>
        {/* 百度统计——仅在有统计ID时注入，避免本地开发被误统计 */}
        {BAIDU_TONGJI_ID && (
          <Script id="baidu-tongji" strategy="afterInteractive">
            {`var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?${BAIDU_TONGJI_ID}";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`}
          </Script>
        )}
      </head>
      <body>
        <LeadAttributionCapture />
        <GlobalNav />
        {children}
        <GlobalFooter />
      </body>
    </html>
  );
}
