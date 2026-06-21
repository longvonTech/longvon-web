module.exports = {
  apps: [
    {
      name: 'mateyou-api',
      script: '/root/mateyou/apps/api/dist/main.js',
      env: {
        NODE_ENV: 'production',
        API_PORT: 4000,
        DATABASE_URL: 'postgresql://mateyou:Mateyou2024DbLongvon888@localhost:5432/mateyou_prod',
        REDIS_URL: 'redis://:Mateyou2024DbLongvon888@localhost:6379',
        JWT_ACCESS_SECRET: '71c3b0213049352e8511b13175d06f535adf3459b70b86b8e32e83ea17cab957bd82357cb06d7a106edd3a1c744336856b22e4fc8f29b5d6dae834cae71ee907',
        JWT_REFRESH_SECRET: 'ad08fa74596a147419cbde987e3b8665c5030995568c7cfb5b90b99ade66714c78a02373051162003d3ff30e654f8194643851ddf8124345dbeb430d1904b46d',
        JWT_ACCESS_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '30d',
        ADMIN_IMAGE_PASSWORD: 'Mateyou@Admin2024',
        IMAGES_BASE_DIR: '/var/www/mateyou',
        WECOM_WEBHOOK_URL: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=37f63a1c-3b99-49c3-8485-fecbbcc4c966',
        DASHSCOPE_API_KEY: 'sk-ws-H.RPRIIIX.caDl.MEUCIQCbLxI5hBzRutEWVUMJEPfFy6iYtj0CFuVtmMFupo7wbAIgRX81TSar8w2Hp-opD6-RjTNfFJkdexWpTinIBKAUUrI',
      }
    },
    {
      name: 'mateyou-web',
      script: '/root/mateyou/apps/web/.next/standalone/apps/web/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_SITE_URL: 'http://www.longvon.com',
        NEXT_PUBLIC_BAIDU_VERIFICATION: 'codeva-Ex4BRZLx09',
        NEXT_PUBLIC_API_BASE_URL: 'http://www.longvon.com/api',
      }
    }
  ]
};
