import { Module } from '@nestjs/common';
import { NewsAdminController } from './news-admin.controller';
import { NewsPublicController } from './news-public.controller';
import { NewsService } from './news.service';

@Module({
  controllers: [NewsAdminController, NewsPublicController],
  providers: [NewsService],
})
export class NewsModule {}
