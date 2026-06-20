import type { Metadata } from 'next';
import Script from 'next/script';
import { GlobalNav } from '../components/GlobalNav';
import { GlobalFooter } from '../components/GlobalFooter';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.longvon.com'),
  title: {
    default: 'MATEYOU · AI数字健康平台 | 龙汾科技',
    template: '%s | MATEYOU',
  },
  description: 'MATEYOU是龙汾科技旗下AI数字健康平台，搭载Ring1C智能戒指，提供睡眠、OSA、压力、减重、糖尿病、高原适应六大健康风险自评服务。',
  keywords: ['健康自评', '智能戒指', 'OSA风险筛查', '睡眠监测', 'AI健康', 'Ring1C', '龙汾科技', 'MATEYOU'],
  authors: [{ name: '龙汾科技', url: 'https://www.longvon.com' }],
  openGraph: {
    type: 'website',
    siteName: 'MATEYOU',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: false }, // 不面向Google，面向百度
  },
  other: {
    // 百度站点验证（实际值在部署时填入）
    'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION ?? '',
  },
};

const BAIDU_TONGJI_ID = process.env.NEXT_PUBLIC_BAIDU_TONGJI_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
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
        <GlobalNav />
        {children}
        <GlobalFooter />
      </body>
    </html>
  );
}
