import { Body, Controller, Get, Headers, Param, Patch, Post, Query } from '@nestjs/common';
import { verifyAdminToken } from '../common/admin-auth.util';
import {
  CorrectionDto,
  CreateApiRunDto,
  CreateCaptureDto,
  ReviewResultDto,
  UpdateCaptureDto,
} from './dto/geo-benchmark.dto';
import { GeoBenchmarkService, type ResultFilters } from './geo-benchmark.service';

@Controller('admin/geo-benchmark')
export class GeoBenchmarkController {
  constructor(private readonly service: GeoBenchmarkService) {}

  @Get('providers')
  providers(@Headers('x-admin-token') token: string) {
    verifyAdminToken(token);
    return this.service.providerStatus();
  }

  @Get('queries')
  queries(@Headers('x-admin-token') token: string) {
    verifyAdminToken(token);
    return this.service.listQueries();
  }

  @Get('coverage')
  coverage(
    @Headers('x-admin-token') token: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    verifyAdminToken(token);
    return this.service.coverage(this.filters(query));
  }

  @Get('metrics')
  metrics(
    @Headers('x-admin-token') token: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    verifyAdminToken(token);
    return this.service.metrics(this.filters(query));
  }

  @Get('results')
  results(
    @Headers('x-admin-token') token: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    verifyAdminToken(token);
    return this.service.listResults(this.filters(query));
  }

  @Get('results/:id')
  result(@Headers('x-admin-token') token: string, @Param('id') id: string) {
    verifyAdminToken(token);
    return this.service.getResult(id);
  }

  @Post('captures')
  capture(@Headers('x-admin-token') token: string, @Body() dto: CreateCaptureDto) {
    verifyAdminToken(token);
    return this.service.createCapture(dto);
  }

  @Patch('results/:id')
  update(
    @Headers('x-admin-token') token: string,
    @Param('id') id: string,
    @Body() dto: UpdateCaptureDto,
  ) {
    verifyAdminToken(token);
    return this.service.updateCapture(id, dto);
  }

  @Post('results/:id/review')
  review(
    @Headers('x-admin-token') token: string,
    @Param('id') id: string,
    @Body() dto: ReviewResultDto,
  ) {
    verifyAdminToken(token);
    return this.service.review(id, dto);
  }

  @Post('results/:id/corrections')
  correct(
    @Headers('x-admin-token') token: string,
    @Param('id') id: string,
    @Body() dto: CorrectionDto,
  ) {
    verifyAdminToken(token);
    return this.service.correct(id, dto);
  }

  @Post('runs')
  run(@Headers('x-admin-token') token: string, @Body() dto: CreateApiRunDto) {
    verifyAdminToken(token);
    return this.service.runApi(dto);
  }

  @Get('export')
  export(
    @Headers('x-admin-token') token: string,
    @Query() query: Record<string, string | undefined>,
  ) {
    verifyAdminToken(token);
    return this.service.exportData(
      this.filters(query),
      query.format ?? 'json',
      query.operatorLabel ?? null,
    );
  }

  private filters(query: Record<string, string | undefined>): ResultFilters {
    return {
      provider: query.provider,
      mode: query.mode,
      category: query.category,
      status: query.status,
      queryCode: query.queryCode,
      from: query.from,
      to: query.to,
      page: query.page ? parseInt(query.page, 10) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize, 10) : undefined,
    };
  }
}
