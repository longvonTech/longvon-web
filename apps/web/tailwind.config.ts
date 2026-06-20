import type { Config } from 'tailwindcss';

// Sprint 1为最小占位配置，不预设health-design-system-v1.md的Risk/Status/Trend
// Token体系——那套Token体系应在真正实现各页面模板的Sprint中，
// 由具体页面需求驱动逐步落地为Tailwind theme.extend配置，
// 现在预先搭一套空壳token容易在后续被随意填入未经设计评审的临时值。
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
