import { Module } from '@nestjs/common';
import { HealthDataController } from './health-data.controller';
import { LongvonChannelClient } from './longvon-channel.client';

@Module({
  controllers: [HealthDataController],
  providers: [LongvonChannelClient],
  exports: [LongvonChannelClient],
})
export class HealthDataModule {}
