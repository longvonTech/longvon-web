import { Body, Controller, Delete, Get, Headers, Param, Patch, Post } from '@nestjs/common';
import { verifyAdminToken } from '../common/admin-auth.util';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

@Controller('admin/news')
export class NewsAdminController {
  constructor(private readonly service: NewsService) {}

  @Get()
  findAll(@Headers('x-admin-token') token: string) {
    verifyAdminToken(token);
    return this.service.findAllForAdmin();
  }

  @Get(':id')
  findOne(@Headers('x-admin-token') token: string, @Param('id') id: string) {
    verifyAdminToken(token);
    return this.service.findByIdForAdmin(id);
  }

  @Post()
  create(@Headers('x-admin-token') token: string, @Body() dto: CreateNewsDto) {
    verifyAdminToken(token);
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Headers('x-admin-token') token: string,
    @Param('id') id: string,
    @Body() dto: UpdateNewsDto,
  ) {
    verifyAdminToken(token);
    return this.service.update(id, dto);
  }

  @Post(':id/publish')
  publish(@Headers('x-admin-token') token: string, @Param('id') id: string) {
    verifyAdminToken(token);
    return this.service.publish(id);
  }

  @Post(':id/unpublish')
  unpublish(@Headers('x-admin-token') token: string, @Param('id') id: string) {
    verifyAdminToken(token);
    return this.service.unpublish(id);
  }

  @Delete(':id')
  delete(@Headers('x-admin-token') token: string, @Param('id') id: string) {
    verifyAdminToken(token);
    return this.service.delete(id);
  }
}
