import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // standalone模式：将所有依赖打包进独立产物，生产容器不再需要node_modules
  // 配合apps/web/Dockerfile的多阶段构建，可将镜像体积从500MB+压缩到~100MB
  output: 'standalone',
  reactStrictMode: true,
  // 允许从阿里云OSS或CDN加载图片（生产环境图片托管域名）
  images: {
    remotePatterns: [
      // 生产环境图片CDN域名——部署时在.env.production中设置NEXT_PUBLIC_CDN_URL后取消注释
      // { protocol: 'https', hostname: '*.aliyuncs.com' },
    ],
  },
};

export default nextConfig;
