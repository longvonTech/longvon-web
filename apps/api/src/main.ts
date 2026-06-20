import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局校验管道：DTO上的class-validator装饰器在此生效，
  // whitelist=true会自动剔除DTO未声明的字段，防止意外的字段被写入数据库
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS：Sprint 1仅开放本地Web开发地址，生产环境配置留待部署阶段按
  // alicloud-deployment-v1.md实际域名收紧
  // （此前版本误用WEB_PUBLIC_API_BASE_URL——那是前端用来访问API的地址，
  // 不是前端自身的来源地址，二者不能混用，已修正为独立的WEB_APP_URL变量）
  app.enableCors({
    origin: process.env.WEB_APP_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`MATEYOU API listening on port ${port}`);
}

bootstrap();
