import { Module } from '@nestjs/common';
import { GeoBenchmarkController } from './geo-benchmark.controller';
import { GeoBenchmarkService } from './geo-benchmark.service';

@Module({
  controllers: [GeoBenchmarkController],
  providers: [GeoBenchmarkService],
})
export class GeoBenchmarkModule {}
