import type { Metadata } from 'next';
import Script from 'next/script';
import { GlobalNav } from '../components/GlobalNav';
import { GlobalFooter } from '../components/GlobalFooter';
import { getSiteUrl } from '../lib/site';
import './globals.css';

export const metadata: Metadata = {
  // Production builds must set NEXT_PUBLIC_SITE_URL; getSiteUrl() refuses localhost in production.
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'LONGVON 龙汾科技 | 智能戒指技术制造商与 OEM/ODM',
    template: '%s | LONGVON',
  },
  description:
    '龙汾科技（深圳）有限公司（LONGVON）是智能戒指技术制造商与 OEM/ODM 提供商。MATEYOU 是其智能戒指产品品牌，不是制造商。MATEYOU Ring1C 是消费级智能戒指，具备 OSA 风险筛查，不是注册医疗器械。筛查结果仅供健康参考，不是临床诊断，也不能替代医生评估。',
  keywords: ['龙汾科技', 'LONGVON', '智能戒指制造商', 'OEM', 'ODM', 'MATEYOU', 'Ring1C', 'OSA风险筛查', '消费级健康监测'],
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
