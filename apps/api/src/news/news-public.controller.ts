import { Controller, Get, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsPublicController {
  constructor(private readonly service: NewsService) {}

  @Get()
  list(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.service.findPublishedList(
      parseInt(page, 10) || 1,
      parseInt(pageSize, 10) || 20,
    );
  }

  @Get(':slug')
  detail(@Param('slug') slug: string) {
    return this.service.findPublishedBySlug(slug);
  }
}
